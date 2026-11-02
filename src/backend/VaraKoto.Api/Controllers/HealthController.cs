using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VaraKoto.Infrastructure.Data;

namespace VaraKoto.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly VaraKotoDbContext? _context;
    private readonly ILogger<HealthController>? _logger;

    public HealthController(
        IWebHostEnvironment environment,
        VaraKotoDbContext? context = null,
        ILogger<HealthController>? logger = null)
    {
        _environment = environment;
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken = default)
    {
        string dbStatus = "NotConfigured";
        int pendingMigrationsCount = -1;
        int locationsCount = 0;
        int transportsCount = 0;
        string? dbError = null;

        if (_context != null)
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync(cancellationToken);
                if (canConnect)
                {
                    dbStatus = "Connected";
                    var pending = await _context.Database.GetPendingMigrationsAsync(cancellationToken);
                    pendingMigrationsCount = pending.Count();
                    locationsCount = await _context.Locations.CountAsync(cancellationToken);
                    transportsCount = await _context.TransportTypes.CountAsync(cancellationToken);
                }
                else
                {
                    dbStatus = "CannotConnect";
                }
            }
            catch (Exception ex)
            {
                dbStatus = "Error";
                dbError = ex.Message;
                _logger?.LogWarning(ex, "Health check database connection test failed.");
            }
        }

        return Ok(new
        {
            status = "Healthy",
            app = "VaraKoto.com API",
            tagline = "গাড়ি ভাড়া কত?",
            environment = _environment.EnvironmentName,
            database = dbStatus,
            databaseError = dbError,
            pendingMigrations = pendingMigrationsCount,
            locationsSeeded = locationsCount,
            transportTypesSeeded = transportsCount,
            timestampUtc = DateTime.UtcNow,
            version = "1.0.0"
        });
    }

    /// <summary>
    /// Explicit migration runner endpoint. Useful in hosted environments like MonsterASP/RunASP.NET
    /// if startup migrations need to be verified or retried.
    /// </summary>
    [HttpGet("migrate")]
    [HttpPost("migrate")]
    public async Task<IActionResult> MigrateDatabase()
    {
        if (_context == null)
        {
            return BadRequest(new { success = false, message = "DbContext is not configured." });
        }

        try
        {
            _logger?.LogInformation("Explicit database migration triggered via /api/health/migrate");
            await DbInitializer.InitializeAsync(_context);

            var pending = await _context.Database.GetPendingMigrationsAsync();
            var applied = await _context.Database.GetAppliedMigrationsAsync();
            var locations = await _context.Locations.CountAsync();
            var transports = await _context.TransportTypes.CountAsync();

            return Ok(new
            {
                success = true,
                message = "Database migration and seeding completed successfully.",
                appliedMigrations = applied,
                pendingMigrationsRemaining = pending.Count(),
                locationsCount = locations,
                transportsCount = transports,
                timestampUtc = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "Manual migration trigger failed: {Message}", ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "Migration failed.",
                error = ex.Message,
                stackTrace = _environment.IsDevelopment() ? ex.StackTrace : null
            });
        }
    }
}
