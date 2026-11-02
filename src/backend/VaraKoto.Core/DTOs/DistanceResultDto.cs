namespace VaraKoto.Core.DTOs;

public class DistanceResultDto
{
    public decimal DistanceKm { get; set; }
    public decimal DurationMinutes { get; set; }
    public string Source { get; set; } = "OSRM"; // Cache, OSRM, HaversineFallback
    public bool IsEstimatedRoute { get; set; }
}
