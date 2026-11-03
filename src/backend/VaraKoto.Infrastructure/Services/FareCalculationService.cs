using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VaraKoto.Core.Common;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Entities;
using VaraKoto.Core.Interfaces;
using VaraKoto.Infrastructure.Data;

namespace VaraKoto.Infrastructure.Services;

public class FareCalculationService : IFareCalculationService
{
    private readonly VaraKotoDbContext _context;
    private readonly ILocationService _locationService;
    private readonly IRouteService _routeService;
    private readonly ILogger<FareCalculationService> _logger;

    public FareCalculationService(
        VaraKotoDbContext context,
        ILocationService locationService,
        IRouteService routeService,
        ILogger<FareCalculationService> logger)
    {
        _context = context;
        _locationService = locationService;
        _routeService = routeService;
        _logger = logger;
    }

    public async Task<FareCalculationResultDto> CalculateFareAsync(FareCalculationRequestDto request, CancellationToken cancellationToken = default)
    {
        var isManualDistance = request.ManualDistanceKm.HasValue && request.ManualDistanceKm.Value > 0;

        // 1. Resolve Origin Location
        var fromLoc = await ResolveLocationAsync(
            request.FromLocationId, 
            request.FromLatitude, 
            request.FromLongitude, 
            request.FromName, 
            "Origin", 
            isManualDistance,
            cancellationToken);

        // 2. Resolve Destination Location
        var toLoc = await ResolveLocationAsync(
            request.ToLocationId, 
            request.ToLatitude, 
            request.ToLongitude, 
            request.ToName, 
            "Destination", 
            isManualDistance,
            cancellationToken);

        // 3. Validate origin and destination are distinct
        if (fromLoc.Id > 0 && toLoc.Id > 0 && fromLoc.Id == toLoc.Id)
        {
            throw new InvalidOperationException("যাত্রার স্থান এবং গন্তব্য ভিন্ন হতে হবে (Origin and destination must be different locations).");
        }

        decimal distanceKm;
        decimal durationMinutes;
        string distanceSource;

        if (isManualDistance)
        {
            distanceKm = Math.Round(request.ManualDistanceKm!.Value, 2);
            durationMinutes = Math.Max(5m, Math.Round(distanceKm * 3.0m, 0));
            distanceSource = "Manual";
        }
        else
        {
            var coordDistSq = (fromLoc.Latitude - toLoc.Latitude) * (fromLoc.Latitude - toLoc.Latitude) +
                              (fromLoc.Longitude - toLoc.Longitude) * (fromLoc.Longitude - toLoc.Longitude);
            if (coordDistSq < 0.000001m) // ~30 meters
            {
                throw new InvalidOperationException("যাত্রার স্থান এবং গন্তব্য অতি কাছাকাছি (Origin and destination are too close to each other).");
            }

            // 4. Calculate Road Distance & Travel Duration
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
            distanceSource = routeResult.Source;
        }

        // 5. Calculate Fare Breakdowns for all active transport types
        var allFares = await CalculateAllFaresForDistanceAsync(
            distanceKm, 
            durationMinutes, 
            fromLoc.Id > 0 ? fromLoc.Id : null, 
            toLoc.Id > 0 ? toLoc.Id : null, 
            cancellationToken);

        // 6. Select Primary Fare
        var transportCode = request.TransportCode?.ToLowerInvariant().Trim() ?? "bus";
        var primaryFare = allFares.FirstOrDefault(f => f.TransportCode.Equals(transportCode, StringComparison.OrdinalIgnoreCase))
                          ?? allFares.FirstOrDefault(f => f.TransportCode == "bus")
                          ?? allFares.First();

        return new FareCalculationResultDto
        {
            FromLocation = fromLoc,
            ToLocation = toLoc,
            DistanceKm = distanceKm,
            EstimatedDurationMinutes = durationMinutes,
            DistanceSource = distanceSource,
            PrimaryFare = primaryFare,
            AllFares = allFares.ToList(),
            CalculatedAt = DateTime.UtcNow
        };
    }

    public async Task<IReadOnlyList<FareBreakdownDto>> CalculateAllFaresForDistanceAsync(
        decimal distanceKm, 
        decimal durationMinutes, 
        int? fromLocationId = null, 
        int? toLocationId = null, 
        CancellationToken cancellationToken = default)
    {
        var transportTypes = await _context.TransportTypes
            .Include(t => t.FareRule)
            .Where(t => t.IsActive)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync(cancellationToken);

        // Retrieve approved community submissions for benchmark/refinement
        List<FareSubmission> communitySubmissions = [];
        var minDistance = distanceKm - 0.8m;
        var maxDistance = distanceKm + 0.8m;

        try
        {
            communitySubmissions = await _context.FareSubmissions
                .Where(s => s.ModerationStatus == "Approved" &&
                            ((fromLocationId.HasValue && toLocationId.HasValue &&
                              ((s.FromLocationId == fromLocationId.Value && s.ToLocationId == toLocationId.Value) ||
                               (s.FromLocationId == toLocationId.Value && s.ToLocationId == fromLocationId.Value))) ||
                             (s.DistanceKm >= minDistance && s.DistanceKm <= maxDistance)))
                .ToListAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to retrieve community submissions for fare refinement.");
        }

        var results = new List<FareBreakdownDto>();

        foreach (var transport in transportTypes)
        {
            var breakdown = CalculateTransportFare(transport, distanceKm, durationMinutes);

            // Refine with community submissions if present
            var matchedSubmissions = communitySubmissions
                .Where(s => s.TransportTypeId == transport.Id)
                .ToList();

            if (matchedSubmissions.Count > 0)
            {
                var avg = matchedSubmissions.Average(s => s.ActualFarePaid);
                breakdown.CommunitySubmissionCount = matchedSubmissions.Count;
                breakdown.CommunityAverageFare = Math.Round(avg, MidpointRounding.AwayFromZero);

                if (matchedSubmissions.Count >= 2)
                {
                    breakdown.Reliability = "CommunityBacked";
                    breakdown.ReliabilityStars = 5;
                    var countBn = BengaliNumberHelper.ToBengaliDigits(matchedSubmissions.Count);
                    var avgBn = BengaliNumberHelper.ToBengaliDigits(breakdown.CommunityAverageFare.Value);
                    breakdown.SourceNote = $"{matchedSubmissions.Count} verified community fares (avg: ৳{breakdown.CommunityAverageFare.Value:0})";
                    breakdown.SourceNoteBn = $"{countBn} জন যাত্রীর দেওয়া তথ্যের সাথে যাচাইকৃত (গড় ভাড়া: ৳{avgBn})";
                }
            }

            results.Add(breakdown);
        }

        return results;
    }

    public async Task<IReadOnlyList<TransportType>> GetActiveTransportTypesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.TransportTypes
            .Include(t => t.FareRule)
            .Where(t => t.IsActive)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    private FareBreakdownDto CalculateTransportFare(TransportType transport, decimal distanceKm, decimal durationMinutes)
    {
        var rule = transport.FareRule ?? new FareRule
        {
            BaseFare = 20m,
            BaseDistanceKm = 5m,
            PerKmRate = 2.50m,
            MinimumFare = 20m
        };

        var code = transport.Code.ToLowerInvariant().Trim();

        return code switch
        {
            "bus" => CalculateBusFare(transport, rule, distanceKm),
            "rickshaw" => CalculateRickshawFare(transport, rule, distanceKm),
            "cng" => CalculateCngFare(transport, rule, distanceKm, durationMinutes),
            "bike" => CalculateBikeFare(transport, rule, distanceKm, durationMinutes),
            _ => CalculateGenericFare(transport, rule, distanceKm)
        };
    }

    private static FareBreakdownDto CalculateBusFare(TransportType transport, FareRule rule, decimal distanceKm)
    {
        // BRTA Official Gazette Formula:
        // First 5 km = Minimum Fare (৳20)
        // Additional distance = ৳2.50 / km
        decimal calculatedFare;
        if (distanceKm <= rule.BaseDistanceKm)
        {
            calculatedFare = rule.MinimumFare;
        }
        else
        {
            var extraKm = distanceKm - rule.BaseDistanceKm;
            calculatedFare = rule.MinimumFare + Math.Ceiling(extraKm * rule.PerKmRate);
        }

        // Round to nearest ৳5 slab (standard Dhaka bus conductor ticket pricing)
        var minFare = Math.Ceiling(calculatedFare / 5m) * 5m;
        if (minFare < rule.MinimumFare)
        {
            minFare = rule.MinimumFare;
        }

        // Direct / Seating service variation: ~15-25% higher
        var maxFare = Math.Max(minFare, Math.Ceiling((minFare * 1.25m) / 5m) * 5m);

        var displayEn = minFare == maxFare ? $"৳{minFare:0}" : $"৳{minFare:0} - ৳{maxFare:0}";
        var displayBn = minFare == maxFare 
            ? $"৳{BengaliNumberHelper.ToBengaliDigits(minFare)}" 
            : $"৳{BengaliNumberHelper.ToBengaliDigits(minFare)} - ৳{BengaliNumberHelper.ToBengaliDigits(maxFare)}";

        return new FareBreakdownDto
        {
            TransportCode = transport.Code,
            TransportNameEn = transport.NameEn,
            TransportNameBn = transport.NameBn,
            IconKey = transport.IconKey,
            DisplayOrder = transport.DisplayOrder,
            EstimatedMinFare = minFare,
            EstimatedMaxFare = maxFare,
            ExactFare = minFare == maxFare ? minFare : null,
            FareDisplayEn = displayEn,
            FareDisplayBn = displayBn,
            FareType = "OfficialRate",
            Reliability = "Official",
            ReliabilityStars = 5,
            SourceNote = "BRTA Official Gazette Rate (Dhaka Metro City Bus)",
            SourceNoteBn = "বিআরটিএ সরকারি গেজেট অনুমোদিত সিটি বাস ভাড়া (সর্বনিম্ন ২০ টাকা)",
            IsAvailableForDistance = true
        };
    }

    private static FareBreakdownDto CalculateRickshawFare(TransportType transport, FareRule rule, decimal distanceKm)
    {
        // Rickshaw: Unmetered, negotiated
        // Trips > 6.5 km are rarely taken continuously on Dhaka roads due to VIP road restrictions & fatigue
        var isAvailable = distanceKm <= 7.0m;
        string? noticeEn = null;
        string? noticeBn = null;

        if (!isAvailable)
        {
            noticeEn = "Direct rickshaws are usually not available for trips over 7 km. Multiple transfers may be required.";
            noticeBn = "৭ কিমির বেশি দূরত্বের ক্ষেত্রে সরাসরি রিকশা পাওয়া কঠিন হতে পারে (পরিবহন পরিবর্তন প্রয়োজন হতে পারে)।";
        }

        decimal minFare;
        decimal maxFare;

        if (distanceKm <= 1.0m)
        {
            minFare = 25m;
            maxFare = 35m;
        }
        else
        {
            var extraKm = distanceKm - 1.0m;
            minFare = 25m + (extraKm * 16.0m);
            maxFare = 35m + (extraKm * 22.0m);
        }

        // Round to nearest ৳5
        minFare = Math.Round(minFare / 5m, MidpointRounding.AwayFromZero) * 5m;
        maxFare = Math.Round(maxFare / 5m, MidpointRounding.AwayFromZero) * 5m;
        if (maxFare <= minFare)
        {
            maxFare = minFare + 10m;
        }

        return new FareBreakdownDto
        {
            TransportCode = transport.Code,
            TransportNameEn = transport.NameEn,
            TransportNameBn = transport.NameBn,
            IconKey = transport.IconKey,
            DisplayOrder = transport.DisplayOrder,
            EstimatedMinFare = minFare,
            EstimatedMaxFare = maxFare,
            ExactFare = null,
            FareDisplayEn = $"৳{minFare:0} - ৳{maxFare:0}",
            FareDisplayBn = $"৳{BengaliNumberHelper.ToBengaliDigits(minFare)} - ৳{BengaliNumberHelper.ToBengaliDigits(maxFare)}",
            FareType = "NegotiatedMarket",
            Reliability = "Estimated",
            ReliabilityStars = 3,
            SourceNote = "Local negotiated rate (varies with traffic, weather & time)",
            SourceNoteBn = "স্থানীয় চুক্তিভিত্তিক স্বাভাবিক ভাড়া (আবহাওয়া ও ভিড়ভেদে পরিবর্তিত হতে পারে)",
            IsAvailableForDistance = isAvailable,
            DistanceNotice = noticeEn,
            DistanceNoticeBn = noticeBn
        };
    }

    private static FareBreakdownDto CalculateCngFare(TransportType transport, FareRule rule, decimal distanceKm, decimal durationMinutes)
    {
        // 1. Official BRTA Meter Rate:
        // Base: ৳40 (first 2 km)
        // Per km: ৳12
        // Waiting charge: ৳2 / min
        var freeSpeedMinutes = (distanceKm / 35m) * 60m;
        var waitingMinutes = Math.Max(0m, durationMinutes - freeSpeedMinutes);
        var meterFare = rule.BaseFare;
        if (distanceKm > rule.BaseDistanceKm)
        {
            meterFare += (distanceKm - rule.BaseDistanceKm) * rule.PerKmRate;
        }
        meterFare += waitingMinutes * 2.0m;
        meterFare = Math.Ceiling(meterFare / 5m) * 5m; // Round to ৳5

        // 2. Ground Reality Negotiated Market Range:
        // In Dhaka, CNG drivers almost universally refuse meters and demand fixed contracts.
        // Base contract for any short hop: ৳120 - ৳150
        decimal minContract;
        decimal maxContract;

        if (distanceKm <= 3.0m)
        {
            minContract = 120m;
            maxContract = 160m;
        }
        else
        {
            minContract = 100m + (distanceKm * 20m);
            maxContract = 140m + (distanceKm * 26m);
        }

        // Round to nearest ৳10
        minContract = Math.Ceiling(minContract / 10m) * 10m;
        maxContract = Math.Ceiling(maxContract / 10m) * 10m;
        if (maxContract <= minContract)
        {
            maxContract = minContract + 20m;
        }

        var minBn = BengaliNumberHelper.ToBengaliDigits(minContract);
        var maxBn = BengaliNumberHelper.ToBengaliDigits(maxContract);
        var meterBn = BengaliNumberHelper.ToBengaliDigits(meterFare);

        return new FareBreakdownDto
        {
            TransportCode = transport.Code,
            TransportNameEn = transport.NameEn,
            TransportNameBn = transport.NameBn,
            IconKey = transport.IconKey,
            DisplayOrder = transport.DisplayOrder,
            EstimatedMinFare = minContract,
            EstimatedMaxFare = maxContract,
            ExactFare = null,
            OfficialMeterFare = meterFare,
            FareDisplayEn = $"৳{minContract:0} - ৳{maxContract:0}",
            FareDisplayBn = $"৳{minBn} - ৳{maxBn}",
            FareType = "NegotiatedMarket",
            Reliability = "Estimated",
            ReliabilityStars = 3,
            SourceNote = $"Street Contract: ৳{minContract:0}-৳{maxContract:0} | Official Meter: ~৳{meterFare:0}",
            SourceNoteBn = $"বাস্তবে চুক্তিভিত্তিক ৳{minBn}-৳{maxBn} (সরকারি মিটার রেট: ~৳{meterBn})",
            IsAvailableForDistance = true
        };
    }

    private static FareBreakdownDto CalculateBikeFare(TransportType transport, FareRule rule, decimal distanceKm, decimal durationMinutes)
    {
        // Ride-Sharing Baseline (Pathao / Uber Moto):
        // Base: ৳25 (first 1 km)
        // Per km: ৳12 - ৳14.50
        // Per min: ৳0.40 - ৳0.75
        // Minimum fare: ৳35
        decimal minFare;
        decimal maxFare;

        if (distanceKm <= 1.0m)
        {
            minFare = Math.Max(35m, 25m + (durationMinutes * 0.40m));
            maxFare = Math.Max(45m, 35m + (durationMinutes * 0.70m));
        }
        else
        {
            var extraKm = distanceKm - 1.0m;
            minFare = Math.Max(35m, 25m + (extraKm * 11.5m) + (durationMinutes * 0.40m));
            maxFare = Math.Max(45m, 35m + (extraKm * 14.5m) + (durationMinutes * 0.75m));
        }

        // Round to nearest ৳5
        minFare = Math.Round(minFare / 5m, MidpointRounding.AwayFromZero) * 5m;
        maxFare = Math.Round(maxFare / 5m, MidpointRounding.AwayFromZero) * 5m;
        if (maxFare <= minFare)
        {
            maxFare = minFare + 10m;
        }

        return new FareBreakdownDto
        {
            TransportCode = transport.Code,
            TransportNameEn = transport.NameEn,
            TransportNameBn = transport.NameBn,
            IconKey = transport.IconKey,
            DisplayOrder = transport.DisplayOrder,
            EstimatedMinFare = minFare,
            EstimatedMaxFare = maxFare,
            ExactFare = null,
            FareDisplayEn = $"৳{minFare:0} - ৳{maxFare:0}",
            FareDisplayBn = $"৳{BengaliNumberHelper.ToBengaliDigits(minFare)} - ৳{BengaliNumberHelper.ToBengaliDigits(maxFare)}",
            FareType = "RideShareEstimate",
            Reliability = "Estimated",
            ReliabilityStars = 4,
            SourceNote = "Ride-sharing benchmark (Pathao / Uber Moto standard rate)",
            SourceNoteBn = "পাঠাও / উবার মোটো রাইডশেয়ারিং আনুমানিক ভাড়া",
            IsAvailableForDistance = true
        };
    }

    private static FareBreakdownDto CalculateGenericFare(TransportType transport, FareRule rule, decimal distanceKm)
    {
        var minFare = rule.MinimumFare + (distanceKm * rule.PerKmRate);
        var maxFare = minFare * 1.25m;

        minFare = Math.Round(minFare / 5m, MidpointRounding.AwayFromZero) * 5m;
        maxFare = Math.Round(maxFare / 5m, MidpointRounding.AwayFromZero) * 5m;

        return new FareBreakdownDto
        {
            TransportCode = transport.Code,
            TransportNameEn = transport.NameEn,
            TransportNameBn = transport.NameBn,
            IconKey = transport.IconKey,
            DisplayOrder = transport.DisplayOrder,
            EstimatedMinFare = minFare,
            EstimatedMaxFare = maxFare,
            FareDisplayEn = $"৳{minFare:0} - ৳{maxFare:0}",
            FareDisplayBn = $"৳{BengaliNumberHelper.ToBengaliDigits(minFare)} - ৳{BengaliNumberHelper.ToBengaliDigits(maxFare)}",
            FareType = "Estimated",
            Reliability = "Estimated",
            ReliabilityStars = 3,
            SourceNote = rule.OfficialSourceNote ?? "Standard Estimate",
            SourceNoteBn = rule.OfficialSourceNote ?? "স্ট্যান্ডার্ড আনুমানিক ভাড়া",
            IsAvailableForDistance = true
        };
    }

    private async Task<LocationDto> ResolveLocationAsync(
        int? locationId, 
        decimal? latitude, 
        decimal? longitude, 
        string? name, 
        string label, 
        bool allowCustomFallback,
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
            var cleanName = name.Trim();
            var match = await _context.Locations
                .FirstOrDefaultAsync(l => l.NameBn.Contains(cleanName) || l.NameEn.Contains(cleanName) || cleanName.Contains(l.NameBn) || cleanName.Contains(l.NameEn), cancellationToken);

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

            // Fallback: search geocoding via _locationService
            try
            {
                var searchResults = await _locationService.SearchLocationsAsync(cleanName, 1, cancellationToken);
                var topMatch = searchResults.FirstOrDefault();
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
            var hubKeywords = await _context.Locations.Where(l => l.IsHub).ToListAsync(cancellationToken);
            var matchedHub = hubKeywords.FirstOrDefault(h => 
                cleanName.Contains(h.NameBn, StringComparison.OrdinalIgnoreCase) || 
                cleanName.Contains(h.NameEn, StringComparison.OrdinalIgnoreCase) ||
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

            if (allowCustomFallback)
            {
                return new LocationDto
                {
                    Id = 0,
                    NameEn = cleanName,
                    NameBn = cleanName,
                    DisplayName = cleanName,
                    Latitude = 23.8103m,
                    Longitude = 90.4125m,
                    District = "বাংলাদেশ",
                    Source = "CustomManual"
                };
            }
        }

        var labelBn = label == "Origin" ? "যাত্রার প্রারম্ভিক স্থান" : "গন্তব্য স্থান";
        throw new ArgumentException($"'{name ?? labelBn}' ম্যাপে চিহ্নিত করা সম্ভব হয়নি। অনুগ্রহ করে ড্রপডাউন থেকে বাছাই করুন, ম্যাপে পিন করুন অথবা আনুমানিক দূরত্ব লিখুন। ({label} could not be determined. Please select from suggestions, pin on map, or enter manual distance).");
    }
}
