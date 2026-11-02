using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using VaraKoto.Core.Entities;

namespace VaraKoto.Infrastructure.Data;

public class VaraKotoDbContext : DbContext
{
    public VaraKotoDbContext(DbContextOptions<VaraKotoDbContext> options) : base(options)
    {
    }

    public DbSet<Location> Locations => Set<Location>();
    public DbSet<TransportType> TransportTypes => Set<TransportType>();
    public DbSet<FareRule> FareRules => Set<FareRule>();
    public DbSet<FareSubmission> FareSubmissions => Set<FareSubmission>();
    public DbSet<RouteCache> RouteCaches => Set<RouteCache>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Location Configuration
        modelBuilder.Entity<Location>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.NameEn).IsRequired().HasMaxLength(150);
            entity.Property(e => e.NameBn).IsRequired().HasMaxLength(150);
            entity.Property(e => e.District).HasMaxLength(80);
            entity.Property(e => e.Thana).HasMaxLength(80);
            entity.Property(e => e.Latitude).HasPrecision(9, 6);
            entity.Property(e => e.Longitude).HasPrecision(9, 6);

            entity.HasIndex(e => e.NameEn);
            entity.HasIndex(e => e.NameBn);
            entity.HasIndex(e => new { e.Latitude, e.Longitude });
        });

        // TransportType Configuration
        modelBuilder.Entity<TransportType>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.NameEn).IsRequired().HasMaxLength(50);
            entity.Property(e => e.NameBn).IsRequired().HasMaxLength(50);
            entity.Property(e => e.IconKey).IsRequired().HasMaxLength(100);

            entity.HasIndex(e => e.Code).IsUnique();

            entity.HasOne(e => e.FareRule)
                .WithOne(r => r.TransportType)
                .HasForeignKey<FareRule>(r => r.TransportTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // FareRule Configuration
        modelBuilder.Entity<FareRule>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.BaseFare).HasPrecision(10, 2);
            entity.Property(e => e.BaseDistanceKm).HasPrecision(10, 2);
            entity.Property(e => e.PerKmRate).HasPrecision(10, 2);
            entity.Property(e => e.MinimumFare).HasPrecision(10, 2);
            entity.Property(e => e.EstimatedSpeedKmph).HasPrecision(10, 2);
            entity.Property(e => e.HighDemandMultiplier).HasPrecision(5, 2);
            entity.Property(e => e.OfficialSourceNote).HasMaxLength(250);
        });

        // FareSubmission Configuration
        modelBuilder.Entity<FareSubmission>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ActualFarePaid).HasPrecision(10, 2);
            entity.Property(e => e.DistanceKm).HasPrecision(10, 2);
            entity.Property(e => e.DeviceHash).HasMaxLength(64);
            entity.Property(e => e.ModerationStatus).IsRequired().HasMaxLength(30);

            entity.HasOne(e => e.TransportType)
                .WithMany(t => t.Submissions)
                .HasForeignKey(e => e.TransportTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.FromLocation)
                .WithMany(l => l.OutgoingSubmissions)
                .HasForeignKey(e => e.FromLocationId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ToLocation)
                .WithMany(l => l.IncomingSubmissions)
                .HasForeignKey(e => e.ToLocationId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new { e.FromLocationId, e.ToLocationId, e.TransportTypeId });
            entity.HasIndex(e => e.SubmittedAt);
        });

        // RouteCache Configuration
        modelBuilder.Entity<RouteCache>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DistanceKm).HasPrecision(10, 2);
            entity.Property(e => e.EstimatedDurationMinutes).HasPrecision(10, 2);

            entity.HasOne(e => e.FromLocation)
                .WithMany(l => l.OutgoingRoutes)
                .HasForeignKey(e => e.FromLocationId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ToLocation)
                .WithMany(l => l.IncomingRoutes)
                .HasForeignKey(e => e.ToLocationId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new { e.FromLocationId, e.ToLocationId }).IsUnique();
        });
    }
}
