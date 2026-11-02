namespace VaraKoto.Core.DTOs;

public class FareBreakdownDto
{
    public string TransportCode { get; set; } = string.Empty; // bus, rickshaw, cng, bike
    public string TransportNameEn { get; set; } = string.Empty;
    public string TransportNameBn { get; set; } = string.Empty;
    public string IconKey { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }

    public decimal EstimatedMinFare { get; set; }
    public decimal EstimatedMaxFare { get; set; }
    public decimal? ExactFare { get; set; }

    /// <summary>
    /// Dual display for CNG: official meter calculation vs ground negotiated market rate
    /// </summary>
    public decimal? OfficialMeterFare { get; set; }

    public string FareDisplayEn { get; set; } = string.Empty;
    public string FareDisplayBn { get; set; } = string.Empty;

    public string FareType { get; set; } = "OfficialRate"; // OfficialRate, NegotiatedMarket, RideShareEstimate, CommunityRefined
    public string SourceNote { get; set; } = string.Empty;
    public string SourceNoteBn { get; set; } = string.Empty;

    public string Reliability { get; set; } = "Estimated"; // Official, Estimated, CommunityBacked
    public int ReliabilityStars { get; set; } = 3; // 1 to 5 scale

    public int CommunitySubmissionCount { get; set; }
    public decimal? CommunityAverageFare { get; set; }

    public bool IsAvailableForDistance { get; set; } = true;
    public string? DistanceNotice { get; set; }
    public string? DistanceNoticeBn { get; set; }
}
