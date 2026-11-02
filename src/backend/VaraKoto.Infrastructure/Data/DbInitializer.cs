using Microsoft.EntityFrameworkCore;
using VaraKoto.Core.Entities;

namespace VaraKoto.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(VaraKotoDbContext context)
    {
        // Apply pending migrations automatically on SQL Server
        if (context.Database.IsSqlServer())
        {
            await context.Database.MigrateAsync();
        }

        // Seed Transport Types & Fare Rules if not already present
        if (!await context.TransportTypes.AnyAsync())
        {
            var bus = new TransportType
            {
                Code = "bus",
                NameEn = "Bus",
                NameBn = "বাস",
                IconKey = "directions_bus",
                DisplayOrder = 1,
                IsActive = true,
                FareRule = new FareRule
                {
                    BaseFare = 20.00m,
                    BaseDistanceKm = 5.0m,
                    PerKmRate = 2.50m,
                    MinimumFare = 20.00m,
                    EstimatedSpeedKmph = 15.0m,
                    HighDemandMultiplier = 1.0m,
                    OfficialSourceNote = "BRTA Official Gazette Rate (Dhaka Metro City Bus)",
                    LastUpdated = DateTime.UtcNow
                }
            };

            var rickshaw = new TransportType
            {
                Code = "rickshaw",
                NameEn = "Rickshaw",
                NameBn = "রিকশা",
                IconKey = "pedal_bike",
                DisplayOrder = 2,
                IsActive = true,
                FareRule = new FareRule
                {
                    BaseFare = 30.00m,
                    BaseDistanceKm = 1.0m,
                    PerKmRate = 20.00m,
                    MinimumFare = 25.00m,
                    EstimatedSpeedKmph = 12.0m,
                    HighDemandMultiplier = 1.0m,
                    OfficialSourceNote = "Dhaka Local Community Negotiated Rate",
                    LastUpdated = DateTime.UtcNow
                }
            };

            var cng = new TransportType
            {
                Code = "cng",
                NameEn = "CNG",
                NameBn = "সিএনজি",
                IconKey = "electric_rickshaw",
                DisplayOrder = 3,
                IsActive = true,
                FareRule = new FareRule
                {
                    BaseFare = 40.00m,
                    BaseDistanceKm = 2.0m,
                    PerKmRate = 12.00m,
                    MinimumFare = 40.00m,
                    EstimatedSpeedKmph = 22.0m,
                    HighDemandMultiplier = 1.0m,
                    OfficialSourceNote = "BRTA Meter Base Rate (Ground negotiated fares typically ৳150-৳200 base)",
                    LastUpdated = DateTime.UtcNow
                }
            };

            var bike = new TransportType
            {
                Code = "bike",
                NameEn = "Bike",
                NameBn = "বাইক",
                IconKey = "two_wheeler",
                DisplayOrder = 4,
                IsActive = true,
                FareRule = new FareRule
                {
                    BaseFare = 25.00m,
                    BaseDistanceKm = 1.0m,
                    PerKmRate = 13.00m,
                    MinimumFare = 35.00m,
                    EstimatedSpeedKmph = 25.0m,
                    HighDemandMultiplier = 1.0m,
                    OfficialSourceNote = "Ride-Sharing Standard Estimate (Pathao/Uber Moto)",
                    LastUpdated = DateTime.UtcNow
                }
            };

            context.TransportTypes.AddRange(bus, rickshaw, cng, bike);
            await context.SaveChangesAsync();
        }

        // Seed Transit Hubs if not already present
        if (!await context.Locations.AnyAsync())
        {
            var hubs = new List<Location>
            {
                new() { NameEn = "Mirpur 10", NameBn = "মিরপুর ১০", Latitude = 23.8069m, Longitude = 90.3687m, District = "Dhaka", Thana = "Mirpur", IsHub = true },
                new() { NameEn = "Farmgate", NameBn = "ফার্মগেট", Latitude = 23.7571m, Longitude = 90.3895m, District = "Dhaka", Thana = "Tejgaon", IsHub = true },
                new() { NameEn = "Mohakhali", NameBn = "মহাখালী", Latitude = 23.7778m, Longitude = 90.4054m, District = "Dhaka", Thana = "Mohakhali", IsHub = true },
                new() { NameEn = "Shahbagh", NameBn = "শাহবাগ", Latitude = 23.7381m, Longitude = 90.3957m, District = "Dhaka", Thana = "Shahbagh", IsHub = true },
                new() { NameEn = "Motijheel", NameBn = "মতিঝিল", Latitude = 23.7330m, Longitude = 90.4172m, District = "Dhaka", Thana = "Motijheel", IsHub = true },
                new() { NameEn = "Dhanmondi 27", NameBn = "ধানমন্ডি ২৭", Latitude = 23.7533m, Longitude = 90.3725m, District = "Dhaka", Thana = "Dhanmondi", IsHub = true },
                new() { NameEn = "Uttara Sector 3", NameBn = "উত্তরা সেক্টর ৩", Latitude = 23.8698m, Longitude = 90.3995m, District = "Dhaka", Thana = "Uttara", IsHub = true },
                new() { NameEn = "Banani", NameBn = "বনানী", Latitude = 23.7937m, Longitude = 90.4043m, District = "Dhaka", Thana = "Banani", IsHub = true },
                new() { NameEn = "Gulshan 1", NameBn = "গুলশান ১", Latitude = 23.7785m, Longitude = 90.4178m, District = "Dhaka", Thana = "Gulshan", IsHub = true },
                new() { NameEn = "Jatrabari", NameBn = "যাত্রাবাড়ী", Latitude = 23.7118m, Longitude = 90.4344m, District = "Dhaka", Thana = "Jatrabari", IsHub = true },
                new() { NameEn = "Badda", NameBn = "বাড্ডা", Latitude = 23.7844m, Longitude = 90.4267m, District = "Dhaka", Thana = "Badda", IsHub = true },
                new() { NameEn = "Gabtoli", NameBn = "গাবতলী", Latitude = 23.7820m, Longitude = 90.3475m, District = "Dhaka", Thana = "Mirpur", IsHub = true },
                new() { NameEn = "Sayedabad", NameBn = "সায়েদাবাদ", Latitude = 23.7176m, Longitude = 90.4287m, District = "Dhaka", Thana = "Sayedabad", IsHub = true },
                new() { NameEn = "Agrabad", NameBn = "আগ্রাবাদ", Latitude = 22.3275m, Longitude = 91.8123m, District = "Chattogram", Thana = "Double Mooring", IsHub = true },
                new() { NameEn = "GEC Circle", NameBn = "জিইসি মোড়", Latitude = 22.3587m, Longitude = 91.8215m, District = "Chattogram", Thana = "Khulshi", IsHub = true }
            };

            context.Locations.AddRange(hubs);
            await context.SaveChangesAsync();
        }

        // Seed Default Admin User if not exists
        if (!await context.AdminUsers.AnyAsync(u => u.Username == "admin"))
        {
            var (hash, salt) = VaraKoto.Infrastructure.Security.PasswordSecurityHelper.HashPassword("Admin@123");
            var admin = new AdminUser
            {
                Username = "admin",
                PasswordHash = hash,
                Salt = salt,
                DisplayName = "VaraKoto Admin",
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.AdminUsers.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}
