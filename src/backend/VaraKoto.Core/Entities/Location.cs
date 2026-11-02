namespace VaraKoto.Core.Entities;

public class Location
{
    public int Id { get; set; }
    public string NameEn { get; set; } = string.Empty;
    public string NameBn { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? District { get; set; }
    public string? Thana { get; set; }
    public bool IsHub { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<FareSubmission> OutgoingSubmissions { get; set; } = new List<FareSubmission>();
    public ICollection<FareSubmission> IncomingSubmissions { get; set; } = new List<FareSubmission>();
    public ICollection<RouteCache> OutgoingRoutes { get; set; } = new List<RouteCache>();
    public ICollection<RouteCache> IncomingRoutes { get; set; } = new List<RouteCache>();
}
