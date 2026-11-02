namespace VaraKoto.Core.DTOs;

public class FareCalculationResultDto
{
    public LocationDto FromLocation { get; set; } = new();
    public LocationDto ToLocation { get; set; } = new();

    public decimal DistanceKm { get; set; }
    public decimal EstimatedDurationMinutes { get; set; }
    public string DistanceSource { get; set; } = "OSRM"; // Cache, OSRM, HaversineFallback

    public FareBreakdownDto PrimaryFare { get; set; } = new();
    public List<FareBreakdownDto> AllFares { get; set; } = [];

    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;
}
