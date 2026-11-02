using Microsoft.AspNetCore.Mvc;
using VaraKoto.Core.Interfaces;

namespace VaraKoto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutesController : ControllerBase
{
    private readonly IRouteService _routeService;

    public RoutesController(IRouteService routeService)
    {
        _routeService = routeService;
    }

    [HttpGet("distance")]
    public async Task<IActionResult> GetDistance(
        [FromQuery] decimal fromLat,
        [FromQuery] decimal fromLng,
        [FromQuery] decimal toLat,
        [FromQuery] decimal toLng,
        [FromQuery] int? fromId = null,
        [FromQuery] int? toId = null,
        CancellationToken cancellationToken = default)
    {
        if (fromLat < 20.0m || fromLat > 27.0m || fromLng < 88.0m || fromLng > 93.0m ||
            toLat < 20.0m || toLat > 27.0m || toLng < 88.0m || toLng > 93.0m)
        {
            return BadRequest(new { message = "Origin or Destination coordinates are outside Bangladesh." });
        }

        var result = await _routeService.CalculateDistanceAsync(
            fromLat, fromLng, toLat, toLng, fromId, toId, cancellationToken);

        return Ok(result);
    }
}
