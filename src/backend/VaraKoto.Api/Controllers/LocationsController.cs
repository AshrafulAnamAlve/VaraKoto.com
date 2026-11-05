using Microsoft.AspNetCore.Mvc;
using VaraKoto.Core.Common;
using VaraKoto.Core.Interfaces;

namespace VaraKoto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationsController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string? q,
        [FromQuery] string? district,
        [FromQuery] int limit = 8,
        CancellationToken cancellationToken = default)
    {
        var sanitizedQuery = InputSanitizer.Sanitize(q);
        if (string.IsNullOrWhiteSpace(sanitizedQuery))
        {
            return Ok(Array.Empty<object>());
        }

        var sanitizedDistrict = InputSanitizer.Sanitize(district);
        var results = await _locationService.SearchLocationsAsync(sanitizedQuery, Math.Clamp(limit, 1, 20), sanitizedDistrict, cancellationToken);
        return Ok(results);
    }

    [HttpGet("reverse")]
    public async Task<IActionResult> Reverse([FromQuery] decimal lat, [FromQuery] decimal lng, CancellationToken cancellationToken = default)
    {
        if (lat < 20.0m || lat > 27.0m || lng < 88.0m || lng > 93.0m)
        {
            return BadRequest(new { message = "Coordinates are outside of Bangladesh boundaries." });
        }

        var result = await _locationService.ReverseGeocodeAsync(lat, lng, cancellationToken);
        if (result == null)
        {
            return NotFound(new { message = "Could not reverse geocode given coordinates." });
        }

        return Ok(result);
    }
}
