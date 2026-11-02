using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Entities;
using VaraKoto.Infrastructure.Data;
using VaraKoto.Infrastructure.Security;
using VaraKoto.Infrastructure.Services;
using Xunit;

namespace VaraKoto.Api.Tests;

public class AdminTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly VaraKotoDbContext _context;
    private readonly AdminService _adminService;

    public AdminTests()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<VaraKotoDbContext>()
            .UseSqlite(_connection)
            .Options;

        _context = new VaraKotoDbContext(options);
        _context.Database.EnsureCreated();

        _adminService = new AdminService(_context, NullLogger<AdminService>.Instance);

        SeedTestData();
    }

    private void SeedTestData()
    {
        var (hash, salt) = PasswordSecurityHelper.HashPassword("Admin@123");
        var admin = new AdminUser
        {
            Username = "admin",
            PasswordHash = hash,
            Salt = salt,
            DisplayName = "VaraKoto Admin",
            Role = "Admin",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        _context.AdminUsers.Add(admin);

        var bus = new TransportType
        {
            Code = "bus",
            NameEn = "Bus",
            NameBn = "বাস",
            IconKey = "directions_bus",
            DisplayOrder = 1,
            IsActive = true
        };
        _context.TransportTypes.Add(bus);

        var locFrom = new Location
        {
            NameEn = "Mirpur 10",
            NameBn = "মিরপুর ১০",
            Latitude = 23.8069m,
            Longitude = 90.3687m,
            IsHub = true
        };
        var locTo = new Location
        {
            NameEn = "Farmgate",
            NameBn = "ফার্মগেট",
            Latitude = 23.7561m,
            Longitude = 90.3872m,
            IsHub = true
        };
        _context.Locations.AddRange(locFrom, locTo);
        _context.SaveChanges();

        // Seed 1 Pending, 1 Approved submission
        var sub1 = new FareSubmission
        {
            TransportTypeId = bus.Id,
            FromLocationId = locFrom.Id,
            ToLocationId = locTo.Id,
            ActualFarePaid = 40.00m,
            CalculatedStandardFare = 35.00m,
            DistanceKm = 7.5m,
            ModerationStatus = "Pending",
            SubmittedAt = DateTime.UtcNow
        };
        var sub2 = new FareSubmission
        {
            TransportTypeId = bus.Id,
            FromLocationId = locFrom.Id,
            ToLocationId = locTo.Id,
            ActualFarePaid = 35.00m,
            CalculatedStandardFare = 35.00m,
            DistanceKm = 7.5m,
            ModerationStatus = "Approved",
            SubmittedAt = DateTime.UtcNow.AddMinutes(-30)
        };
        _context.FareSubmissions.AddRange(sub1, sub2);
        _context.SaveChanges();
    }

    [Fact]
    public async Task AdminLogin_WithValidCredentials_ReturnsTokenAndUserInfo()
    {
        var result = await _adminService.LoginAsync(new AdminLoginRequestDto
        {
            Username = "admin",
            Password = "Admin@123"
        });

        Assert.NotNull(result);
        Assert.NotEmpty(result.Token);
        Assert.Equal("admin", result.Username);
        Assert.Equal("Admin", result.Role);
    }

    [Fact]
    public async Task AdminLogin_WithInvalidPassword_ThrowsUnauthorizedAccessException()
    {
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _adminService.LoginAsync(new AdminLoginRequestDto
            {
                Username = "admin",
                Password = "WrongPassword999"
            }));
    }

    [Fact]
    public async Task GetStats_ReturnsAccurateCounts()
    {
        var stats = await _adminService.GetStatsAsync();

        Assert.Equal(1, stats.TotalPending);
        Assert.Equal(1, stats.TotalApproved);
        Assert.Equal(0, stats.TotalFlagged);
        Assert.Equal(2, stats.TotalSubmissions);
    }

    [Fact]
    public async Task GetSubmissions_CalculatesDifferencesAccurately()
    {
        var submissions = await _adminService.GetSubmissionsAsync("Pending");

        Assert.Single(submissions);
        var sub = submissions[0];
        Assert.Equal(40.00m, sub.UserSubmittedFare);
        Assert.Equal(35.00m, sub.DatabaseStandardFare);
        Assert.Equal(5.00m, sub.DifferenceAmount); // 40 - 35 = +5
        Assert.True(sub.DifferencePercentage > 14m); // ~14.3%
        Assert.Equal("Pending", sub.ModerationStatus);
    }

    [Fact]
    public async Task ApproveSubmission_UpdatesStatusToApprovedAndSetsReviewedAt()
    {
        var pending = await _context.FareSubmissions.FirstAsync(s => s.ModerationStatus == "Pending");

        var approved = await _adminService.ApproveSubmissionAsync(pending.Id, new AdminReviewRequestDto
        {
            AdminNote = "Verified with local bus conductor rate"
        });

        Assert.Equal("Approved", approved.ModerationStatus);
        Assert.NotNull(approved.ReviewedAt);
        Assert.Equal("Verified with local bus conductor rate", approved.AdminNote);

        var inDb = await _context.FareSubmissions.FindAsync(pending.Id);
        Assert.Equal("Approved", inDb!.ModerationStatus);
    }

    [Fact]
    public async Task RejectSubmission_UpdatesStatusToRejected()
    {
        var pending = await _context.FareSubmissions.FirstAsync(s => s.ModerationStatus == "Pending");

        var rejected = await _adminService.RejectSubmissionAsync(pending.Id, new AdminReviewRequestDto
        {
            AdminNote = "Unrealistic rate"
        });

        Assert.Equal("Rejected", rejected.ModerationStatus);
        Assert.Equal("Unrealistic rate", rejected.AdminNote);

        var inDb = await _context.FareSubmissions.FindAsync(pending.Id);
        Assert.Equal("Rejected", inDb!.ModerationStatus);
    }

    public void Dispose()
    {
        _context.Dispose();
        _connection.Dispose();
    }
}
