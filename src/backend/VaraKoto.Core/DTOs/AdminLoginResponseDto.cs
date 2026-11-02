namespace VaraKoto.Core.DTOs;

public class AdminLoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Role { get; set; } = "Admin";
    public DateTime ExpiresAt { get; set; }
}
