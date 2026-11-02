namespace VaraKoto.Core.DTOs;

public class FareContributionResponseDto
{
    public int SubmissionId { get; set; }
    public string Status { get; set; } = "Approved"; // Approved, Pending, Flagged
    public string MessageEn { get; set; } = string.Empty;
    public string MessageBn { get; set; } = string.Empty;
    public decimal? CalculatedStandardFare { get; set; }
    public decimal SubmittedFare { get; set; }
    public string FromLocationName { get; set; } = string.Empty;
    public string ToLocationName { get; set; } = string.Empty;
    public string TransportName { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
