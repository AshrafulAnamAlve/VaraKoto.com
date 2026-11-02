using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using VaraKoto.Api.Controllers;
using VaraKoto.Core.Common;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Entities;
using VaraKoto.Core.Interfaces;
using VaraKoto.Infrastructure.Data;
using VaraKoto.Infrastructure.Services;
using Xunit;

namespace VaraKoto.Api.Tests;

public class FareCalculationTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly VaraKotoDbContext _context;

    public FareCalculationTests()
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
                OfficialSourceNote = "BRTA Official Gazette Rate (Dhaka Metro City Bus)",
                LastUpdated = DateTime.UtcNow
            }
        };

        var rickshaw = new TransportType
        {
            Id = 2,
            Code = "rickshaw",
            NameEn = "Rickshaw",
            NameBn = "রিকশা",
            IconKey = "pedal_bike",
            DisplayOrder = 2,
            IsActive = true,
            FareRule = new FareRule
            {
                BaseFare = 30.00m,
                BaseDistanceKm = 1.0m,
                PerKmRate = 20.00m,
                MinimumFare = 25.00m,
                EstimatedSpeedKmph = 12.0m,
                HighDemandMultiplier = 1.0m,
                OfficialSourceNote = "Dhaka Local Community Negotiated Rate",
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
                OfficialSourceNote = "BRTA Meter Base Rate",
                LastUpdated = DateTime.UtcNow
            }
        };

        var bike = new TransportType
        {
            Id = 4,
            Code = "bike",
            NameEn = "Bike",
            NameBn = "বাইক",
            IconKey = "two_wheeler",
            DisplayOrder = 4,
            IsActive = true,
            FareRule = new FareRule
            {
                BaseFare = 25.00m,
                BaseDistanceKm = 1.0m,
                PerKmRate = 13.00m,
                MinimumFare = 35.00m,
                EstimatedSpeedKmph = 25.0m,
                HighDemandMultiplier = 1.0m,
                OfficialSourceNote = "Ride-Sharing Standard Estimate (Pathao/Uber)",
                LastUpdated = DateTime.UtcNow
            }
        };

        _context.TransportTypes.AddRange(bus, rickshaw, cng, bike);

        var mirpur10 = new Location
        {
            Id = 1,
            NameEn = "Mirpur 10",
            NameBn = "মিরপুর ১০",
            Latitude = 23.806900m,
            Longitude = 90.368700m,
            District = "Dhaka",
            Thana = "Mirpur",
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
            Thana = "Tejgaon",
            IsHub = true
        };

        _context.Locations.AddRange(mirpur10, farmgate);
        _context.SaveChanges();
    }

    [Fact]
    public void BengaliNumberHelper_ConvertsDigitsAccurately()
    {
        Assert.Equal("২৫", BengaliNumberHelper.ToBengaliDigits(25));
        Assert.Equal("৫০ - ৭০", BengaliNumberHelper.ToBengaliDigits("50 - 70"));
        Assert.Equal("১২০", BengaliNumberHelper.ToBengaliDigits(120m));
        Assert.Equal("০", BengaliNumberHelper.ToBengaliDigits(0));
    }

    [Fact]
    public async Task BusFare_ShortDistance_ReturnsBrtaMinimumFare()
    {
        var mockRouteService = new FakeRouteService(3.0m, 15.0m);
        var mockLocationService = new FakeLocationService();
        var fareService = new FareCalculationService(
            _context, 
            mockLocationService, 
            mockRouteService, 
            NullLogger<FareCalculationService>.Instance);

        var request = new FareCalculationRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "bus"
        };

        var result = await fareService.CalculateFareAsync(request);

        Assert.NotNull(result);
        Assert.Equal(3.0m, result.DistanceKm);
        Assert.Equal("bus", result.PrimaryFare.TransportCode);
        Assert.Equal(20.00m, result.PrimaryFare.EstimatedMinFare); // Minimum BRTA fare ৳20
        Assert.Equal("OfficialRate", result.PrimaryFare.FareType);
        Assert.Equal("Official", result.PrimaryFare.Reliability);
    }

    [Fact]
    public async Task BusFare_MediumDistance_CalculatesPerKmAboveFiveKm()
    {
        // 8 km journey: first 5 km is ৳20, next 3 km * ৳2.50 = ৳7.50 -> ৳27.50 -> rounded to ৳30
        var mockRouteService = new FakeRouteService(8.0m, 30.0m);
        var mockLocationService = new FakeLocationService();
        var fareService = new FareCalculationService(
            _context, 
            mockLocationService, 
            mockRouteService, 
            NullLogger<FareCalculationService>.Instance);

        var request = new FareCalculationRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "bus"
        };

        var result = await fareService.CalculateFareAsync(request);

        Assert.NotNull(result);
        Assert.Equal(30.00m, result.PrimaryFare.EstimatedMinFare);
        Assert.True(result.PrimaryFare.EstimatedMaxFare >= 30.00m);
    }

    [Fact]
    public async Task CngFare_ReturnsDualPricing_OfficialMeterAndNegotiatedMarket()
    {
        var mockRouteService = new FakeRouteService(7.5m, 25.0m);
        var mockLocationService = new FakeLocationService();
        var fareService = new FareCalculationService(
            _context, 
            mockLocationService, 
            mockRouteService, 
            NullLogger<FareCalculationService>.Instance);

        var request = new FareCalculationRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "cng"
        };

        var result = await fareService.CalculateFareAsync(request);

        Assert.NotNull(result.PrimaryFare.OfficialMeterFare);
        Assert.True(result.PrimaryFare.OfficialMeterFare.Value > 0);
        Assert.True(result.PrimaryFare.EstimatedMinFare >= 120m, "Dhaka CNG market base should be at least ৳120");
        Assert.True(result.PrimaryFare.EstimatedMaxFare > result.PrimaryFare.EstimatedMinFare);
        Assert.Contains("চুক্তিভিত্তিক", result.PrimaryFare.SourceNoteBn);
    }

    [Fact]
    public async Task RickshawFare_LongDistance_SetsNotice()
    {
        var mockRouteService = new FakeRouteService(9.5m, 45.0m);
        var mockLocationService = new FakeLocationService();
        var fareService = new FareCalculationService(
            _context, 
            mockLocationService, 
            mockRouteService, 
            NullLogger<FareCalculationService>.Instance);

        var request = new FareCalculationRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "rickshaw"
        };

        var result = await fareService.CalculateFareAsync(request);

        Assert.False(result.PrimaryFare.IsAvailableForDistance);
        Assert.NotNull(result.PrimaryFare.DistanceNotice);
        Assert.NotNull(result.PrimaryFare.DistanceNoticeBn);
    }

    [Fact]
    public async Task CommunitySubmissions_EnhanceFareReliability()
    {
        // Add 3 approved community submissions for Mirpur 10 -> Farmgate (CNG: ৳240, ৳250, ৳260)
        _context.FareSubmissions.AddRange(
            new FareSubmission
            {
                TransportTypeId = 3, // CNG
                FromLocationId = 1,
                ToLocationId = 2,
                ActualFarePaid = 240m,
                DistanceKm = 7.5m,
                TravelDate = DateTime.UtcNow.AddDays(-1),
                ModerationStatus = "Approved",
                SubmittedAt = DateTime.UtcNow.AddDays(-1)
            },
            new FareSubmission
            {
                TransportTypeId = 3,
                FromLocationId = 1,
                ToLocationId = 2,
                ActualFarePaid = 250m,
                DistanceKm = 7.5m,
                TravelDate = DateTime.UtcNow.AddDays(-2),
                ModerationStatus = "Approved",
                SubmittedAt = DateTime.UtcNow.AddDays(-2)
            },
            new FareSubmission
            {
                TransportTypeId = 3,
                FromLocationId = 1,
                ToLocationId = 2,
                ActualFarePaid = 260m,
                DistanceKm = 7.5m,
                TravelDate = DateTime.UtcNow.AddDays(-3),
                ModerationStatus = "Approved",
                SubmittedAt = DateTime.UtcNow.AddDays(-3)
            }
        );
        _context.SaveChanges();

        var mockRouteService = new FakeRouteService(7.5m, 25.0m);
        var mockLocationService = new FakeLocationService();
        var fareService = new FareCalculationService(
            _context, 
            mockLocationService, 
            mockRouteService, 
            NullLogger<FareCalculationService>.Instance);

        var request = new FareCalculationRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "cng"
        };

        var result = await fareService.CalculateFareAsync(request);

        Assert.Equal("CommunityBacked", result.PrimaryFare.Reliability);
        Assert.Equal(5, result.PrimaryFare.ReliabilityStars);
        Assert.Equal(3, result.PrimaryFare.CommunitySubmissionCount);
        Assert.Equal(250m, result.PrimaryFare.CommunityAverageFare);
    }

    [Fact]
    public async Task FaresController_Calculate_ReturnsOkWithFares()
    {
        var mockRouteService = new FakeRouteService(7.5m, 25.0m);
        var mockLocationService = new FakeLocationService();
        var fareService = new FareCalculationService(
            _context, 
            mockLocationService, 
            mockRouteService, 
            NullLogger<FareCalculationService>.Instance);

        var mockContributionService = new FakeFareContributionService();
        var controller = new FaresController(fareService, mockContributionService, NullLogger<FaresController>.Instance);

        var request = new FareCalculationRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 2,
            TransportCode = "bike"
        };

        var actionResult = await controller.CalculateFare(request, CancellationToken.None);
        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var result = Assert.IsType<FareCalculationResultDto>(okResult.Value);

        Assert.Equal("bike", result.PrimaryFare.TransportCode);
        Assert.Equal(4, result.AllFares.Count); // Bus, Rickshaw, CNG, Bike
    }

    [Fact]
    public async Task FaresController_SameOriginAndDestination_ReturnsBadRequest()
    {
        var mockRouteService = new FakeRouteService(0.0m, 0.0m);
        var mockLocationService = new FakeLocationService();
        var fareService = new FareCalculationService(
            _context, 
            mockLocationService, 
            mockRouteService, 
            NullLogger<FareCalculationService>.Instance);

        var mockContributionService = new FakeFareContributionService();
        var controller = new FaresController(fareService, mockContributionService, NullLogger<FaresController>.Instance);

        var request = new FareCalculationRequestDto
        {
            FromLocationId = 1,
            ToLocationId = 1, // Same ID
            TransportCode = "bus"
        };

        var actionResult = await controller.CalculateFare(request, CancellationToken.None);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult);
        Assert.NotNull(badRequestResult.Value);
    }

    public void Dispose()
    {
        _context.Dispose();
        _connection.Dispose();
    }

    private class FakeRouteService(decimal distanceKm, decimal durationMinutes) : IRouteService
    {
        public Task<DistanceResultDto> CalculateDistanceAsync(
            decimal fromLat, 
            decimal fromLng, 
            decimal toLat, 
            decimal toLng, 
            int? fromLocationId = null, 
            int? toLocationId = null, 
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new DistanceResultDto
            {
                DistanceKm = distanceKm,
                DurationMinutes = durationMinutes,
                Source = "FakeRouteService",
                IsEstimatedRoute = false
            });
        }
    }

    private class FakeLocationService : ILocationService
    {
        public Task<IReadOnlyList<LocationDto>> SearchLocationsAsync(string query, int limit = 8, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<IReadOnlyList<LocationDto>>([]);
        }

        public Task<LocationDto?> ReverseGeocodeAsync(decimal latitude, decimal longitude, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<LocationDto?>(null);
        }

        public Task<LocationDto> GetOrCreateLocationAsync(decimal latitude, decimal longitude, string nameEn, string nameBn, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new LocationDto
            {
                Id = 99,
                NameEn = nameEn,
                NameBn = nameBn,
                DisplayName = nameBn,
                Latitude = latitude,
                Longitude = longitude,
                Source = "Fake"
            });
        }
    }

    private class FakeFareContributionService : IFareContributionService
    {
        public Task<FareContributionResponseDto> SubmitFareAsync(FareContributionRequestDto request, string? clientIp, string? userAgent, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new FareContributionResponseDto
            {
                SubmissionId = 1,
                Status = "Approved",
                SubmittedFare = request.ActualFarePaid
            });
        }

        public Task<IReadOnlyList<RecentContributionDto>> GetRecentApprovedSubmissionsAsync(int limit = 10, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<IReadOnlyList<RecentContributionDto>>([]);
        }
    }
}
