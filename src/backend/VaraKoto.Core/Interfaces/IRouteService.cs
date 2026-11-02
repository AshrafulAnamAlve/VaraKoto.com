using VaraKoto.Core.DTOs;

namespace VaraKoto.Core.Interfaces;

public interface IRouteService
{
    Task<DistanceResultDto> CalculateDistanceAsync(
        decimal fromLat, 
        decimal fromLng, 
        decimal toLat, 
        decimal toLng, 
        int? fromLocationId = null, 
        int? toLocationId = null, 
        CancellationToken cancellationToken = default);
}
