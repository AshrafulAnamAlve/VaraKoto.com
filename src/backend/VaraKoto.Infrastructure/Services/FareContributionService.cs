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

        var isManualDistance = request.ManualDistanceKm.HasValue && request.ManualDistanceKm.Value > 0;

        var namesAreDistinct = !string.IsNullOrWhiteSpace(request.FromName) && 
                               !string.IsNullOrWhiteSpace(request.ToName) && 
                               !string.Equals(request.FromName.Trim(), request.ToName.Trim(), StringComparison.OrdinalIgnoreCase);

        var effectiveToLocationId = namesAreDistinct && request.FromLocationId.HasValue && request.ToLocationId.HasValue && request.FromLocationId.Value == request.ToLocationId.Value
            ? (int?)null
            : request.ToLocationId;

        // 4. Resolve Locations (allowing custom location creation if unlisted)
        var fromLoc = await ResolveLocationAsync(
            request.FromLocationId, 
            request.FromLatitude, 
            request.FromLongitude, 
            request.FromName, 
            "Origin", 
            allowCreateCustom: true,
            excludeLocationId: null,
            cancellationToken: cancellationToken);

        var toLoc = await ResolveLocationAsync(
            effectiveToLocationId, 
            request.ToLatitude, 
            request.ToLongitude, 
            request.ToName, 
            "Destination", 
            allowCreateCustom: true,
            excludeLocationId: namesAreDistinct && fromLoc.Id > 0 ? fromLoc.Id : null,
            cancellationToken: cancellationToken);

        // Disambiguate if fuzzy match still returned the same ID for different names
        if (namesAreDistinct && fromLoc.Id > 0 && toLoc.Id == fromLoc.Id)
        {
            var customTo = new Location
            {
                NameEn = request.ToName!.Trim(),
                NameBn = request.ToName!.Trim(),
                Latitude = 23.8103m,
                Longitude = 90.4125m,
                District = "নতুন/কাস্টম এলাকা",
                IsHub = false
            };
            _context.Locations.Add(customTo);
            await _context.SaveChangesAsync(cancellationToken);

            toLoc = new LocationDto
            {
                Id = customTo.Id,
                NameEn = customTo.NameEn,
                NameBn = customTo.NameBn,
                DisplayName = $"{customTo.NameBn} (নতুন এলাকা)",
                Latitude = customTo.Latitude,
                Longitude = customTo.Longitude,
                District = customTo.District,
                IsHub = false,
                Source = "CustomContribution"
            };
        }

        if (!namesAreDistinct && fromLoc.Id > 0 && toLoc.Id > 0 && fromLoc.Id == toLoc.Id)
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
        decimal distanceKm;
        decimal durationMinutes;

        if (isManualDistance)
        {
            distanceKm = Math.Round(request.ManualDistanceKm!.Value, 2);
            durationMinutes = Math.Max(5m, Math.Round(distanceKm * 3.0m, 0));
        }
        else
        {
            try
            {
                var routeResult = await _routeService.CalculateDistanceAsync(
                    fromLoc.Latitude, 
                    fromLoc.Longitude, 
                    toLoc.Latitude, 
                    toLoc.Longitude, 
                    fromLoc.Id > 0 ? fromLoc.Id : null, 
                    toLoc.Id > 0 ? toLoc.Id : null, 
                    cancellationToken);

                distanceKm = routeResult.DistanceKm;
                durationMinutes = routeResult.DurationMinutes;
            }
            catch
            {
                distanceKm = 5.0m;
                durationMinutes = 15m;
            }
        }

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
            messageBn = "আপনার দেওয়া ভাড়ার তথ্যটি স্বাভাবিক ভাড়ার চেয়ে অনেকটাই ভিন্ন হওয়ায় অ্যাডমিন পর্যালোচনার জন্য রাখা হয়েছে।";
            messageEn = "Your submission deviates significantly from normal bounds and has been flagged for admin review.";
        }
        else
        {
            // All commuter submissions are queued as Pending for Admin Approval
            moderationStatus = "Pending";
            messageBn = "ধন্যবাদ! আপনার ভাড়ার তথ্যটি সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর এটি প্রকাশিত হবে।";
            messageEn = "Thank you! Your fare contribution has been received and queued for admin review.";
        }

        // 7. Persist Submission to Database
        var submission = new FareSubmission
        {
            TransportTypeId = transport.Id,
            FromLocationId = fromLoc.Id ?? throw new InvalidOperationException("Origin location could not be persisted."),
            ToLocationId = toLoc.Id ?? throw new InvalidOperationException("Destination location could not be persisted."),
            ActualFarePaid = request.ActualFarePaid,
            CalculatedStandardFare = standardMidFare,
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

    private static LocationDto MapToDto(Location loc)
    {
        return new LocationDto
        {
            Id = loc.Id,
            NameEn = loc.NameEn,
            NameBn = loc.NameBn,
            DisplayName = string.IsNullOrEmpty(loc.District) ? loc.NameBn : $"{loc.NameBn}, {loc.District}",
            Latitude = loc.Latitude,
            Longitude = loc.Longitude,
            District = loc.District,
            Thana = loc.Thana,
            IsHub = loc.IsHub,
            Source = "Database"
        };
    }

    private async Task<LocationDto> ResolveLocationAsync(
        int? locationId, 
        decimal? latitude, 
        decimal? longitude, 
        string? name, 
        string label, 
        bool allowCreateCustom,
        int? excludeLocationId,
        CancellationToken cancellationToken)
    {
        if (locationId.HasValue && locationId.Value > 0)
        {
            var dbLoc = await _context.Locations.FindAsync([locationId.Value], cancellationToken);
            if (dbLoc != null && (excludeLocationId == null || dbLoc.Id != excludeLocationId.Value))
            {
                return MapToDto(dbLoc);
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
            var cleanName = name.Trim();

            // 1. Exact match (case-insensitive)
            var exactMatch = await _context.Locations
                .Where(l => excludeLocationId == null || l.Id != excludeLocationId.Value)
                .FirstOrDefaultAsync(l => l.NameBn.ToLower() == cleanName.ToLower() || l.NameEn.ToLower() == cleanName.ToLower(), cancellationToken);

            if (exactMatch != null)
            {
                return MapToDto(exactMatch);
            }

            // 2. StartsWith match (e.g. "Dhan" matches "Dhanmondi")
            if (cleanName.Length >= 3)
            {
                var prefixMatch = await _context.Locations
                    .Where(l => excludeLocationId == null || l.Id != excludeLocationId.Value)
                    .FirstOrDefaultAsync(l => l.NameBn.StartsWith(cleanName) || l.NameEn.StartsWith(cleanName), cancellationToken);

                if (prefixMatch != null)
                {
                    return MapToDto(prefixMatch);
                }
            }

            // 3. Whole Word match (avoid substring traps like "Ajuk" matching inside "Rajuk")
            if (cleanName.Length >= 4)
            {
                var wordMatch = await _context.Locations
                    .Where(l => excludeLocationId == null || l.Id != excludeLocationId.Value)
                    .FirstOrDefaultAsync(l => cleanName.Contains(l.NameBn) || cleanName.Contains(l.NameEn) ||
                                              l.NameBn.Contains(" " + cleanName) || l.NameEn.Contains(" " + cleanName), cancellationToken);

                if (wordMatch != null)
                {
                    return MapToDto(wordMatch);
                }
            }

            // Fallback: search geocoding via _locationService
            try
            {
                var searchResults = await _locationService.SearchLocationsAsync(cleanName, 2, cancellationToken);
                var topMatch = searchResults.FirstOrDefault(s => excludeLocationId == null || s.Id != excludeLocationId.Value);
                if (topMatch != null)
                {
                    return await _locationService.GetOrCreateLocationAsync(
                        topMatch.Latitude,
                        topMatch.Longitude,
                        topMatch.NameEn,
                        topMatch.NameBn,
                        cancellationToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to resolve location '{Name}' via geocoding", cleanName);
            }

            // Fallback: Match by district/thana keywords in cleanName
            var hubKeywords = await _context.Locations
                .Where(l => l.IsHub && (excludeLocationId == null || l.Id != excludeLocationId.Value))
                .ToListAsync(cancellationToken);

            var matchedHub = hubKeywords.FirstOrDefault(h => 
                (cleanName.Length >= 4 && (h.NameBn.StartsWith(cleanName) || h.NameEn.StartsWith(cleanName))) ||
                (!string.IsNullOrEmpty(h.District) && cleanName.Contains(h.District, StringComparison.OrdinalIgnoreCase)) ||
                (!string.IsNullOrEmpty(h.Thana) && cleanName.Contains(h.Thana, StringComparison.OrdinalIgnoreCase)));

            if (matchedHub != null)
            {
                return new LocationDto
                {
                    Id = matchedHub.Id,
                    NameEn = cleanName,
                    NameBn = cleanName,
                    DisplayName = $"{cleanName} ({matchedHub.NameBn} এর কাছে)",
                    Latitude = matchedHub.Latitude,
                    Longitude = matchedHub.Longitude,
                    District = matchedHub.District,
                    Thana = matchedHub.Thana,
                    IsHub = false,
                    Source = "HubFallback"
                };
            }

            if (allowCreateCustom)
            {
                var customLoc = new Location
                {
                    NameEn = cleanName,
                    NameBn = cleanName,
                    Latitude = 23.8103m,
                    Longitude = 90.4125m,
                    District = "নতুন/কাস্টম এলাকা",
                    IsHub = false
                };
                _context.Locations.Add(customLoc);
                await _context.SaveChangesAsync(cancellationToken);

                return new LocationDto
                {
                    Id = customLoc.Id,
                    NameEn = customLoc.NameEn,
                    NameBn = customLoc.NameBn,
                    DisplayName = $"{customLoc.NameBn} (নতুন এলাকা)",
                    Latitude = customLoc.Latitude,
                    Longitude = customLoc.Longitude,
                    District = customLoc.District,
                    IsHub = false,
                    Source = "CustomContribution"
                };
            }
        }

        var labelBn = label == "Origin" ? "যাত্রার প্রারম্ভিক স্থান" : "গন্তব্য স্থান";
        throw new ArgumentException($"'{name ?? labelBn}' ম্যাপে চিহ্নিত করা সম্ভব হয়নি। অনুগ্রহ করে ড্রপডাউন থেকে বাছাই করুন, ম্যাপে পিন করুন অথবা আনুমানিক দূরত্ব লিখুন।");
    }
}
