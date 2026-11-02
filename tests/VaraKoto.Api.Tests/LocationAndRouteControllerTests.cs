using Microsoft.AspNetCore.Mvc;
using Moq;
using VaraKoto.Api.Controllers;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Interfaces;
using VaraKoto.Infrastructure.Services;
using Xunit;

namespace VaraKoto.Api.Tests;

public class LocationAndRouteControllerTests
{
    [Fact]
    public async Task LocationsController_Search_Returns_Empty_When_Query_Is_Empty()
    {
        // Arrange
        var mockLocationService = new Mock<ILocationService>();
        var controller = new LocationsController(mockLocationService.Object);

        // Act
        var result = await controller.Search(string.Empty);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task LocationsController_Search_Calls_Service_And_Returns_Results()
    {
        // Arrange
        var mockLocationService = new Mock<ILocationService>();
        var sampleResults = new List<LocationDto>
        {
            new() { Id = 1, NameEn = "Mirpur 10", NameBn = "মিরপুর ১০", Latitude = 23.8069m, Longitude = 90.3687m, IsHub = true }
        };

        mockLocationService
            .Setup(s => s.SearchLocationsAsync("Mirpur", 8, It.IsAny<CancellationToken>()))
            .ReturnsAsync(sampleResults);

        var controller = new LocationsController(mockLocationService.Object);

        // Act
        var result = await controller.Search("Mirpur", 8);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedList = Assert.IsAssignableFrom<IEnumerable<LocationDto>>(okResult.Value);
        Assert.Single(returnedList);
    }

    [Fact]
    public async Task LocationsController_Reverse_Rejects_Coordinates_Outside_Bangladesh()
    {
        // Arrange
        var mockLocationService = new Mock<ILocationService>();
        var controller = new LocationsController(mockLocationService.Object);

        // Act - 51.5074, -0.1278 (London) is outside Bangladesh (20-27 N, 88-93 E)
        var result = await controller.Reverse(51.5074m, -0.1278m);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task RoutesController_GetDistance_Rejects_Invalid_Coordinates()
    {
        // Arrange
        var mockRouteService = new Mock<IRouteService>();
        var controller = new RoutesController(mockRouteService.Object);

        // Act - Out of bounds coords
        var result = await controller.GetDistance(0m, 0m, 0m, 0m);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task RoutesController_GetDistance_Returns_Valid_DistanceResult()
    {
        // Arrange
        var mockRouteService = new Mock<IRouteService>();
        mockRouteService
            .Setup(r => r.CalculateDistanceAsync(
                23.8069m, 90.3687m, 23.7571m, 90.3895m, 1, 2, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DistanceResultDto
            {
                DistanceKm = 7.50m,
                DurationMinutes = 22.0m,
                Source = "OSRM"
            });

        var controller = new RoutesController(mockRouteService.Object);

        // Act
        var result = await controller.GetDistance(23.8069m, 90.3687m, 23.7571m, 90.3895m, 1, 2);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var distanceResult = Assert.IsType<DistanceResultDto>(okResult.Value);
        Assert.Equal(7.50m, distanceResult.DistanceKm);
        Assert.Equal("OSRM", distanceResult.Source);
    }

    [Fact]
    public void OsrmRouteService_Haversine_Calculates_Realistic_Bangladesh_Distance()
    {
        // Mirpur 10 (23.8069, 90.3687) to Farmgate (23.7571, 90.3895)
        // Straight line distance is ~6 km, road distance with 1.28 factor is ~7.5-8.5 km
        var distance = OsrmRouteService.CalculateHaversineDistance(23.8069m, 90.3687m, 23.7571m, 90.3895m);

        Assert.True(distance >= 6.5m && distance <= 9.0m, $"Distance {distance} km is within realistic expected range for Mirpur 10 -> Farmgate");
    }
}
