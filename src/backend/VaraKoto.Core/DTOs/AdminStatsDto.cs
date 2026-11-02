namespace VaraKoto.Core.DTOs;

public class AdminStatsDto
{
    public int TotalPending { get; set; }
    public int TotalApproved { get; set; }
    public int TotalFlagged { get; set; }
    public int TotalRejected { get; set; }
    public int TotalSubmissions { get; set; }
}
