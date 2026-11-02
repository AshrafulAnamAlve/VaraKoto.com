using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using VaraKoto.Core.Entities;
using VaraKoto.Infrastructure.Data;
using Xunit;

namespace VaraKoto.Api.Tests;

public class DatabaseTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly DbContextOptions<VaraKotoDbContext> _options;

    public DatabaseTests()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        _options = new DbContextOptionsBuilder<VaraKotoDbContext>()
            .UseSqlite(_connection)
            .Options;

        using var context = new VaraKotoDbContext(_options);
        context.Database.EnsureCreated();
    }

    public void Dispose()
    {
        _connection.Close();
        _connection.Dispose();
    }

    [Fact]
    public async Task DbInitializer_Seeds_Four_TransportTypes_With_Accurate_FareRules()
    {
        // Arrange
        await using var context = new VaraKotoDbContext(_options);

        // Act
        await DbInitializer.InitializeAsync(context);

        // Assert
        var types = await context.TransportTypes
            .Include(t => t.FareRule)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();

        Assert.Equal(4, types.Count);

        var bus = types.FirstOrDefault(t => t.Code == "bus");
        Assert.NotNull(bus);
        Assert.Equal("বাস", bus.NameBn);
        Assert.NotNull(bus.FareRule);
        Assert.Equal(20.00m, bus.FareRule.BaseFare);
        Assert.Equal(2.50m, bus.FareRule.PerKmRate);
        Assert.Equal(20.00m, bus.FareRule.MinimumFare);

        var rickshaw = types.FirstOrDefault(t => t.Code == "rickshaw");
        Assert.NotNull(rickshaw);
        Assert.Equal("রিকশা", rickshaw.NameBn);
        Assert.NotNull(rickshaw.FareRule);
        Assert.Equal(30.00m, rickshaw.FareRule.BaseFare);
        Assert.Equal(20.00m, rickshaw.FareRule.PerKmRate);

        var cng = types.FirstOrDefault(t => t.Code == "cng");
        Assert.NotNull(cng);
        Assert.Equal("সিএনজি", cng.NameBn);
        Assert.NotNull(cng.FareRule);
        Assert.Equal(40.00m, cng.FareRule.BaseFare);
        Assert.Equal(12.00m, cng.FareRule.PerKmRate);

        var bike = types.FirstOrDefault(t => t.Code == "bike");
        Assert.NotNull(bike);
        Assert.Equal("বাইক", bike.NameBn);
        Assert.NotNull(bike.FareRule);
        Assert.Equal(25.00m, bike.FareRule.BaseFare);
        Assert.Equal(13.00m, bike.FareRule.PerKmRate);
    }

    [Fact]
    public async Task DbInitializer_Seeds_Fifteen_Bangladesh_Transit_Hubs()
    {
        // Arrange
        await using var context = new VaraKotoDbContext(_options);

        // Act
        await DbInitializer.InitializeAsync(context);

        // Assert
        var hubs = await context.Locations.ToListAsync();
        Assert.Equal(15, hubs.Count);

        var mirpur = hubs.FirstOrDefault(h => h.NameEn == "Mirpur 10");
        Assert.NotNull(mirpur);
        Assert.Equal("মিরপুর ১০", mirpur.NameBn);
        Assert.True(mirpur.Latitude > 23.0m && mirpur.Latitude < 24.0m);
        Assert.True(mirpur.Longitude > 90.0m && mirpur.Longitude < 91.0m);

        var farmgate = hubs.FirstOrDefault(h => h.NameEn == "Farmgate");
        Assert.NotNull(farmgate);
        Assert.Equal("ফার্মগেট", farmgate.NameBn);
        Assert.Equal("Dhaka", farmgate.District);

        var agrabad = hubs.FirstOrDefault(h => h.NameEn == "Agrabad");
        Assert.NotNull(agrabad);
        Assert.Equal("আগ্রাবাদ", agrabad.NameBn);
        Assert.Equal("Chattogram", agrabad.District);
    }

    [Fact]
    public async Task DbInitializer_Is_Idempotent_When_Called_Multiple_Times()
    {
        // Arrange
        await using var context = new VaraKotoDbContext(_options);

        // Act - Call twice
        await DbInitializer.InitializeAsync(context);
        await DbInitializer.InitializeAsync(context);

        // Assert
        var transportCount = await context.TransportTypes.CountAsync();
        var locationCount = await context.Locations.CountAsync();

        Assert.Equal(4, transportCount);
        Assert.Equal(15, locationCount);
    }

    [Fact]
    public async Task FareSubmission_And_RouteCache_Persist_With_Navigation_Properties()
    {
        // Arrange
        await using var context = new VaraKotoDbContext(_options);
        await DbInitializer.InitializeAsync(context);

        var mirpur = await context.Locations.FirstAsync(l => l.NameEn == "Mirpur 10");
        var farmgate = await context.Locations.FirstAsync(l => l.NameEn == "Farmgate");
        var cng = await context.TransportTypes.FirstAsync(t => t.Code == "cng");

        // Act - Add FareSubmission
        var submission = new FareSubmission
        {
            FromLocationId = mirpur.Id,
            ToLocationId = farmgate.Id,
            TransportTypeId = cng.Id,
            ActualFarePaid = 180.00m,
            DistanceKm = 7.50m,
            ModerationStatus = "Approved",
            TravelDate = DateTime.UtcNow
        };
        context.FareSubmissions.Add(submission);

        // Act - Add RouteCache
        var routeCache = new RouteCache
        {
            FromLocationId = mirpur.Id,
            ToLocationId = farmgate.Id,
            DistanceKm = 7.50m,
            EstimatedDurationMinutes = 25.0m
        };
        context.RouteCaches.Add(routeCache);

        await context.SaveChangesAsync();

        // Assert
        var savedSubmission = await context.FareSubmissions
            .Include(s => s.FromLocation)
            .Include(s => s.ToLocation)
            .Include(s => s.TransportType)
            .FirstOrDefaultAsync(s => s.Id == submission.Id);

        Assert.NotNull(savedSubmission);
        Assert.Equal("Mirpur 10", savedSubmission.FromLocation.NameEn);
        Assert.Equal("Farmgate", savedSubmission.ToLocation.NameEn);
        Assert.Equal("cng", savedSubmission.TransportType.Code);
        Assert.Equal(180.00m, savedSubmission.ActualFarePaid);

        var savedRoute = await context.RouteCaches
            .FirstOrDefaultAsync(r => r.FromLocationId == mirpur.Id && r.ToLocationId == farmgate.Id);

        Assert.NotNull(savedRoute);
        Assert.Equal(7.50m, savedRoute.DistanceKm);
    }
}
