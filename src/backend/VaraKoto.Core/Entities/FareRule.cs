namespace VaraKoto.Core.Entities;

public class FareRule
{
    public int Id { get; set; }
    public int TransportTypeId { get; set; }
    public TransportType TransportType { get; set; } = null!;

    public decimal BaseFare { get; set; }
    public decimal BaseDistanceKm { get; set; }
    public decimal PerKmRate { get; set; }
    public decimal MinimumFare { get; set; }
    public decimal EstimatedSpeedKmph { get; set; } = 15.0m;
    public decimal HighDemandMultiplier { get; set; } = 1.0m;
    public string? OfficialSourceNote { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
