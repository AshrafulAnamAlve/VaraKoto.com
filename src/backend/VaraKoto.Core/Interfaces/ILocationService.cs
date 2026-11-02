using VaraKoto.Core.DTOs;

namespace VaraKoto.Core.Interfaces;

public interface ILocationService
{
    Task<IReadOnlyList<LocationDto>> SearchLocationsAsync(string query, int limit = 8, CancellationToken cancellationToken = default);
    Task<LocationDto?> ReverseGeocodeAsync(decimal latitude, decimal longitude, CancellationToken cancellationToken = default);
    Task<LocationDto> GetOrCreateLocationAsync(decimal latitude, decimal longitude, string nameEn, string nameBn, CancellationToken cancellationToken = default);
}
