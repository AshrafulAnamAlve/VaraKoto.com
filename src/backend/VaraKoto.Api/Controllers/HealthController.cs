using Microsoft.AspNetCore.Mvc;

namespace VaraKoto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public HealthController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "Healthy",
            app = "VaraKoto.com API",
            tagline = "গাড়ি ভাড়া কত?",
            environment = _environment.EnvironmentName,
            timestampUtc = DateTime.UtcNow,
            version = "1.0.0"
        });
    }
}
