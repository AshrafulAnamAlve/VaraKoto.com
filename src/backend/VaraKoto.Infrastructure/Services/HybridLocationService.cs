using System.Globalization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Entities;
using VaraKoto.Core.Interfaces;
using VaraKoto.Infrastructure.Data;

namespace VaraKoto.Infrastructure.Services;

public class HybridLocationService : ILocationService
{
    private readonly VaraKotoDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<HybridLocationService> _logger;

    public HybridLocationService(
        VaraKotoDbContext context,
        HttpClient httpClient,
        IMemoryCache memoryCache,
        ILogger<HybridLocationService> logger)
    {
        _context = context;
        _httpClient = httpClient;
        _memoryCache = memoryCache;
        _logger = logger;

        // Configure user agent for external geocoding calls
        if (!_httpClient.DefaultRequestHeaders.Contains("User-Agent"))
        {
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "VaraKoto-BD-TransportFareFinder/1.0 (info@varakoto.com)");
        }
        _httpClient.Timeout = TimeSpan.FromSeconds(5);
    }

    public async Task<IReadOnlyList<LocationDto>> SearchLocationsAsync(string query, int limit = 8, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Array.Empty<LocationDto>();
        }

        var normalizedQuery = query.Trim();
        var cacheKey = $"loc_search_{normalizedQuery.ToLowerInvariant()}_{limit}";

        if (_memoryCache.TryGetValue(cacheKey, out IReadOnlyList<LocationDto>? cachedResults) && cachedResults != null)
        {
            return cachedResults;
        }

        var results = new List<LocationDto>();

        // 1. Search local pre-seeded database hubs & locations
        var localMatches = await _context.Locations
            .Where(l => EF.Functions.Like(l.NameEn, $"%{normalizedQuery}%") ||
                        EF.Functions.Like(l.NameBn, $"%{normalizedQuery}%") ||
                        (l.Thana != null && EF.Functions.Like(l.Thana, $"%{normalizedQuery}%")) ||
                        (l.District != null && EF.Functions.Like(l.District, $"%{normalizedQuery}%")))
            .OrderByDescending(l => l.IsHub)
            .ThenBy(l => l.NameEn.StartsWith(normalizedQuery) || l.NameBn.StartsWith(normalizedQuery) ? 0 : 1)
            .Take(limit)
            .ToListAsync(cancellationToken);

        foreach (var loc in localMatches)
        {
            results.Add(new LocationDto
            {
                Id = loc.Id,
                NameEn = loc.NameEn,
                NameBn = loc.NameBn,
                DisplayName = FormatDisplayName(loc.NameBn, loc.NameEn, loc.District),
                Latitude = loc.Latitude,
                Longitude = loc.Longitude,
                District = loc.District,
                Thana = loc.Thana,
                IsHub = loc.IsHub,
                Source = "Database"
            });
        }

        // 2. Fallback to Photon API if query is >= 2 chars and we haven't reached limit
        if (results.Count < limit && normalizedQuery.Length >= 2)
        {
            var remaining = limit - results.Count;
            var externalResults = await FetchFromPhotonAsync(normalizedQuery, remaining, cancellationToken);

            foreach (var ext in externalResults)
            {
                // Avoid duplicates by coordinate proximity (~100m)
                var exists = results.Any(r => Math.Abs(r.Latitude - ext.Latitude) < 0.001m &&
                                              Math.Abs(r.Longitude - ext.Longitude) < 0.001m);
                if (!exists)
                {
                    results.Add(ext);
                }
            }
        }

        // Cache for 10 minutes
        _memoryCache.Set(cacheKey, (IReadOnlyList<LocationDto>)results, TimeSpan.FromMinutes(10));

        return results;
    }

    public async Task<LocationDto?> ReverseGeocodeAsync(decimal latitude, decimal longitude, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"rev_geo_{latitude:F4}_{longitude:F4}";
        if (_memoryCache.TryGetValue(cacheKey, out LocationDto? cached) && cached != null)
        {
            return cached;
        }

        // 1. Check if user is within ~300 meters of a known transit hub
        var nearestHub = await _context.Locations
            .Where(l => Math.Abs(l.Latitude - latitude) < 0.004m && Math.Abs(l.Longitude - longitude) < 0.004m)
            .OrderBy(l => (l.Latitude - latitude) * (l.Latitude - latitude) + (l.Longitude - longitude) * (l.Longitude - longitude))
            .FirstOrDefaultAsync(cancellationToken);

        if (nearestHub != null)
        {
            var result = new LocationDto
            {
                Id = nearestHub.Id,
                NameEn = nearestHub.NameEn,
                NameBn = nearestHub.NameBn,
                DisplayName = FormatDisplayName(nearestHub.NameBn, nearestHub.NameEn, nearestHub.District),
                Latitude = nearestHub.Latitude,
                Longitude = nearestHub.Longitude,
                District = nearestHub.District,
                Thana = nearestHub.Thana,
                IsHub = nearestHub.IsHub,
                Source = "Database"
            };

            _memoryCache.Set(cacheKey, result, TimeSpan.FromMinutes(30));
            return result;
        }

        // 2. Query Nominatim Reverse Geocoding
        try
        {
            var url = $"https://nominatim.openstreetmap.org/reverse?lat={latitude.ToString(CultureInfo.InvariantCulture)}&lon={longitude.ToString(CultureInfo.InvariantCulture)}&format=json&accept-language=bn,en";
            var response = await _httpClient.GetAsync(url, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                using var jsonDoc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
                var root = jsonDoc.RootElement;

                var displayName = root.TryGetProperty("display_name", out var dnProp) ? dnProp.GetString() ?? string.Empty : string.Empty;
                var address = root.TryGetProperty("address", out var addrProp) ? addrProp : default;

                var road = address.ValueKind == JsonValueKind.Object && address.TryGetProperty("road", out var roadProp) ? roadProp.GetString() : null;
                var suburb = address.ValueKind == JsonValueKind.Object && address.TryGetProperty("suburb", out var subProp) ? subProp.GetString() : null;
                var city = address.ValueKind == JsonValueKind.Object && address.TryGetProperty("city", out var cityProp) ? cityProp.GetString() : null;
                var state = address.ValueKind == JsonValueKind.Object && address.TryGetProperty("state", out var stateProp) ? stateProp.GetString() : null;

                var cleanName = suburb ?? road ?? city ?? displayName.Split(',').FirstOrDefault()?.Trim() ?? "Detected Location";
                var cleanDistrict = city ?? state ?? "Bangladesh";

                var result = new LocationDto
                {
                    NameEn = cleanName,
                    NameBn = cleanName,
                    DisplayName = $"{cleanName}, {cleanDistrict}",
                    Latitude = latitude,
                    Longitude = longitude,
                    District = cleanDistrict,
                    IsHub = false,
                    Source = "Geocoding"
                };

                _memoryCache.Set(cacheKey, result, TimeSpan.FromMinutes(30));
                return result;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Reverse geocoding failed for ({Lat}, {Lng})", latitude, longitude);
        }

        // Fallback simple coordinate label
        return new LocationDto
        {
            NameEn = $"Location ({latitude:F3}, {longitude:F3})",
            NameBn = $"অবস্থান ({latitude:F3}, {longitude:F3})",
            DisplayName = $"Current Location ({latitude:F3}, {longitude:F3})",
            Latitude = latitude,
            Longitude = longitude,
            Source = "Coordinate"
        };
    }

    public async Task<LocationDto> GetOrCreateLocationAsync(decimal latitude, decimal longitude, string nameEn, string nameBn, CancellationToken cancellationToken = default)
    {
        // Check for existing location within ~50m
        var existing = await _context.Locations
            .FirstOrDefaultAsync(l => Math.Abs(l.Latitude - latitude) < 0.0005m &&
                                      Math.Abs(l.Longitude - longitude) < 0.0005m,
                                 cancellationToken);

        if (existing != null)
        {
            return new LocationDto
            {
                Id = existing.Id,
                NameEn = existing.NameEn,
                NameBn = existing.NameBn,
                DisplayName = FormatDisplayName(existing.NameBn, existing.NameEn, existing.District),
                Latitude = existing.Latitude,
                Longitude = existing.Longitude,
                District = existing.District,
                Thana = existing.Thana,
                IsHub = existing.IsHub,
                Source = "Database"
            };
        }

        var newLoc = new Location
        {
            NameEn = string.IsNullOrWhiteSpace(nameEn) ? nameBn : nameEn,
            NameBn = string.IsNullOrWhiteSpace(nameBn) ? nameEn : nameBn,
            Latitude = latitude,
            Longitude = longitude,
            IsHub = false
        };

        _context.Locations.Add(newLoc);
        await _context.SaveChangesAsync(cancellationToken);

        return new LocationDto
        {
            Id = newLoc.Id,
            NameEn = newLoc.NameEn,
            NameBn = newLoc.NameBn,
            DisplayName = FormatDisplayName(newLoc.NameBn, newLoc.NameEn, newLoc.District),
            Latitude = newLoc.Latitude,
            Longitude = newLoc.Longitude,
            IsHub = false,
            Source = "Database"
        };
    }

    private async Task<List<LocationDto>> FetchFromPhotonAsync(string query, int limit, CancellationToken cancellationToken)
    {
        var list = new List<LocationDto>();
        try
        {
            // Photon API bounded to Bangladesh bbox (88.0, 20.5 to 92.7, 26.7)
            var url = $"https://photon.komoot.io/api/?q={Uri.EscapeDataString(query)}&bbox=88.0,20.5,92.7,26.7&limit={limit}";
            var response = await _httpClient.GetAsync(url, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                using var jsonDoc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
                if (jsonDoc.RootElement.TryGetProperty("features", out var features) && features.ValueKind == JsonValueKind.Array)
                {
                    foreach (var feature in features.EnumerateArray())
                    {
                        if (feature.TryGetProperty("geometry", out var geom) &&
                            geom.TryGetProperty("coordinates", out var coords) &&
                            coords.ValueKind == JsonValueKind.Array &&
                            coords.GetArrayLength() >= 2 &&
                            feature.TryGetProperty("properties", out var props))
                        {
                            var lng = coords[0].GetDecimal();
                            var lat = coords[1].GetDecimal();

                            var name = props.TryGetProperty("name", out var n) ? n.GetString() ?? query : query;
                            var city = props.TryGetProperty("city", out var c) ? c.GetString() : null;
                            var district = props.TryGetProperty("district", out var d) ? d.GetString() : null;
                            var state = props.TryGetProperty("state", out var s) ? s.GetString() : null;

                            var locationArea = city ?? district ?? state ?? "Bangladesh";

                            list.Add(new LocationDto
                            {
                                NameEn = name,
                                NameBn = name,
                                DisplayName = $"{name}, {locationArea}",
                                Latitude = lat,
                                Longitude = lng,
                                District = locationArea,
                                IsHub = false,
                                Source = "Geocoding"
                            });
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Photon geocoding fallback failed for query '{Query}'", query);
        }

        return list;
    }

    private static string FormatDisplayName(string nameBn, string nameEn, string? district)
    {
        var districtPart = !string.IsNullOrWhiteSpace(district) ? $", {district}" : "";
        if (!string.IsNullOrWhiteSpace(nameBn) && !string.IsNullOrWhiteSpace(nameEn) && nameBn != nameEn)
        {
            return $"{nameBn} ({nameEn}){districtPart}";
        }
        return $"{nameBn ?? nameEn}{districtPart}";
    }
}
