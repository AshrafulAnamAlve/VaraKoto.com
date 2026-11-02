namespace VaraKoto.Core.DTOs;

public class FareCalculationRequestDto
{
    public int? FromLocationId { get; set; }
    public int? ToLocationId { get; set; }

    public decimal? FromLatitude { get; set; }
    public decimal? FromLongitude { get; set; }
    public string? FromName { get; set; }

    public decimal? ToLatitude { get; set; }
    public decimal? ToLongitude { get; set; }
    public string? ToName { get; set; }

    /// <summary>
    /// Specific transport code to highlight: "bus", "rickshaw", "cng", "bike", or "all"
    /// </summary>
    public string? TransportCode { get; set; } = "bus";

    /// <summary>
    /// Whether to return calculations for all active transport types
    /// </summary>
    public bool IncludeAllTransports { get; set; } = true;
}
