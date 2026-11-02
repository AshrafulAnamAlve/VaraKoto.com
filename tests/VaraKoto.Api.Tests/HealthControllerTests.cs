using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using VaraKoto.Api.Controllers;
using Xunit;

namespace VaraKoto.Api.Tests;

public class HealthControllerTests
{
    private class FakeWebHostEnvironment : IWebHostEnvironment
    {
        public string EnvironmentName { get; set; } = "Development";
        public string ApplicationName { get; set; } = "VaraKoto.Api";
        public string WebRootPath { get; set; } = string.Empty;
        public IFileProvider WebRootFileProvider { get; set; } = null!;
        public string ContentRootPath { get; set; } = string.Empty;
        public IFileProvider ContentRootFileProvider { get; set; } = null!;
    }

    [Fact]
    public async Task Get_ReturnsOkResult_WithHealthyStatus()
    {
        // Arrange
        var fakeEnv = new FakeWebHostEnvironment();
        var controller = new HealthController(fakeEnv);

        // Act
        var result = await controller.Get();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var propertyInfo = okResult.Value.GetType().GetProperty("status");
        Assert.NotNull(propertyInfo);

        var statusValue = propertyInfo.GetValue(okResult.Value)?.ToString();
        Assert.Equal("Healthy", statusValue);
    }
}
