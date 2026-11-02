using Microsoft.AspNetCore.Mvc;
using VaraKoto.Core.Common;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Interfaces;

namespace VaraKoto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FaresController : ControllerBase
{
    private readonly IFareCalculationService _fareCalculationService;
    private readonly IFareContributionService _fareContributionService;
    private readonly ILogger<FaresController> _logger;

    public FaresController(
        IFareCalculationService fareCalculationService, 
        IFareContributionService fareContributionService,
        ILogger<FaresController> logger)
    {
        _fareCalculationService = fareCalculationService;
        _fareContributionService = fareContributionService;
        _logger = logger;
    }

    /// <summary>
    /// Calculates estimated fares for a trip between origin and destination.
    /// </summary>
    [HttpPost("calculate")]
    [ProducesResponseType(typeof(FareCalculationResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CalculateFare([FromBody] FareCalculationRequestDto request, CancellationToken cancellationToken)
    {
        if (request == null)
        {
            return BadRequest(new { message = "অনুরোধ সঠিক নয় (Request body cannot be null)." });
        }

        var hasOrigin = request.FromLocationId.HasValue || (request.FromLatitude.HasValue && request.FromLongitude.HasValue);
        var hasDestination = request.ToLocationId.HasValue || (request.ToLatitude.HasValue && request.ToLongitude.HasValue);

        if (!hasOrigin)
        {
            return BadRequest(new { message = "যাত্রার প্রারম্ভিক স্থান নির্বাচন করুন (Origin location is required)." });
        }

        if (!hasDestination)
        {
            return BadRequest(new { message = "গন্তব্য স্থান নির্বাচন করুন (Destination location is required)." });
        }

        try
        {
            var result = await _fareCalculationService.CalculateFareAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error calculating fare.");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "ভাড়া হিসেব করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" });
        }
    }

    /// <summary>
    /// Gets fare breakdowns for a given road distance and duration across all active transport types.
    /// </summary>
    [HttpGet("estimate-for-distance")]
    [ProducesResponseType(typeof(IReadOnlyList<FareBreakdownDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> EstimateForDistance(
        [FromQuery] decimal distanceKm, 
        [FromQuery] decimal? durationMinutes = null,
        [FromQuery] int? fromLocationId = null,
        [FromQuery] int? toLocationId = null,
        CancellationToken cancellationToken = default)
    {
        if (distanceKm <= 0)
        {
            return BadRequest(new { message = "দূরত্ব ০ কিমির বেশি হতে হবে (Distance must be greater than 0)." });
        }

        // Estimate duration if not provided (assume 22 km/h average Dhaka traffic)
        var duration = durationMinutes ?? Math.Max(5m, (distanceKm / 22m) * 60m);

        var fares = await _fareCalculationService.CalculateAllFaresForDistanceAsync(
            distanceKm, 
            duration, 
            fromLocationId, 
            toLocationId, 
            cancellationToken);

        return Ok(fares);
    }

    /// <summary>
    /// Retrieves active transport types and their base rules.
    /// </summary>
    [HttpGet("transports")]
    public async Task<IActionResult> GetTransportTypes(CancellationToken cancellationToken)
    {
        var types = await _fareCalculationService.GetActiveTransportTypesAsync(cancellationToken);
        var result = types.Select(t => new
        {
            t.Id,
            t.Code,
            t.NameEn,
            t.NameBn,
            t.IconKey,
            t.DisplayOrder,
            FareRule = t.FareRule == null ? null : new
            {
                t.FareRule.BaseFare,
                t.FareRule.BaseDistanceKm,
                t.FareRule.PerKmRate,
                t.FareRule.MinimumFare,
                t.FareRule.OfficialSourceNote
            }
        });

        return Ok(result);
    }

    /// <summary>
    /// Submits a user's actual transportation fare paid for a route.
    /// Moderates outliers, validates against standard rate, and benchmarks community reliability.
    /// </summary>
    [HttpPost("contribute")]
    [ProducesResponseType(typeof(FareContributionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ContributeFare([FromBody] FareContributionRequestDto request, CancellationToken cancellationToken)
    {
        if (request == null)
        {
            return BadRequest(new { message = "অনুরোধের তথ্য সঠিক নয় (Request body cannot be null)." });
        }

        request.FromName = InputSanitizer.Sanitize(request.FromName);
        request.ToName = InputSanitizer.Sanitize(request.ToName);

        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            clientIp = forwardedFor.FirstOrDefault()?.Split(',')[0].Trim();
        }

        var userAgent = Request.Headers.UserAgent.ToString();

        try
        {
            var result = await _fareContributionService.SubmitFareAsync(request, clientIp, userAgent, cancellationToken);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error submitting community fare.");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "ভাড়া জমা দিতে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" });
        }
    }

    /// <summary>
    /// Gets recent approved community contributions.
    /// </summary>
    [HttpGet("recent-contributions")]
    [ProducesResponseType(typeof(IReadOnlyList<RecentContributionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRecentContributions([FromQuery] int limit = 10, CancellationToken cancellationToken = default)
    {
        var clampedLimit = Math.Clamp(limit, 1, 50);
        var recent = await _fareContributionService.GetRecentApprovedSubmissionsAsync(clampedLimit, cancellationToken);
        return Ok(recent);
    }
}
