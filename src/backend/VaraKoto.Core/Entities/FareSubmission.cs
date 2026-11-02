namespace VaraKoto.Core.Entities;

public class FareSubmission
{
    public int Id { get; set; }

    public int TransportTypeId { get; set; }
    public TransportType TransportType { get; set; } = null!;

    public int FromLocationId { get; set; }
    public Location FromLocation { get; set; } = null!;

    public int ToLocationId { get; set; }
    public Location ToLocation { get; set; } = null!;

    public decimal ActualFarePaid { get; set; }
    public decimal DistanceKm { get; set; }
    public DateTime? TravelDate { get; set; }
    public string? DeviceHash { get; set; }
    public string ModerationStatus { get; set; } = "Approved"; // Approved, Pending, Flagged
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
