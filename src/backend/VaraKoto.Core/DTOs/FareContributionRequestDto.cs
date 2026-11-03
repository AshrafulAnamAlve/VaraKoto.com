namespace VaraKoto.Core.DTOs;

public class FareContributionRequestDto
{
    public int? FromLocationId { get; set; }
    public int? ToLocationId { get; set; }

    public decimal? FromLatitude { get; set; }
    public decimal? FromLongitude { get; set; }
    public string? FromName { get; set; }

    public decimal? ToLatitude { get; set; }
    public decimal? ToLongitude { get; set; }
    public string? ToName { get; set; }

    public string TransportCode { get; set; } = "bus"; // bus, rickshaw, cng, bike
    public decimal ActualFarePaid { get; set; }
    public decimal? ManualDistanceKm { get; set; }
    public DateTime? TravelDate { get; set; }
}
