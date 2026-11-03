using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using VaraKoto.Api.Controllers;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Entities;
using VaraKoto.Core.Interfaces;
using VaraKoto.Infrastructure.Data;
using VaraKoto.Infrastructure.Services;
using Xunit;

namespace VaraKoto.Api.Tests;

public class FareContributionTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly VaraKotoDbContext _context;

    public FareContributionTests()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<VaraKotoDbContext>()
            .UseSqlite(_connection)
            .Options;

        _context = new VaraKotoDbContext(options);
        _context.Database.EnsureCreated();

        SeedTestData();
    }

    private void SeedTestData()
    {
        var bus = new TransportType
        {
            Id = 1,
            Code = "bus",
            NameEn = "Bus",
            NameBn = "বাস",
            IconKey = "directions_bus",
            DisplayOrder = 1,
            IsActive = true,
            FareRule = new FareRule
            {
                BaseFare = 20.00m,
                BaseDistanceKm = 5.0m,
                PerKmRate = 2.50m,
                MinimumFare = 20.00m,
                EstimatedSpeedKmph = 15.0m,
                HighDemandMultiplier = 1.0m,
                OfficialSourceNote = "BRTA Official",
                LastUpdated = DateTime.UtcNow
            }
        };

        var cng = new TransportType
        {
            Id = 3,
            Code = "cng",
            NameEn = "CNG",
            NameBn = "সিএনজি",
            IconKey = "electric_rickshaw",
            DisplayOrder = 3,
            IsActive = true,
            FareRule = new FareRule
            {
                BaseFare = 40.00m,
                BaseDistanceKm = 2.0m,
                PerKmRate = 12.00m,
                MinimumFare = 40.00m,
                EstimatedSpeedKmph = 22.0m,
                HighDemandMultiplier = 1.0m,
                OfficialSourceNote = "BRTA Meter",
                LastUpdated = DateTime.UtcNow
            }
        };

        _context.TransportTypes.AddRange(bus, cng);

        var mirpur = new Location
        {
            Id = 1,
            NameEn = "Mirpur 10",
            NameBn = "মিরপুর ১০",
            Latitude = 23.806900m,
            Longitude = 90.368700m,
            District = "Dhaka",
            IsHub = true
        };

        var farmgate = new Location
        {
            Id = 2,
            NameEn = "Farmgate",
            NameBn = "ফার্মগেট",
            Latitude = 23.756100m,
            Longitude = 90.387200m,
            District = "Dhaka",
            IsHub = true
        };

        _context.Locations.AddRange(mirpur, farmgate);
        _context.SaveChanges();
    }

    [Fact]
    public async Task SubmitFare_RealisticAmount_ApprovesAndSaves()
    {
        var mockRoute = new FakeRouteService(7.5m, 25m);
        var mockLocation = new FakeLocationService();
        var calcService = new FareCalculationService(_context, mockLocation, mockRoute, NullLogger<FareCalculationService>.Instance);
        var contributionService = new FareContributionService(_context, mockLocation, mockRoute, calcService, NullLogger<FareContributionService>.Instance);

        var request = new FareContributionRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "bus",
            ActualFarePaid = 30m, // Standard fare is ~৳30 for 7.5km
            TravelDate = DateTime.UtcNow
        };

        var response = await contributionService.SubmitFareAsync(request, "192.168.1.10", "Mozilla/5.0");

        Assert.NotNull(response);
        Assert.Equal("Pending", response.Status);
        Assert.True(response.SubmissionId > 0);

        var saved = await _context.FareSubmissions.FindAsync(response.SubmissionId);
        Assert.NotNull(saved);
        Assert.Equal(30m, saved.ActualFarePaid);
        Assert.Equal("Pending", saved.ModerationStatus);
    }

    [Fact]
    public async Task SubmitFare_MildDeviation_SetsPendingModeration()
    {
        var mockRoute = new FakeRouteService(7.5m, 25m);
        var mockLocation = new FakeLocationService();
        var calcService = new FareCalculationService(_context, mockLocation, mockRoute, NullLogger<FareCalculationService>.Instance);
        var contributionService = new FareContributionService(_context, mockLocation, mockRoute, calcService, NullLogger<FareContributionService>.Instance);

        var request = new FareContributionRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "bus",
            ActualFarePaid = 75m, // ~2.2x standard ৳35 mid fare
            TravelDate = DateTime.UtcNow
        };

        var response = await contributionService.SubmitFareAsync(request, "192.168.1.11", "Mozilla/5.0");

        Assert.Equal("Pending", response.Status);
        Assert.Contains("অ্যাডমিন", response.MessageBn);
    }

    [Fact]
    public async Task SubmitFare_ExtremeOutlier_FlagsModeration()
    {
        var mockRoute = new FakeRouteService(7.5m, 25m);
        var mockLocation = new FakeLocationService();
        var calcService = new FareCalculationService(_context, mockLocation, mockRoute, NullLogger<FareCalculationService>.Instance);
        var contributionService = new FareContributionService(_context, mockLocation, mockRoute, calcService, NullLogger<FareContributionService>.Instance);

        var request = new FareContributionRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "bus",
            ActualFarePaid = 350m, // 10x standard fare for a bus
            TravelDate = DateTime.UtcNow
        };

        var response = await contributionService.SubmitFareAsync(request, "192.168.1.12", "Mozilla/5.0");

        Assert.Equal("Flagged", response.Status);
        Assert.Contains("ভিন্ন হওয়ায়", response.MessageBn);
    }

    [Fact]
    public async Task SubmitFare_UnrealisticFareBelowTenTaka_ThrowsArgumentException()
    {
        var mockRoute = new FakeRouteService(7.5m, 25m);
        var mockLocation = new FakeLocationService();
        var calcService = new FareCalculationService(_context, mockLocation, mockRoute, NullLogger<FareCalculationService>.Instance);
        var contributionService = new FareContributionService(_context, mockLocation, mockRoute, calcService, NullLogger<FareContributionService>.Instance);

        var request = new FareContributionRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "bus",
            ActualFarePaid = 5m
        };

        await Assert.ThrowsAsync<ArgumentException>(() =>
            contributionService.SubmitFareAsync(request, "192.168.1.13", "Mozilla/5.0"));
    }

    [Fact]
    public async Task SubmitFare_DuplicateWithinTenMinutes_ThrowsInvalidOperationException()
    {
        var mockRoute = new FakeRouteService(7.5m, 25m);
        var mockLocation = new FakeLocationService();
        var calcService = new FareCalculationService(_context, mockLocation, mockRoute, NullLogger<FareCalculationService>.Instance);
        var contributionService = new FareContributionService(_context, mockLocation, mockRoute, calcService, NullLogger<FareContributionService>.Instance);

        var request = new FareContributionRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "cng",
            ActualFarePaid = 250m
        };

        // First submission succeeds
        await contributionService.SubmitFareAsync(request, "192.168.1.14", "Mozilla/5.0");

        // Immediate duplicate from same client fails
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            contributionService.SubmitFareAsync(request, "192.168.1.14", "Mozilla/5.0"));
    }

    [Fact]
    public async Task GetRecentApprovedSubmissions_ReturnsOnlyApproved()
    {
        _context.FareSubmissions.AddRange(
            new FareSubmission
            {
                TransportTypeId = 1,
                FromLocationId = 1,
                ToLocationId = 2,
                ActualFarePaid = 30m,
                DistanceKm = 7.5m,
                ModerationStatus = "Approved",
                SubmittedAt = DateTime.UtcNow.AddMinutes(-5)
            },
            new FareSubmission
            {
                TransportTypeId = 1,
                FromLocationId = 1,
                ToLocationId = 2,
                ActualFarePaid = 900m,
                DistanceKm = 7.5m,
                ModerationStatus = "Flagged",
                SubmittedAt = DateTime.UtcNow.AddMinutes(-2)
            }
        );
        _context.SaveChanges();

        var mockRoute = new FakeRouteService(7.5m, 25m);
        var mockLocation = new FakeLocationService();
        var calcService = new FareCalculationService(_context, mockLocation, mockRoute, NullLogger<FareCalculationService>.Instance);
        var contributionService = new FareContributionService(_context, mockLocation, mockRoute, calcService, NullLogger<FareContributionService>.Instance);

        var recent = await contributionService.GetRecentApprovedSubmissionsAsync(10);

        Assert.Single(recent);
        Assert.Equal(30m, recent[0].ActualFarePaid);
        Assert.Contains("মিরপুর ১০", recent[0].FromLocationName);
    }

    [Fact]
    public async Task Controller_ContributeEndpoint_ReturnsOk()
    {
        var mockRoute = new FakeRouteService(7.5m, 25m);
        var mockLocation = new FakeLocationService();
        var calcService = new FareCalculationService(_context, mockLocation, mockRoute, NullLogger<FareCalculationService>.Instance);
        var contributionService = new FareContributionService(_context, mockLocation, mockRoute, calcService, NullLogger<FareContributionService>.Instance);

        var controller = new FaresController(calcService, contributionService, NullLogger<FaresController>.Instance)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        var request = new FareContributionRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "bus",
            ActualFarePaid = 30m
        };

        var actionResult = await controller.ContributeFare(request, CancellationToken.None);
        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var response = Assert.IsType<FareContributionResponseDto>(okResult.Value);

        Assert.Equal("Pending", response.Status);
    }

        [Fact]
    public async Task SubmitFare_WithManualDistance_AndCustomPlaces_ShouldSucceed()
    {
        var calcService = new FareCalculationService(_context, new FakeLocationService(), new FakeRouteService(6m, 18m), NullLogger<FareCalculationService>.Instance);
        var contribService = new FareContributionService(_context, new FakeLocationService(), new FakeRouteService(6m, 18m), calcService, NullLogger<FareContributionService>.Instance);

        var request = new FareContributionRequestDto
        {
            FromName = "নতুন চরাঞ্চল",
            ToName = "উপজেলা বাজার",
            ManualDistanceKm = 6.0m,
            TransportCode = "bus",
            ActualFarePaid = 30m
        };

        var result = await contribService.SubmitFareAsync(request, "127.0.0.1", "TestAgent", CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("Pending", result.Status);
        Assert.Equal(30m, result.SubmittedFare);
        Assert.Contains("সফলভাবে জমা হয়েছে", result.MessageBn);
    }

        [Fact]
    public async Task SubmitFare_WhenNamesAreDistinct_LikeRajukAndAjuk_ShouldSucceed()
    {
        var rajukLoc = new Location
        {
            Id = 50,
            NameEn = "Rajuk Bhaban",
            NameBn = "রাজউক ভবন",
            Latitude = 23.7291m,
            Longitude = 90.4172m,
            IsHub = true
        };
        _context.Locations.Add(rajukLoc);
        await _context.SaveChangesAsync();

        var calcService = new FareCalculationService(_context, new FakeLocationService(), new FakeRouteService(5m, 15m), NullLogger<FareCalculationService>.Instance);
        var contribService = new FareContributionService(_context, new FakeLocationService(), new FakeRouteService(5m, 15m), calcService, NullLogger<FareContributionService>.Instance);

        var request = new FareContributionRequestDto
        {
            FromName = "Rajuk",
            ToName = "Ajuk",
            TransportCode = "cng",
            ActualFarePaid = 118m
        };

        var result = await contribService.SubmitFareAsync(request, "127.0.0.1", "TestAgent", CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("Pending", result.Status);
        Assert.Equal(118m, result.SubmittedFare);
        Assert.NotEqual(result.FromLocationName, result.ToLocationName);
    }

    public void Dispose()
    {
        _context.Dispose();
        _connection.Dispose();
    }

    private class FakeRouteService(decimal distanceKm, decimal durationMinutes) : IRouteService
    {
        public Task<DistanceResultDto> CalculateDistanceAsync(
            decimal fromLat, decimal fromLng, decimal toLat, decimal toLng,
            int? fromLocationId = null, int? toLocationId = null,
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new DistanceResultDto
            {
                DistanceKm = distanceKm,
                DurationMinutes = durationMinutes,
                Source = "FakeRoute"
            });
        }
    }

    private class FakeLocationService : ILocationService
    {
        public Task<IReadOnlyList<LocationDto>> SearchLocationsAsync(string query, int limit = 8, CancellationToken cancellationToken = default) =>
            Task.FromResult<IReadOnlyList<LocationDto>>([]);

        public Task<LocationDto?> ReverseGeocodeAsync(decimal latitude, decimal longitude, CancellationToken cancellationToken = default) =>
            Task.FromResult<LocationDto?>(null);

        public Task<LocationDto> GetOrCreateLocationAsync(decimal latitude, decimal longitude, string nameEn, string nameBn, CancellationToken cancellationToken = default) =>
            Task.FromResult(new LocationDto { Id = 99, NameEn = nameEn, NameBn = nameBn, Latitude = latitude, Longitude = longitude });
    }
}
