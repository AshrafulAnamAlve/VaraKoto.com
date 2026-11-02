using VaraKoto.Core.DTOs;
using VaraKoto.Core.Entities;

namespace VaraKoto.Core.Interfaces;

public interface IFareCalculationService
{
    /// <summary>
    /// Calculates estimated fares for a journey from origin to destination.
    /// Handles geocoding/location resolution, distance calculation, fare rule evaluation, and community benchmark refinement.
    /// </summary>
    Task<FareCalculationResultDto> CalculateFareAsync(FareCalculationRequestDto request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculates fare breakdowns across all active transport types for a known distance and duration.
    /// </summary>
    Task<IReadOnlyList<FareBreakdownDto>> CalculateAllFaresForDistanceAsync(
        decimal distanceKm, 
        decimal durationMinutes, 
        int? fromLocationId = null, 
        int? toLocationId = null, 
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves all active transport types with their fare rules.
    /// </summary>
    Task<IReadOnlyList<TransportType>> GetActiveTransportTypesAsync(CancellationToken cancellationToken = default);
}
