# VaraKoto.com (গাড়ি ভাড়া কত?)

> **Simple, distraction-free transportation fare finder for Bangladesh.**
> Discover accurate, transparent, and fair fares for Buses, Rickshaws, CNG Auto-rickshaws, and Motorbikes across any route.

---

### 🌐 Live Deployment Links
- 🚀 **Live Web Application (GitHub Pages)**: [https://ashrafulanamalve.github.io/VaraKoto.com/](https://ashrafulanamalve.github.io/VaraKoto.com/)
- 🛡️ **Live Admin Dashboard**: [https://ashrafulanamalve.github.io/VaraKoto.com/admin](https://ashrafulanamalve.github.io/VaraKoto.com/admin)
- ⚡ **Live Production Backend API (RunASP.NET / MonsterASP)**: [https://varakoto.runasp.net/api/health](https://varakoto.runasp.net/api/health)
- 🗄️ **Live Cloud Database (MSSQL)**: `db77540.databaseasp.net` (Hosted datacenter)

---

## 🌟 Overview

Navigating daily transport in Bangladesh often involves arbitrary pricing, lack of transparent fare metrics, and confusing street bargaining. **VaraKoto.com** solves this by delivering an ultra-fast, mobile-first, distraction-free web platform where commuters instantly discover standard and verified fares with zero sign-up friction.

### Key Highlights
- **4 Transport Modes Supported**: Bus (বাস), Rickshaw (রিকশা), CNG Auto-rickshaw (সিএনজি), and Bike Ride-sharing (বাইক).
- **CNG Dual Display**: Shows official BRTA meter rates alongside ground-reality negotiated contract ranges, preventing unrealistic expectations.
- **Community Fare Contribution**: Commuters share real fares paid; an automated moderation engine filters outliers before admin approval.
- **Full Admin Moderation Dashboard (`/admin`)**: Side-by-side comparison between user-reported fares and database standard calculations with 1-click Approve/Reject.
- **GPS Auto-Detection**: One-tap current location discovery with reverse-geocoding into clean landmark names.
- **Bengali-First & Authentic Typography**: Styled with Google's `Baloo Da 2` font, localized Bengali numerals (`০-৯`), and cultural terminology.
- **Full Theme Support**: High-contrast Light Mode (`#FFF6E5`) and Dark Mode (`#07221E` / `#0B3831`) with WCAG AAA accessibility.

---

## 🏗️ Architecture & Tech Stack

```mermaid
flowchart TD
    subgraph Client["Frontend: Angular 21 (SPA)"]
        UI["Minimalist Mobile-First UI\n(Standalone Components)"]
        State["Reactive State\n(Signals & Computed)"]
        Interceptors["Error Interceptor &\nNotification Toast Bus"]
    end

    subgraph API["Backend: ASP.NET Core Web API (.NET 10)"]
        Middleware["Centralized Exception Middleware\n& IP Rate Limiter"]
        Controllers["REST Controllers\n(Fares, Locations, Admin)"]
        Services["Domain Services\n(FareEngine, HybridGeocoding, Moderation)"]
    end

    subgraph DataTier["Data & External Services"]
        LocalDb[("SQL Server LocalDB\nVaraKotoDb")]
        Photon["Photon Geocoding API\n(BD Bounding Box)"]
        OSRM["OSRM Routing Engine\n(Driving Distance & Duration)"]
        Haversine["Haversine Fallback Engine\n(1.28 BD Road Factor)"]
    end

    UI -->|HTTP / JSON| Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> LocalDb
    Services --> Photon
    Services --> OSRM
    OSRM -.->|Fallback if offline| Haversine
```

### Technology Matrix
| Layer | Technologies |
|---|---|
| **Frontend** | Angular 21 (Standalone Components, Signals, SCSS, Vitest) |
| **Backend** | ASP.NET Core Web API (.NET 10, C# 13, EF Core 10) |
| **Database** | Microsoft SQL Server LocalDB (`VaraKotoDb`) |
| **Routing & Geocoding** | Hybrid Engine (SQL Transit Hubs + Photon Geocoding + OSRM Driving + Haversine 1.28) |
| **Security & Quality** | IP Rate Limiter, InputSanitizer (XSS Stripper), PBKDF2 Password Hashing, Centralized RFC Middleware |

---

## 🚀 Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/)
- [Node.js (v20+ or v22 LTS)](https://nodejs.org/) & `npm`
- [SQL Server LocalDB](https://learn.microsoft.com/sql/database-engine/configure-windows/sql-server-express-localdb) (comes standard with Visual Studio or SQL Server Express)

---

### 1. Backend Setup & Run

1. Navigate to the backend directory:
   ```powershell
   cd src/backend/VaraKoto.Api
   ```
2. Restore dependencies and verify database connection:
   ```powershell
   dotnet restore
   ```
3. Run the API (Database migrations and seed data apply automatically on startup):
   ```powershell
   dotnet run --urls "http://localhost:5293"
   ```
4. Verify backend health:
   - Endpoint: [http://localhost:5293/api/health](http://localhost:5293/api/health)
   - OpenAPI Specification: [http://localhost:5293/openapi/v1.json](http://localhost:5293/openapi/v1.json)

---

### 2. Frontend Setup & Run

1. Navigate to the frontend directory:
   ```powershell
   cd src/frontend/varakoto-web
   ```
2. Install npm packages:
   ```powershell
   npm install
   ```
3. Start development server on port **4250**:
   ```powershell
   npx ng serve --port 4250
   ```
4. Open your browser:
   - Commuter Portal: [http://localhost:4250/](http://localhost:4250/)
   - Admin Panel: [http://localhost:4250/admin](http://localhost:4250/admin)

---

## 🛡️ Admin Panel & Credentials

The system features an integrated moderation portal where admin reviewers inspect community fare contributions before publishing them publicly.

- **URL**: [http://localhost:4250/admin](http://localhost:4250/admin)
- **Default Username**: `admin`
- **Default Password**: `Admin@123`

### Moderation Features:
- **Side-by-Side Comparison**: Contrasts user-submitted fare against the database standard route calculation.
- **Deviation Percentage Pill**: Displays variance (e.g. `+৳70 (+25%)` or `-৳30 (-15%)`).
- **One-Click Actions**:
  - `✓ অনুমোদন (Approve)`: Marks fare approved and immediately elevates public route reliability.
  - `✕ বাতিল (Reject)`: Discards submission with optional admin review notes.
  - `🗑️ মুছুন (Delete)`: Permanently purges spam entries.
- **KPI Metrics Grid**: Live counters for Total, Pending, Approved, and Flagged submissions.

---

## 📡 API Reference

### Health & Master Data
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status, environment, and timestamp |
| `GET` | `/api/fares/transports` | Active transport types, icons, and official fare rules |

### Location & Routing
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/locations/search?q={query}&limit={limit}` | Autocomplete search for transit hubs and landmarks |
| `GET` | `/api/locations/reverse?lat={lat}&lon={lon}` | GPS coordinate reverse-geocoding |
| `GET` | `/api/routes/distance?fromLat=...&fromLon=...&toLat=...&toLon=...` | Road distance and duration calculation |

### Fare Calculation & Community Contributions
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/fares/calculate` | Complete multi-transport fare calculation engine |
| `GET` | `/api/fares/estimate-for-distance?distanceKm={km}` | Quick distance-based fare preview |
| `POST` | `/api/fares/contribute` | Commuter fare submission with anti-spam check |
| `GET` | `/api/fares/recent-contributions?limit=6` | Public feed of approved recent fares |

### Admin Endpoints (Protected by Rate Limiter)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Authenticate admin user with username & password |
| `GET` | `/api/admin/stats` | KPI summary statistics |
| `GET` | `/api/admin/submissions?status={Pending\|Approved\|...}` | Moderation queue with side-by-side comparisons |
| `POST` | `/api/admin/submissions/{id}/approve` | Approve commuter submission |
| `POST` | `/api/admin/submissions/{id}/reject` | Reject commuter submission |
| `DELETE` | `/api/admin/submissions/{id}` | Delete submission record |

---

## 🧪 Testing & Quality Assurance

Both the backend and frontend include 100% automated test coverage across domain logic, security middleware, and reactive UI components.

### Backend Tests (xUnit)
```powershell
dotnet test
```
* **41 / 41 Tests Passing (100%)**
  * `CalculationEngineTests`: BRTA bus slabs, Rickshaw tiered pricing, CNG dual meter/market rates, Bike formulas.
  * `DatabaseTests`: SQLite in-memory integration, transit hub seeding, coordinate precision.
  * `FareContributionTests`: Outlier deviation formulas, vehicle fare ceilings, rate limiting.
  * `AdminTests`: Authentication, PBKDF2 hashing, moderation approval/rejection workflows.
  * `SecurityAndMiddlewareTests`: Centralized error middleware, XSS input sanitizer, IP rate limiter.

### Frontend Tests (Vitest)
```powershell
npm --prefix src/frontend/varakoto-web test -- --watch=false
```
* **76 / 76 Tests Passing across 15 Suites (100%)**
  * Unit tests for standalone components, signals-based services, interceptors, and modal dialogs.

### Production Build Verification
```powershell
npm --prefix src/frontend/varakoto-web run build
```
* **0 Errors, 0 Warnings**
* Initial transfer size: **~97 kB** (Ultra-fast 3G load time < 1.2s).

---

## 📝 License & Attribution

Designed and developed for the daily commuters of Bangladesh.  
Crafted with authentic `Baloo Da 2` typography and native SVG vector graphics.
