using System.Globalization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Entities;
using VaraKoto.Core.Interfaces;
using VaraKoto.Infrastructure.Data;

namespace VaraKoto.Infrastructure.Services;

public class OsrmRouteService : IRouteService
{
    private readonly VaraKotoDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly ILogger<OsrmRouteService> _logger;

    public OsrmRouteService(
        VaraKotoDbContext context,
        HttpClient httpClient,
        ILogger<OsrmRouteService> logger)
    {
        _context = context;
        _httpClient = httpClient;
        _logger = logger;
        _httpClient.Timeout = TimeSpan.FromSeconds(6);
    }

    public async Task<DistanceResultDto> CalculateDistanceAsync(
        decimal fromLat,
        decimal fromLng,
        decimal toLat,
        decimal toLng,
        int? fromLocationId = null,
        int? toLocationId = null,
        CancellationToken cancellationToken = default)
    {
        // 1. Check RouteCache table first if location IDs are provided
        if (fromLocationId.HasValue && toLocationId.HasValue)
        {
            var cached = await _context.RouteCaches
                .AsNoTracking()
                .FirstOrDefaultAsync(r => (r.FromLocationId == fromLocationId.Value && r.ToLocationId == toLocationId.Value) ||
                                          (r.FromLocationId == toLocationId.Value && r.ToLocationId == fromLocationId.Value),
                                     cancellationToken);

            if (cached != null)
            {
                return new DistanceResultDto
                {
                    DistanceKm = cached.DistanceKm,
                    DurationMinutes = cached.EstimatedDurationMinutes,
                    Source = "Cache",
                    IsEstimatedRoute = false
                };
            }
        }

        // 2. Query OSRM routing engine
        try
        {
            var fromLngStr = fromLng.ToString(CultureInfo.InvariantCulture);
            var fromLatStr = fromLat.ToString(CultureInfo.InvariantCulture);
            var toLngStr = toLng.ToString(CultureInfo.InvariantCulture);
            var toLatStr = toLat.ToString(CultureInfo.InvariantCulture);

            var url = $"https://router.project-osrm.org/route/v1/driving/{fromLngStr},{fromLatStr};{toLngStr},{toLatStr}?overview=false";
            var response = await _httpClient.GetAsync(url, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                using var jsonDoc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
                var root = jsonDoc.RootElement;

                if (root.TryGetProperty("code", out var codeProp) && codeProp.GetString() == "Ok" &&
                    root.TryGetProperty("routes", out var routes) && routes.GetArrayLength() > 0)
                {
                    var primaryRoute = routes[0];
                    var distanceMeters = primaryRoute.GetProperty("distance").GetDecimal();
                    var durationSeconds = primaryRoute.GetProperty("duration").GetDecimal();

                    var distanceKm = Math.Round(distanceMeters / 1000m, 2);
                    var durationMins = Math.Round(durationSeconds / 60m, 1);

                    // Ensure minimum realistic distance
                    if (distanceKm < 0.1m) distanceKm = 0.5m;
                    if (durationMins < 1.0m) durationMins = 3.0m;

                    // Cache route in database if both IDs are known
                    if (fromLocationId.HasValue && toLocationId.HasValue)
                    {
                        await CacheRouteAsync(fromLocationId.Value, toLocationId.Value, distanceKm, durationMins, cancellationToken);
                    }

                    return new DistanceResultDto
                    {
                        DistanceKm = distanceKm,
                        DurationMinutes = durationMins,
                        Source = "OSRM",
                        IsEstimatedRoute = false
                    };
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "OSRM routing call failed between ({FromLat}, {FromLng}) and ({ToLat}, {ToLng}). Using Haversine fallback.", fromLat, fromLng, toLat, toLng);
        }

        // 3. Fallback: Mathematical Haversine Distance with Bangladesh road curvature factor (1.28x)
        var fallbackDistance = CalculateHaversineDistance(fromLat, fromLng, toLat, toLng);
        var fallbackDuration = Math.Round((fallbackDistance / 20.0m) * 60m, 1); // average 20 km/h in metro

        return new DistanceResultDto
        {
            DistanceKm = fallbackDistance,
            DurationMinutes = Math.Max(fallbackDuration, 5.0m),
            Source = "HaversineFallback",
            IsEstimatedRoute = true
        };
    }

    public static decimal CalculateHaversineDistance(decimal lat1, decimal lon1, decimal lat2, decimal lon2)
    {
        const double R = 6371.0; // Earth's radius in km
        const double RoadCurvatureFactor = 1.28; // Empirical Bangladesh road network multiplier

        var dLat = ToRadians((double)(lat2 - lat1));
        var dLon = ToRadians((double)(lon2 - lon1));

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians((double)lat1)) * Math.Cos(ToRadians((double)lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        var straightLineKm = R * c;

        var roadDistanceKm = straightLineKm * RoadCurvatureFactor;
        return (decimal)Math.Round(Math.Max(roadDistanceKm, 0.5), 2);
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180.0;

    private async Task CacheRouteAsync(int fromId, int toId, decimal distanceKm, decimal durationMins, CancellationToken cancellationToken)
    {
        try
        {
            var exists = await _context.RouteCaches.AnyAsync(r => r.FromLocationId == fromId && r.ToLocationId == toId, cancellationToken);
            if (!exists)
            {
                _context.RouteCaches.Add(new RouteCache
                {
                    FromLocationId = fromId,
                    ToLocationId = toId,
                    DistanceKm = distanceKm,
                    EstimatedDurationMinutes = durationMins,
                    CachedAt = DateTime.UtcNow
                });
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to cache route between {FromId} and {ToId}", fromId, toId);
        }
    }
}
