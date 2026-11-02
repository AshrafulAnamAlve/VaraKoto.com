namespace VaraKoto.Core.DTOs;

public class AdminSubmissionDto
{
    public int Id { get; set; }
    public string FromLocationName { get; set; } = string.Empty;
    public string ToLocationName { get; set; } = string.Empty;
    public string TransportCode { get; set; } = string.Empty;
    public string TransportNameBn { get; set; } = string.Empty;
    public decimal UserSubmittedFare { get; set; }
    public decimal? DatabaseStandardFare { get; set; }
    public decimal DifferenceAmount { get; set; }
    public decimal DifferencePercentage { get; set; }
    public decimal DistanceKm { get; set; }
    public string ModerationStatus { get; set; } = string.Empty;
    public string? DeviceHash { get; set; }
    public string? AdminNote { get; set; }
    public string TimeAgoBn { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
}
