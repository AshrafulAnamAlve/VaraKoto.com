using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VaraKoto.Core.Common;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Entities;
using VaraKoto.Core.Interfaces;
using VaraKoto.Infrastructure.Data;

namespace VaraKoto.Infrastructure.Services;

public class FareContributionService : IFareContributionService
{
    private readonly VaraKotoDbContext _context;
    private readonly ILocationService _locationService;
    private readonly IRouteService _routeService;
    private readonly IFareCalculationService _fareCalculationService;
    private readonly ILogger<FareContributionService> _logger;

    public FareContributionService(
        VaraKotoDbContext context,
        ILocationService locationService,
        IRouteService routeService,
        IFareCalculationService fareCalculationService,
        ILogger<FareContributionService> logger)
    {
        _context = context;
        _locationService = locationService;
        _routeService = routeService;
        _fareCalculationService = fareCalculationService;
        _logger = logger;
    }

    public async Task<FareContributionResponseDto> SubmitFareAsync(
        FareContributionRequestDto request, 
        string? clientIp, 
        string? userAgent, 
        CancellationToken cancellationToken = default)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        // 1. Sanity check on actual fare paid
        if (request.ActualFarePaid < 10m)
        {
            throw new ArgumentException("ভাড়া সর্বনিম্ন ১০ টাকা বা তার বেশি হতে হবে (Minimum realistic fare is ৳10).");
        }

        if (request.ActualFarePaid > 5000m)
        {
            throw new ArgumentException("ভাড়া ৫,০০০ টাকার বেশি হতে পারে না (Fare exceeds realistic threshold).");
        }

        // 2. Anti-Spam Device Fingerprint & Rate Limit
        var deviceHash = ComputeDeviceHash(clientIp, userAgent);
        var oneHourAgo = DateTime.UtcNow.AddHours(-1);

        var recentHourlyCount = await _context.FareSubmissions
            .CountAsync(s => s.DeviceHash == deviceHash && s.SubmittedAt >= oneHourAgo, cancellationToken);

        if (recentHourlyCount >= 6)
        {
            throw new InvalidOperationException("আপনি প্রতি ঘণ্টায় সর্বোচ্চ ৫টি ভাড়ার তথ্য জমা দিতে পারবেন। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন। (Rate limit exceeded: max 5 submissions per hour).");
        }

        // 3. Resolve Transport Type
        var transportCode = request.TransportCode?.ToLowerInvariant().Trim() ?? "bus";
        var transport = await _context.TransportTypes
            .Include(t => t.FareRule)
            .FirstOrDefaultAsync(t => t.Code == transportCode && t.IsActive, cancellationToken)
            ?? throw new ArgumentException($"যানবাহনের কোড সঠিক নয় (Invalid transport code '{transportCode}').");

        // 4. Resolve Locations
        var fromLoc = await ResolveLocationAsync(
            request.FromLocationId, 
            request.FromLatitude, 
            request.FromLongitude, 
            request.FromName, 
            "Origin", 
            cancellationToken);

        var toLoc = await ResolveLocationAsync(
            request.ToLocationId, 
            request.ToLatitude, 
            request.ToLongitude, 
            request.ToName, 
            "Destination", 
            cancellationToken);

        if (fromLoc.Id > 0 && toLoc.Id > 0 && fromLoc.Id == toLoc.Id)
        {
            throw new InvalidOperationException("যাত্রার স্থান এবং গন্তব্য ভিন্ন হতে হবে (Origin and destination must be different).");
        }

        // Check for rapid identical duplicate submission within 10 minutes
        var tenMinutesAgo = DateTime.UtcNow.AddMinutes(-10);
        var isDuplicate = await _context.FareSubmissions
            .AnyAsync(s => s.DeviceHash == deviceHash &&
                           s.TransportTypeId == transport.Id &&
                           s.FromLocationId == fromLoc.Id &&
                           s.ToLocationId == toLoc.Id &&
                           s.ActualFarePaid == request.ActualFarePaid &&
                           s.SubmittedAt >= tenMinutesAgo, cancellationToken);

        if (isDuplicate)
        {
            throw new InvalidOperationException("এই ভাড়ার তথ্যটি আপনি মাত্র কিছুক্ষণ আগেই জমা দিয়েছেন। (Duplicate submission detected).");
        }

        // 5. Calculate Road Distance
        var routeResult = await _routeService.CalculateDistanceAsync(
            fromLoc.Latitude, 
            fromLoc.Longitude, 
            toLoc.Latitude, 
            toLoc.Longitude, 
            fromLoc.Id > 0 ? fromLoc.Id : null, 
            toLoc.Id > 0 ? toLoc.Id : null, 
            cancellationToken);

        var distanceKm = routeResult.DistanceKm;
        var durationMinutes = routeResult.DurationMinutes;

        // 6. Outlier Detection & Moderation
        decimal maxCeiling = transport.Code switch
        {
            "bus" => 400m,
            "rickshaw" => 350m,
            "cng" => 1500m,
            "bike" => 1000m,
            _ => 1500m
        };

        var baselineFares = await _fareCalculationService.CalculateAllFaresForDistanceAsync(
            distanceKm, 
            durationMinutes, 
            fromLoc.Id > 0 ? fromLoc.Id : null, 
            toLoc.Id > 0 ? toLoc.Id : null, 
            cancellationToken);

        var matchingEstimate = baselineFares.FirstOrDefault(b => b.TransportCode.Equals(transport.Code, StringComparison.OrdinalIgnoreCase));
        decimal standardMidFare = matchingEstimate != null 
            ? (matchingEstimate.EstimatedMinFare + matchingEstimate.EstimatedMaxFare) / 2m 
            : request.ActualFarePaid;

        var ratio = standardMidFare > 0 ? (request.ActualFarePaid / standardMidFare) : 1.0m;

        string moderationStatus;
        string messageBn;
        string messageEn;

        if (request.ActualFarePaid > maxCeiling || ratio > 2.8m || ratio < 0.3m)
        {
            moderationStatus = "Flagged";
            messageBn = "আপনার দেওয়া ভাড়ার তথ্যটি স্বাভাবিক ভাড়ার চেয়ে অনেকটাই ভিন্ন হওয়ায় পর্যালোচনার জন্য রাখা হয়েছে।";
            messageEn = "Your submission deviates significantly from normal bounds and has been flagged for review.";
        }
        else if (ratio > 1.9m || ratio < 0.5m)
        {
            moderationStatus = "Pending";
            messageBn = "আপনার ভাড়ার তথ্যটি গ্রহণ করা হয়েছে এবং পর্যালোচনার জন্য জমা রাখা হয়েছে।";
            messageEn = "Your submission has been received and queued for community review.";
        }
        else
        {
            moderationStatus = "Approved";
            messageBn = "ধন্যবাদ! আপনার ভাড়ার তথ্য যাচাইকৃত হয়েছে এবং অন্য যাত্রীদের সাথে শেয়ার করা হয়েছে।";
            messageEn = "Thank you! Your fare contribution has been verified and shared with fellow commuters.";
        }

        // 7. Persist Submission to Database
        var submission = new FareSubmission
        {
            TransportTypeId = transport.Id,
            FromLocationId = fromLoc.Id ?? throw new InvalidOperationException("Origin location could not be persisted."),
            ToLocationId = toLoc.Id ?? throw new InvalidOperationException("Destination location could not be persisted."),
            ActualFarePaid = request.ActualFarePaid,
            DistanceKm = distanceKm,
            TravelDate = request.TravelDate ?? DateTime.UtcNow,
            DeviceHash = deviceHash,
            ModerationStatus = moderationStatus,
            SubmittedAt = DateTime.UtcNow
        };

        _context.FareSubmissions.Add(submission);
        await _context.SaveChangesAsync(cancellationToken);

        return new FareContributionResponseDto
        {
            SubmissionId = submission.Id,
            Status = moderationStatus,
            MessageBn = messageBn,
            MessageEn = messageEn,
            CalculatedStandardFare = standardMidFare,
            SubmittedFare = request.ActualFarePaid,
            FromLocationName = fromLoc.NameBn ?? fromLoc.DisplayName,
            ToLocationName = toLoc.NameBn ?? toLoc.DisplayName,
            TransportName = transport.NameBn,
            SubmittedAt = submission.SubmittedAt
        };
    }

    public async Task<IReadOnlyList<RecentContributionDto>> GetRecentApprovedSubmissionsAsync(
        int limit = 10, 
        CancellationToken cancellationToken = default)
    {
        var submissions = await _context.FareSubmissions
            .Include(s => s.TransportType)
            .Include(s => s.FromLocation)
            .Include(s => s.ToLocation)
            .Where(s => s.ModerationStatus == "Approved")
            .OrderByDescending(s => s.SubmittedAt)
            .Take(limit)
            .ToListAsync(cancellationToken);

        var now = DateTime.UtcNow;

        return submissions.Select(s => new RecentContributionDto
        {
            Id = s.Id,
            FromLocationName = s.FromLocation.NameBn ?? s.FromLocation.NameEn,
            ToLocationName = s.ToLocation.NameBn ?? s.ToLocation.NameEn,
            TransportCode = s.TransportType.Code,
            TransportNameBn = s.TransportType.NameBn,
            ActualFarePaid = s.ActualFarePaid,
            FareDisplayBn = $"৳{BengaliNumberHelper.ToBengaliDigits(s.ActualFarePaid)}",
            DistanceKm = s.DistanceKm,
            TimeAgoBn = FormatTimeAgo(now - s.SubmittedAt),
            SubmittedAt = s.SubmittedAt
        }).ToList();
    }

    private static string FormatTimeAgo(TimeSpan elapsed)
    {
        if (elapsed.TotalMinutes < 1)
        {
            return "এইমাত্র";
        }

        if (elapsed.TotalMinutes < 60)
        {
            var mins = (int)elapsed.TotalMinutes;
            return $"{BengaliNumberHelper.ToBengaliDigits(mins)} মিনিট আগে";
        }

        if (elapsed.TotalHours < 24)
        {
            var hours = (int)elapsed.TotalHours;
            return $"{BengaliNumberHelper.ToBengaliDigits(hours)} ঘণ্টা আগে";
        }

        var days = (int)elapsed.TotalDays;
        return $"{BengaliNumberHelper.ToBengaliDigits(days)} দিন আগে";
    }

    private static string ComputeDeviceHash(string? clientIp, string? userAgent)
    {
        var raw = $"{clientIp?.Trim() ?? "127.0.0.1"}_{userAgent?.Trim() ?? "Unknown"}";
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private async Task<LocationDto> ResolveLocationAsync(
        int? locationId, 
        decimal? latitude, 
        decimal? longitude, 
        string? name, 
        string label, 
        CancellationToken cancellationToken)
    {
        if (locationId.HasValue && locationId.Value > 0)
        {
            var dbLoc = await _context.Locations.FindAsync([locationId.Value], cancellationToken);
            if (dbLoc != null)
            {
                return new LocationDto
                {
                    Id = dbLoc.Id,
                    NameEn = dbLoc.NameEn,
                    NameBn = dbLoc.NameBn,
                    DisplayName = string.IsNullOrEmpty(dbLoc.District) ? dbLoc.NameBn : $"{dbLoc.NameBn}, {dbLoc.District}",
                    Latitude = dbLoc.Latitude,
                    Longitude = dbLoc.Longitude,
                    District = dbLoc.District,
                    Thana = dbLoc.Thana,
                    IsHub = dbLoc.IsHub,
                    Source = "Database"
                };
            }
        }

        if (latitude.HasValue && longitude.HasValue)
        {
            var resolved = await _locationService.GetOrCreateLocationAsync(
                latitude.Value, 
                longitude.Value, 
                name ?? "Custom Location", 
                name ?? "নির্দিষ্ট স্থান", 
                cancellationToken);

            return resolved;
        }

        if (!string.IsNullOrWhiteSpace(name))
        {
            var match = await _context.Locations
                .FirstOrDefaultAsync(l => l.NameBn.Contains(name) || l.NameEn.Contains(name), cancellationToken);

            if (match != null)
            {
                return new LocationDto
                {
                    Id = match.Id,
                    NameEn = match.NameEn,
                    NameBn = match.NameBn,
                    DisplayName = string.IsNullOrEmpty(match.District) ? match.NameBn : $"{match.NameBn}, {match.District}",
                    Latitude = match.Latitude,
                    Longitude = match.Longitude,
                    District = match.District,
                    Thana = match.Thana,
                    IsHub = match.IsHub,
                    Source = "Database"
                };
            }
        }

        throw new ArgumentException($"{label} location could not be determined. Please provide a location ID, coordinates, or recognizable name.");
    }
}
