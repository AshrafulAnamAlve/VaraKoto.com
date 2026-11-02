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

### ✅ Phase 5: Transportation Fare Calculation Engine
- **BengaliNumberHelper**:
  - Full conversion of numerals to Bengali digits (`0-9` $\rightarrow$ `০-৯`) for culturally authentic fare presentation (e.g. `৳৫০ - ৳৭০`).
- **Core Interfaces & DTOs**:
  - `FareCalculationRequestDto`: Origin/Destination IDs or coordinates, transport code selection, and full breakdown toggle.
  - `FareBreakdownDto`: Per-transport calculation, minimum/maximum range, exact fares, official meter comparison, reliability indicators, and distance constraints.
  - `FareCalculationResultDto`: Complete fare response packaging origin, destination, road distance, travel duration, primary fare, and all transport options.
  - `IFareCalculationService` defined in `VaraKoto.Core/Interfaces/`.
- **Fare Calculation Engine Implementation (`FareCalculationService`)**:
  - **Bus Engine**: BRTA official gazette formula (first 5 km = minimum fare ৳20, excess distance = ৳2.50/km, rounded to ৳5 bus ticket slabs) + seating/direct service variation range.
  - **Rickshaw Engine**: Local Dhaka negotiated rates (short hop ৳25–৳35, incremental distance rates, ৳5 rounding). Automatic distance feasibility notice for trips > 7 km (fatigue/VIP road restrictions).
  - **CNG Dual Display Engine**:
    - **Official BRTA Meter**: Minimum ৳40 (first 2 km) + ৳12/km + traffic waiting charge (৳2/min) rounded to ৳5.
    - **Ground Reality Negotiated Contract**: Dhaka street reality formula (base ৳120–৳160, distance scaling) rounded to ৳10.
    - Transparent dual disclosure protecting commuters from unrealistic meter expectations.
  - **Bike Engine**: Ride-sharing baseline model (Pathao/Uber Moto rates: base ৳25, per-km ৳12–৳14.50, per-minute traffic buffer, minimum ৳35).
  - **Community Submission Aggregation**: Integrates approved community submissions (`FareSubmissions`) on identical or nearby routes ($\pm 0.8\text{ km}$), calculating average fares and elevating reliability to `"CommunityBacked"` (5 stars).
- **API Endpoints (`FaresController`)**:
  - `POST /api/fares/calculate`: Comprehensive fare calculation endpoint.
  - `GET /api/fares/estimate-for-distance`: Quick distance-based fare preview.
  - `GET /api/fares/transports`: Active transport types and rule configuration.
- **Frontend FareService (Angular 21)**:
  - Signals-based reactive state (`selectedTransport`, `latestResult`, `isCalculating`, `calculationError`, `transportTypes`).
  - Active transport switching with live primary fare update.
  - Bengali digit formatting helper (`toBengaliDigits`).
- **Automated Verification**:
  - Backend: `dotnet test` passed **19 / 19 tests (100%)**.
  - Frontend: `npm test` passed **28 / 28 tests (100%)**.
  - Production build: `npm run build` succeeded (raw 255 kB, gzipped 67 kB).

---

## 2. Remaining Phases

- **Phase 6: Core Frontend Homepage – Find Fare Interface** *(Next)*
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
5. **Dual Fare Presentation for CNG & Clear Transparency**:
   - Explicitly displays ground-negotiated contract reality alongside official BRTA meter rate so commuters are never misled.
   - Clear reliability labeling: "Official", "Estimated", and "CommunityBacked".

---

## 4. API Integrations
- `GET /api/health` $\rightarrow$ System health, version, timestamp, and environment status.
- `GET /api/locations/search` $\rightarrow$ Autocomplete location search (local hubs + Photon fallback).
- `GET /api/locations/reverse` $\rightarrow$ Reverse geocoding for GPS coordinate resolution.
- `GET /api/routes/distance` $\rightarrow$ Driving distance & duration calculation (Cache + OSRM + Haversine).
- `POST /api/fares/calculate` $\rightarrow$ Full multi-transport fare calculation engine.
- `GET /api/fares/estimate-for-distance` $\rightarrow$ Quick distance-based fare preview.
- `GET /api/fares/transports` $\rightarrow$ Active transport types and rule configuration.
- SQL Server `(localdb)\MSSQLLocalDB` connected and verified.

---

## 5. Database Changes
- Database `VaraKotoDb` created on `(localdb)\MSSQLLocalDB`.
- Migration `InitialCreate` executed.
- Seeded initial records for `TransportTypes`, `FareRules`, and `Locations`.
- Dynamic integration with `FareSubmissions` for verified community benchmark elevation.

---

## 6. Known Issues / Blockers
- None. All backend and frontend builds and test suites are 100% clean and passing.

---

## 7. Next Recommended Phase
👉 **Phase 6: Core Frontend Homepage – Find Fare Interface**
- Create the intuitive, distraction-free homepage where users discover fares in seconds:
  - Starting location input with polite browser auto-detect button and dropdown autocomplete.
  - Destination location input with quick suggestion dropdown.
  - Location swap button (🔄) for instant reverse direction.
  - Transport selector bar with custom SVG icons (Bus, Rickshaw, CNG, Bike).
  - High-visibility "ভাড়া দেখুন" (Find Fare) primary action button.
- Fare Result Card display:
  - Large, bold `Baloo Da 2` typography for the estimated fare / range.
  - Distance & travel time pills.
  - Reliability badge and source notes.
  - Quick transport comparison drawer/pills.
  - Integration with `LoadingScreenComponent` during calculation.
