namespace VaraKoto.Core.DTOs;

public class LocationDto
{
    public int? Id { get; set; }
    public string NameEn { get; set; } = string.Empty;
    public string NameBn { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? District { get; set; }
    public string? Thana { get; set; }
    public bool IsHub { get; set; }
    public string Source { get; set; } = "Database"; // Database, Geocoding
}
