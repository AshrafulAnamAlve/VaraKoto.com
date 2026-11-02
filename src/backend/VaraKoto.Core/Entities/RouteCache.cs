namespace VaraKoto.Core.Entities;

public class RouteCache
{
    public int Id { get; set; }

    public int FromLocationId { get; set; }
    public Location FromLocation { get; set; } = null!;

    public int ToLocationId { get; set; }
    public Location ToLocation { get; set; } = null!;

    public decimal DistanceKm { get; set; }
    public decimal EstimatedDurationMinutes { get; set; }
    public DateTime CachedAt { get; set; } = DateTime.UtcNow;
}
