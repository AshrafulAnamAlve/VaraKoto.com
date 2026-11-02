using VaraKoto.Core.DTOs;

namespace VaraKoto.Core.Interfaces;

public interface IFareContributionService
{
    /// <summary>
    /// Processes a community fare submission with anti-spam safeguards, geographic validation, and statistical outlier moderation.
    /// </summary>
    Task<FareContributionResponseDto> SubmitFareAsync(
        FareContributionRequestDto request, 
        string? clientIp, 
        string? userAgent, 
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves recent approved community contributions for public transparency.
    /// </summary>
    Task<IReadOnlyList<RecentContributionDto>> GetRecentApprovedSubmissionsAsync(
        int limit = 10, 
        CancellationToken cancellationToken = default);
}
