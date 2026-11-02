namespace VaraKoto.Core.DTOs;

public class RecentContributionDto
{
    public int Id { get; set; }
    public string FromLocationName { get; set; } = string.Empty;
    public string ToLocationName { get; set; } = string.Empty;
    public string TransportCode { get; set; } = string.Empty;
    public string TransportNameBn { get; set; } = string.Empty;
    public decimal ActualFarePaid { get; set; }
    public string FareDisplayBn { get; set; } = string.Empty;
    public decimal DistanceKm { get; set; }
    public string TimeAgoBn { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
}
