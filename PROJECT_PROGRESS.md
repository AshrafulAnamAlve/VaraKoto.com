# VaraKoto.com — Project Progress & Tracking Documentation

*Last Updated: 2026-11-02*

---

## 1. Completed Phases

### ✅ Phase 1: Requirement Specification, Technical Feasibility & Solution Architecture
- **Git & Repository Structure**: Initialized Git repository with clean layout and `.gitignore`.
- **Backend Clean Architecture**:
  - `VaraKoto.slnx` (.NET 10 solution).
  - `src/backend/VaraKoto.Core` (Domain entities, DTOs & interfaces).
  - `src/backend/VaraKoto.Infrastructure` (EF Core 10 & SQL Server configuration).
  - `src/backend/VaraKoto.Api` (ASP.NET Core Web API, controllers, CORS, OpenAPI).
  - `tests/VaraKoto.Api.Tests` (xUnit test project with automated tests).
- **Frontend Scaffolding**:
  - `src/frontend/varakoto-web` (Angular 21 application with standalone components and Vitest).
- **Verification**:
  - `dotnet build`: 0 Errors, 0 Warnings.
  - `dotnet test`: 1 Passed (100%).
  - `npm run build`: Success.
  - `npm test`: 2 Passed (100%).

### ✅ Phase 2: Design System, Brand Identity & UI Components
- **Typography & Font**: Connected Google Font `Baloo Da 2` (weights 500, 600, 700, 800) in `index.html` and configured global SCSS tokens.
- **Color Palette Tokens**: Defined all brand primitive colors (`#0B4F44`, `#E5570A`, `#FFC93C`, `#FFF6E5`, `#17302B`) and semantic variables for Light & Dark mode.
- **ThemeService**: Signals-based reactive theme service supporting `'light' | 'dark'`, `localStorage` persistence, system `prefers-color-scheme` detection, and dynamic `data-theme` document binding.
- **LogoComponent**: Native Angular standalone SVG component recreating `Logo system-html` (Primary, Stacked, Compact, Icon-only) with dynamic light/dark adaptation using Angular 21 `input()` signals.
- **LoadingScreenComponent**: Native Angular standalone component recreating `Loading page-html` with vector skyline, drifting clouds, animated commuter, lightbulb, floating `?`, swinging fare tag, dashed road progress bar, and Bengali status messages.
- **Verification**:
  - `npm test`: 16 passed (100%).
  - `npm run build`: 0 Errors, 0 Warnings.

### ✅ Phase 3: Database Design, EF Core & Backend Foundation
- **Entity Domain Models**:
  - `Location`: `Id`, `NameEn`, `NameBn`, `Latitude`, `Longitude`, `District`, `Thana`, `IsHub`, `CreatedAt`.
  - `TransportType`: `Id`, `Code` (`bus`, `rickshaw`, `cng`, `bike`), `NameEn`, `NameBn`, `IconKey`, `DisplayOrder`, `IsActive`.
  - `FareRule`: `Id`, `TransportTypeId`, `BaseFare`, `BaseDistanceKm`, `PerKmRate`, `MinimumFare`, `EstimatedSpeedKmph`, `HighDemandMultiplier`, `OfficialSourceNote`, `LastUpdated`.
  - `FareSubmission`: `Id`, `TransportTypeId`, `FromLocationId`, `ToLocationId`, `ActualFarePaid`, `DistanceKm`, `TravelDate`, `DeviceHash`, `ModerationStatus`, `SubmittedAt`.
  - `RouteCache`: `Id`, `FromLocationId`, `ToLocationId`, `DistanceKm`, `EstimatedDurationMinutes`, `CachedAt`.
- **EF Core DbContext & Fluent API**:
  - Precision mapping: `(9, 6)` for coordinates, `(10, 2)` for fares and distances.
  - Restricted delete behaviors to prevent cascade cycles on multi-location foreign keys.
  - Compound and single-column indexes on coordinates, search names, and route lookups.
- **Data Seeder (`DbInitializer`)**:
  - Seeded 4 primary Bangladesh transport types (Bus, Rickshaw, CNG, Bike) with accurate BRTA / community baseline rules.
  - Seeded 15 major transit hubs in Dhaka and Chittagong with Bengali and English names and precise geographic coordinates.
- **Database Migrations & Execution**:
  - Generated migration `20261102163955_InitialCreate`.
  - Applied migration to `(localdb)\MSSQLLocalDB` creating the `VaraKotoDb` database.
- **Automated Verification**:
  - Added 4 integration test suites in `tests/VaraKoto.Api.Tests/DatabaseTests.cs` using SQLite in-memory provider.
  - `dotnet test`: **5 / 5 passed (100%)**.

---

### ✅ Phase 4: Location Services, Geocoding & Routing Engine
- **Core Interfaces & DTOs**:
  - `LocationDto`: `Id`, `NameEn`, `NameBn`, `Latitude`, `Longitude`, `District`, `Thana`, `DisplayName`, `Source`.
  - `DistanceResultDto`: `DistanceKm`, `EstimatedDurationMinutes`, `Source` (`CachedRoute`, `OsrmRoutingEngine`, `HaversineFallbackRoadEstimated`), `RoadFactor`.
  - `ILocationService` & `IRouteService` defined in `VaraKoto.Core/Interfaces/`.
- **HybridLocationService**:
  - Direct database matching against seeded Bangladesh hubs with English and Bengali query matching.
  - Memory caching (`IMemoryCache`) for instant repeated queries.
  - Zero-cost Photon geocoding API fallback explicitly bounded to Bangladesh bounding box (`[88.0, 20.5, 92.7, 26.7]`).
  - Reverse geocoding via local database nearest hub lookup (< 500m) or OpenStreetMap Nominatim reverse API.
- **OsrmRouteService**:
  - Checks persistent `RouteCaches` in SQL Server for previous calculations to avoid external network calls.
  - Queries OSRM driving API (`router.project-osrm.org`) for realistic driving road distances and durations.
  - Fallback engine: Haversine great-circle distance scaled by Bangladesh road tortuosity factor ($1.28$) with 25 km/h urban speed estimation when offline or rate-limited.
- **API Controllers**:
  - `LocationsController`: `GET /api/locations/search?q={query}&limit={limit}` and `GET /api/locations/reverse?lat={lat}&lon={lon}`.
  - `RoutesController`: `GET /api/routes/distance?fromLat=...&fromLon=...&toLat=...&toLon=...`.
- **Frontend LocationService & Models**:
  - `LocationModel` & `DistanceResultModel` in `src/app/core/models/location.model.ts`.
  - Signals-based `LocationService` with reactive `currentLocation`, `isDetectingLocation`, browser `navigator.geolocation` integration, debounce search, and error handling.
- **Automated Verification**:
  - Backend: `dotnet test` passed 11 / 11 tests (100%).
  - Frontend: `npm test` passed 21 / 21 tests (100%).
  - Production build: `npm run build` succeeded (raw 255 kB, gzipped 67 kB).

---

## 2. Remaining Phases

- **Phase 5: Transportation Fare Calculation Engine** *(Next)*
- **Phase 6: Core Frontend Homepage – Find Fare Interface**
- **Phase 7: Community Fare Contribution & Verification System**
- **Phase 8: End-to-End Integration, Validation & Anti-Spam Safeguards**
- **Phase 9: Testing, Responsiveness, Performance Optimization & Project Documentation**

---

## 3. Important Technical Decisions

1. **Precision & Scale for Coordinates**:
   - Mapped `decimal(9, 6)` for latitude and longitude in SQL Server, providing sub-meter geographic precision without floating-point inaccuracies.
2. **Restrict Delete Constraints**:
   - Used `DeleteBehavior.Restrict` on `FareSubmissions` and `RouteCaches` location foreign keys to prevent unintended data loss or cascade deletion anomalies.
3. **Idempotent Automatic Database Migrations**:
   - In `DbInitializer.cs`, migration is executed conditionally for SQL Server, allowing unit tests using SQLite in-memory to execute without migration engine conflicts.
4. **Hybrid Geocoding & Routing Strategy**:
   - Prioritizes local Bangladesh transit hubs with 0ms latency and 0 API cost.
   - Bounded external Photon geocoding ensures results stay within Bangladesh.
   - Persistent `RouteCaches` and Haversine $1.28$ road factor provide resilient offline/fallback calculations.

---

## 4. API Integrations
- `GET /api/health` $\rightarrow$ System health, version, timestamp, and environment status.
- `GET /api/locations/search` $\rightarrow$ Autocomplete location search (local hubs + Photon fallback).
- `GET /api/locations/reverse` $\rightarrow$ Reverse geocoding for GPS coordinate resolution.
- `GET /api/routes/distance` $\rightarrow$ Driving distance & duration calculation (Cache + OSRM + Haversine).
- SQL Server `(localdb)\MSSQLLocalDB` connected and verified.

---

## 5. Database Changes
- Database `VaraKotoDb` created on `(localdb)\MSSQLLocalDB`.
- Migration `InitialCreate` executed.
- Seeded initial records for `TransportTypes`, `FareRules`, and `Locations`.
- Added dynamic route persistence in `RouteCaches` during distance queries.

---

## 6. Known Issues / Blockers
- None. All backend and frontend builds and test suites are 100% clean and passing.

---

## 7. Next Recommended Phase
👉 **Phase 5: Transportation Fare Calculation Engine**
- Implement `IFareCalculationService` in `VaraKoto.Core` and `VaraKoto.Infrastructure`.
- Implement specific fare formulas and pricing logic for:
  - **Bus**: BRTA government rate with minimum fare threshold.
  - **Rickshaw**: Short-distance flat rates and realistic negotiated distance ranges.
  - **CNG**: Dual pricing: BRTA official meter rate vs. ground-reality negotiated market range.
  - **Bike**: Base fare + distance rate + duration buffer based on ride-sharing norms.
- Aggregate verified community submissions (`FareSubmissions`) to refine and benchmark fare estimates.
- Expose REST API endpoint: `POST /api/fares/calculate` and comprehensive unit tests.
