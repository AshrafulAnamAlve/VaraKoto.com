namespace VaraKoto.Core.Entities;

public class TransportType
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty; // bus, rickshaw, cng, bike
    public string NameEn { get; set; } = string.Empty;
    public string NameBn { get; set; } = string.Empty;
    public string IconKey { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public FareRule? FareRule { get; set; }
    public ICollection<FareSubmission> Submissions { get; set; } = new List<FareSubmission>();
}
