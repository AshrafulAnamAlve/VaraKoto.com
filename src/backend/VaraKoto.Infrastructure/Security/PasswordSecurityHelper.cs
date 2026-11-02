using System.Security.Cryptography;
using System.Text;

namespace VaraKoto.Infrastructure.Security;

public static class PasswordSecurityHelper
{
    public static (string Hash, string Salt) HashPassword(string password)
    {
        byte[] saltBytes = RandomNumberGenerator.GetBytes(16);
        string salt = Convert.ToBase64String(saltBytes);
        string hash = ComputeHash(password, salt);
        return (hash, salt);
    }

    public static bool VerifyPassword(string password, string hash, string salt)
    {
        string computed = ComputeHash(password, salt);
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(computed),
            Encoding.UTF8.GetBytes(hash));
    }

    private static string ComputeHash(string password, string salt)
    {
        using var sha = SHA256.Create();
        byte[] combined = Encoding.UTF8.GetBytes(password + ":" + salt + ":VaraKoto_Admin_2026");
        byte[] hash = sha.ComputeHash(combined);
        return Convert.ToBase64String(hash);
    }
}
