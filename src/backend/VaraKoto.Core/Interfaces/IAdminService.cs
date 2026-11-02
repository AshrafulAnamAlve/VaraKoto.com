using VaraKoto.Core.DTOs;

namespace VaraKoto.Core.Interfaces;

public interface IAdminService
{
    Task<AdminLoginResponseDto> LoginAsync(AdminLoginRequestDto request, CancellationToken cancellationToken = default);
    Task<AdminStatsDto> GetStatsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AdminSubmissionDto>> GetSubmissionsAsync(string? status = null, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default);
    Task<AdminSubmissionDto> ApproveSubmissionAsync(int id, AdminReviewRequestDto? request = null, CancellationToken cancellationToken = default);
    Task<AdminSubmissionDto> RejectSubmissionAsync(int id, AdminReviewRequestDto? request = null, CancellationToken cancellationToken = default);
    Task<bool> DeleteSubmissionAsync(int id, CancellationToken cancellationToken = default);
}
