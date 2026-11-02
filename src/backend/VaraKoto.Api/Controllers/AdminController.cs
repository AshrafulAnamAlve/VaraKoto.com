using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Interfaces;

namespace VaraKoto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(IAdminService adminService, ILogger<AdminController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    /// <summary>
    /// Admin login with username and password
    /// </summary>
    [HttpPost("login")]
    [EnableRateLimiting("admin-login-policy")]
    [ProducesResponseType(typeof(AdminLoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] AdminLoginRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            var response = await _adminService.LoginAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Overview statistics for admin dashboard
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(AdminStatsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStats(CancellationToken cancellationToken)
    {
        var stats = await _adminService.GetStatsAsync(cancellationToken);
        return Ok(stats);
    }

    /// <summary>
    /// Get community fare submissions with database vs user comparison
    /// </summary>
    [HttpGet("submissions")]
    [ProducesResponseType(typeof(IReadOnlyList<AdminSubmissionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSubmissions(
        [FromQuery] string? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var submissions = await _adminService.GetSubmissionsAsync(status, page, pageSize, cancellationToken);
        return Ok(submissions);
    }

    /// <summary>
    /// Approve a user submission, publishing it to commuters and reliability calculations
    /// </summary>
    [HttpPost("submissions/{id:int}/approve")]
    [ProducesResponseType(typeof(AdminSubmissionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ApproveSubmission(
        int id, 
        [FromBody] AdminReviewRequestDto? request, 
        CancellationToken cancellationToken)
    {
        try
        {
            var approved = await _adminService.ApproveSubmissionAsync(id, request, cancellationToken);
            return Ok(approved);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Reject a user submission
    /// </summary>
    [HttpPost("submissions/{id:int}/reject")]
    [ProducesResponseType(typeof(AdminSubmissionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RejectSubmission(
        int id, 
        [FromBody] AdminReviewRequestDto? request, 
        CancellationToken cancellationToken)
    {
        try
        {
            var rejected = await _adminService.RejectSubmissionAsync(id, request, cancellationToken);
            return Ok(rejected);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a user submission
    /// </summary>
    [HttpDelete("submissions/{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSubmission(int id, CancellationToken cancellationToken)
    {
        var deleted = await _adminService.DeleteSubmissionAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound(new { message = $"Submission {id} not found." });
        }
        return NoContent();
    }
}
