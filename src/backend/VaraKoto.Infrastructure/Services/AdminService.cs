using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VaraKoto.Core.DTOs;
using VaraKoto.Core.Entities;
using VaraKoto.Core.Interfaces;
using VaraKoto.Infrastructure.Data;
using VaraKoto.Infrastructure.Security;

namespace VaraKoto.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly VaraKotoDbContext _context;
    private readonly ILogger<AdminService> _logger;

    public AdminService(VaraKotoDbContext context, ILogger<AdminService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<AdminLoginResponseDto> LoginAsync(AdminLoginRequestDto request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            throw new ArgumentException("ব্যবহারকারী নাম এবং পাসওয়ার্ড প্রদান করুন।");
        }

        var admin = await _context.AdminUsers
            .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive, cancellationToken);

        if (admin == null || !PasswordSecurityHelper.VerifyPassword(request.Password, admin.PasswordHash, admin.Salt))
        {
            throw new UnauthorizedAccessException("ভুল ব্যবহারকারী নাম অথবা পাসওয়ার্ড।");
        }

        admin.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        // Generate secure session token (HMAC-based)
        var token = GenerateToken(admin.Username, admin.Id);

        return new AdminLoginResponseDto
        {
            Token = token,
            Username = admin.Username,
            DisplayName = admin.DisplayName,
            Role = admin.Role,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };
    }

    public async Task<AdminStatsDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        var pending = await _context.FareSubmissions.CountAsync(s => s.ModerationStatus == "Pending", cancellationToken);
        var approved = await _context.FareSubmissions.CountAsync(s => s.ModerationStatus == "Approved", cancellationToken);
        var flagged = await _context.FareSubmissions.CountAsync(s => s.ModerationStatus == "Flagged", cancellationToken);
        var rejected = await _context.FareSubmissions.CountAsync(s => s.ModerationStatus == "Rejected", cancellationToken);
        var total = await _context.FareSubmissions.CountAsync(cancellationToken);

        return new AdminStatsDto
        {
            TotalPending = pending,
            TotalApproved = approved,
            TotalFlagged = flagged,
            TotalRejected = rejected,
            TotalSubmissions = total
        };
    }

    public async Task<IReadOnlyList<AdminSubmissionDto>> GetSubmissionsAsync(
        string? status = null, 
        int page = 1, 
        int pageSize = 50, 
        CancellationToken cancellationToken = default)
    {
        var query = _context.FareSubmissions
            .Include(s => s.TransportType)
            .Include(s => s.FromLocation)
            .Include(s => s.ToLocation)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(s => s.ModerationStatus == status);
        }

        var submissions = await query
            .OrderByDescending(s => s.SubmittedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var now = DateTime.UtcNow;

        return submissions.Select(s =>
        {
            var standard = s.CalculatedStandardFare ?? s.ActualFarePaid;
            var diffAmount = s.ActualFarePaid - standard;
            var diffPercent = standard > 0 ? (diffAmount / standard) * 100m : 0m;

            return new AdminSubmissionDto
            {
                Id = s.Id,
                FromLocationName = s.FromLocation.NameBn ?? s.FromLocation.NameEn,
                ToLocationName = s.ToLocation.NameBn ?? s.ToLocation.NameEn,
                TransportCode = s.TransportType.Code,
                TransportNameBn = s.TransportType.NameBn,
                UserSubmittedFare = s.ActualFarePaid,
                DatabaseStandardFare = s.CalculatedStandardFare,
                DifferenceAmount = Math.Round(diffAmount, 2),
                DifferencePercentage = Math.Round(diffPercent, 1),
                DistanceKm = s.DistanceKm,
                ModerationStatus = s.ModerationStatus,
                DeviceHash = s.DeviceHash,
                AdminNote = s.AdminNote,
                SubmittedAt = s.SubmittedAt,
                ReviewedAt = s.ReviewedAt,
                TimeAgoBn = FormatRelativeTimeBn(now - s.SubmittedAt)
            };
        }).ToList();
    }

    public async Task<AdminSubmissionDto> ApproveSubmissionAsync(
        int id, 
        AdminReviewRequestDto? request = null, 
        CancellationToken cancellationToken = default)
    {
        var submission = await _context.FareSubmissions
            .Include(s => s.TransportType)
            .Include(s => s.FromLocation)
            .Include(s => s.ToLocation)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (submission == null)
        {
            throw new KeyNotFoundException($"ভাড়া সাবমিশন আইডি {id} খুঁজে পাওয়া যায়নি।");
        }

        submission.ModerationStatus = "Approved";
        submission.ReviewedAt = DateTime.UtcNow;

        if (request?.AdjustedFare.HasValue == true && request.AdjustedFare.Value > 0)
        {
            submission.ActualFarePaid = request.AdjustedFare.Value;
        }

        if (!string.IsNullOrWhiteSpace(request?.AdminNote))
        {
            submission.AdminNote = request.AdminNote;
        }

        await _context.SaveChangesAsync(cancellationToken);

        var standard = submission.CalculatedStandardFare ?? submission.ActualFarePaid;
        var diffAmount = submission.ActualFarePaid - standard;
        var diffPercent = standard > 0 ? (diffAmount / standard) * 100m : 0m;

        return new AdminSubmissionDto
        {
            Id = submission.Id,
            FromLocationName = submission.FromLocation.NameBn ?? submission.FromLocation.NameEn,
            ToLocationName = submission.ToLocation.NameBn ?? submission.ToLocation.NameEn,
            TransportCode = submission.TransportType.Code,
            TransportNameBn = submission.TransportType.NameBn,
            UserSubmittedFare = submission.ActualFarePaid,
            DatabaseStandardFare = submission.CalculatedStandardFare,
            DifferenceAmount = Math.Round(diffAmount, 2),
            DifferencePercentage = Math.Round(diffPercent, 1),
            DistanceKm = submission.DistanceKm,
            ModerationStatus = submission.ModerationStatus,
            DeviceHash = submission.DeviceHash,
            AdminNote = submission.AdminNote,
            SubmittedAt = submission.SubmittedAt,
            ReviewedAt = submission.ReviewedAt,
            TimeAgoBn = FormatRelativeTimeBn(DateTime.UtcNow - submission.SubmittedAt)
        };
    }

    public async Task<AdminSubmissionDto> RejectSubmissionAsync(
        int id, 
        AdminReviewRequestDto? request = null, 
        CancellationToken cancellationToken = default)
    {
        var submission = await _context.FareSubmissions
            .Include(s => s.TransportType)
            .Include(s => s.FromLocation)
            .Include(s => s.ToLocation)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (submission == null)
        {
            throw new KeyNotFoundException($"ভাড়া সাবমিশন আইডি {id} খুঁজে পাওয়া যায়নি।");
        }

        submission.ModerationStatus = "Rejected";
        submission.ReviewedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(request?.AdminNote))
        {
            submission.AdminNote = request.AdminNote;
        }

        await _context.SaveChangesAsync(cancellationToken);

        var standard = submission.CalculatedStandardFare ?? submission.ActualFarePaid;

        return new AdminSubmissionDto
        {
            Id = submission.Id,
            FromLocationName = submission.FromLocation.NameBn ?? submission.FromLocation.NameEn,
            ToLocationName = submission.ToLocation.NameBn ?? submission.ToLocation.NameEn,
            TransportCode = submission.TransportType.Code,
            TransportNameBn = submission.TransportType.NameBn,
            UserSubmittedFare = submission.ActualFarePaid,
            DatabaseStandardFare = submission.CalculatedStandardFare,
            DifferenceAmount = submission.ActualFarePaid - standard,
            DifferencePercentage = standard > 0 ? ((submission.ActualFarePaid - standard) / standard) * 100m : 0m,
            DistanceKm = submission.DistanceKm,
            ModerationStatus = submission.ModerationStatus,
            DeviceHash = submission.DeviceHash,
            AdminNote = submission.AdminNote,
            SubmittedAt = submission.SubmittedAt,
            ReviewedAt = submission.ReviewedAt,
            TimeAgoBn = FormatRelativeTimeBn(DateTime.UtcNow - submission.SubmittedAt)
        };
    }

    public async Task<bool> DeleteSubmissionAsync(int id, CancellationToken cancellationToken = default)
    {
        var submission = await _context.FareSubmissions.FindAsync([id], cancellationToken);
        if (submission == null)
        {
            return false;
        }

        _context.FareSubmissions.Remove(submission);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static string GenerateToken(string username, int adminId)
    {
        var payload = $"{adminId}:{username}:{DateTime.UtcNow.Ticks}";
        var key = Encoding.UTF8.GetBytes("VaraKoto_Admin_SecretKey_Secure_2026_BanglaTrans");
        using var hmac = new HMACSHA256(key);
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(payload)) + "." + Convert.ToBase64String(hash);
    }

    private static string FormatRelativeTimeBn(TimeSpan elapsed)
    {
        if (elapsed.TotalMinutes < 1)
            return "এইমাত্র";
        if (elapsed.TotalMinutes < 60)
            return $"{ToBengaliDigits((int)elapsed.TotalMinutes)} মিনিট আগে";
        if (elapsed.TotalHours < 24)
            return $"{ToBengaliDigits((int)elapsed.TotalHours)} ঘণ্টা আগে";
        if (elapsed.TotalDays < 30)
            return $"{ToBengaliDigits((int)elapsed.TotalDays)} দিন আগে";

        return $"{ToBengaliDigits((int)(elapsed.TotalDays / 30))} মাস আগে";
    }

    private static string ToBengaliDigits(int number)
    {
        var banglaDigits = new[] { '০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯' };
        var s = number.ToString();
        var sb = new StringBuilder(s.Length);
        foreach (var c in s)
        {
            if (c >= '0' && c <= '9')
                sb.Append(banglaDigits[c - '0']);
            else
                sb.Append(c);
        }
        return sb.ToString();
    }
}
