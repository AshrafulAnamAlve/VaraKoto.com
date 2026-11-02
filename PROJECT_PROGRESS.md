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

### ✅ Phase 6: Core Frontend Homepage – Find Fare Interface
- **FareFinderCardComponent** (`src/app/features/fare-finder/components/fare-finder-card`):
  - Mobile-first, card layout matching brand colors (`--vk-green`, `--vk-orange`, `--vk-cream`, `--vk-slate`).
  - Starting Location input: Browser GPS auto-detection with spinning loader, debounced autocomplete search, hub badges, and clear button.
  - Route Direction Swap Button (🔄): Smooth rotational animation, swapping coordinates, labels, and auto-recalculating.
  - Destination Location input: Search autocomplete with instant suggestions and clear button.
  - Transport Selector: Custom SVG icons for 4 modes (Bus, Rickshaw, CNG, Bike) with distinct selected state.
  - Primary CTA "ভাড়া দেখুন" button with disabled validation guard and loading indicator.
- **FareResultCardComponent** (`src/app/features/fare-finder/components/fare-result-card`):
  - Route Summary Header with origin $\rightarrow$ destination and metric pills (distance in km and travel duration in minutes formatted in Bengali digits).
  - Fare Hero Card: Large, bold `Baloo Da 2` typography for the estimated fare / range.
  - CNG Dual Display: Highlights street negotiated market reality (`৳২৫০ - ৳৩৪০`) alongside the official BRTA meter rate (`~৳১১০`).
  - Feasibility Warning: Distance alert for long rickshaw journeys (> 7 km).
  - Reliability Badge: "বিআরটিএ সরকারি রেট" (Official, 5 stars, Green), "কমিউনিটি যাচাইকৃত" (Community, 5 stars, Orange), or "সাধারণ আনুমানিক" (Teal).
  - Interactive Transport Comparison Bar: Tap between all active vehicle estimates with a single tap without re-querying the server.
  - Action CTAs: "রুট পরিবর্তন করুন" (Modify search) and "আপনি কত ভাড়া দিয়েছিলেন?" (Share actual fare paid).
- **HomePageComponent** (`src/app/features/fare-finder/pages/home-page`):
  - Sticky minimalist header with `LogoComponent` and theme switch button (Sun/Moon).
  - Seamless state switching between Finder and Result cards.
  - Integration with `LoadingScreenComponent` showing the complete SVG cartoon commuter animation during fare calculations.
  - Minimalist footer with brand tagline.
- **App Routing & Architecture**:
  - `app.routes.ts` configured with `HomePageComponent` as the default route.
  - `environment.ts` added with standardized API base URL (`http://localhost:5293/api`).
- **Automated Verification**:
  - Backend: `dotnet test` passed **19 / 19 tests (100%)**.
  - Frontend: `npm test` passed **50 / 50 tests across 9 test suites (100%)**.
  - Production build: `npm run build` succeeded (0 errors, 0 warnings, transfer size: 84 kB).

---

### ✅ Phase 7: Community Fare Contribution & Verification System
- **Backend Architecture & Moderation Engine (`IFareContributionService` & `FareContributionService`)**:
  - **Sanity Validation & Vehicle Ceilings**:
    - Minimum submission floor: ৳10. Maximum global ceiling: ৳5,000.
    - Transport-specific ceilings: Bus (৳400), Rickshaw (৳350), CNG (৳1,500), Bike (৳1,000).
  - **Baseline Deviation Ratio Moderation**:
    - Calculates standard route fare and derives ratio: $R = \text{ActualFarePaid} / \text{StandardCalculatedFare}$.
    - $0.5 \le R \le 1.9 \rightarrow$ `"Approved"` (Immediately published and used in Phase 5 benchmarks).
    - $1.9 < R \le 2.8 \rightarrow$ `"Pending"` (Quarantined for secondary verification).
    - $R > 2.8$ or $R < 0.3 \rightarrow$ `"Flagged"` (Suspicious outlier blocked from affecting public estimates).
  - **Anti-Spam Safeguards & Fingerprinting**:
    - Device fingerprinting via SHA256 hash of Client IP + User-Agent header.
    - Rate-limiting: Maximum 5 submissions per hour per device hash.
    - Duplicate suppression: Rejects identical route submissions from the same device within 10 minutes.
  - **Live Feed Service (`GetRecentApprovedSubmissionsAsync`)**:
    - Returns recently approved community contributions with formatted Bengali relative timestamps (`এইমাত্র`, `X মিনিট আগে`, `X ঘণ্টা আগে`).
- **REST Endpoints (`FaresController`)**:
  - `POST /api/fares/contribute`: Validates, sanitizes, moderates, and stores user fare contributions.
  - `GET /api/fares/recent-contributions?limit=6`: Serves recent community submissions for the homepage feed.
- **Frontend Fare Contribution Modal (`FareContributionModalComponent`)**:
  - Standalone modal component at `features/fare-contribution/components/fare-contribution-modal`.
  - Accessible dialog with backdrop blur, keyboard/click close, and clean responsive mobile layout.
  - Pre-fills origin, destination, and selected vehicle from active fare queries.
  - Transport selector pills (Bus, Rickshaw, CNG, Bike).
  - Currency-tagged fare input with live validation.
  - Success state display showing submission status (`Approved` vs `Pending`), route summary, and Bengali confirmation message.
- **Homepage Integration (`HomePageComponent`)**:
  - Header CTA "💬 ভাড়া শেয়ার" button opens the contribution modal anytime.
  - Result card "আমি অন্য ভাড়া দিয়েছি" button passes active route data to pre-fill the modal.
  - Live "সাম্প্রতিক সহযাত্রীদের আপডেট" section rendered below cards showing actual commuter fares with pulsing live indicator.
- **Automated Verification**:
  - Backend: `dotnet test` passed **26 / 26 tests across 4 test suites (100%)**.
  - Frontend: `npm test` passed **61 / 61 tests across 10 test suites (100%)**.
  - Production build: `npm run build` succeeded (raw 372 kB, transfer size 88 kB, 0 errors, 0 warnings).
  - Live API testing verified: `POST /api/fares/contribute` $\rightarrow$ `Approved`, `GET /api/fares/recent-contributions` returns real-time item.

---

### ✅ Phase 8: End-to-End Integration, Validation & Anti-Spam Safeguards
- **Global Backend Exception Middleware (`ExceptionHandlingMiddleware`)**:
  - Catches all unhandled exceptions cleanly and returns RFC-compliant JSON responses with localized Bengali commuter messages (`messageBn`), English technical details (`messageEn`), and unique `traceId` correlation identifiers.
  - Prevents raw stack trace leakage in production while keeping detailed logs.
- **XSS & HTML Injection Sanitization Engine (`InputSanitizer`)**:
  - Implemented comprehensive regex stripping in `VaraKoto.Core/Common/InputSanitizer.cs`.
  - Removes malicious `<script>`, `<iframe>`, `<style>` tag blocks along with inner payloads.
  - Neutralizes inline JavaScript event handlers (`onload`, `onclick`, `onerror`, `javascript:`) and encodes stray markup brackets.
  - Applied automatically to query parameters in `LocationsController` and user-submitted landmark names in `FaresController`.
- **IP Rate Limiting Middleware (ASP.NET Core RateLimiter)**:
  - Configured built-in partition rate limiting in `Program.cs` based on client IP:
    - **Global API Limiter**: 120 requests/minute per IP address with token bucket algorithm.
    - **Admin Login Protection (`admin-login-policy`)**: Fixed window limiter restricting attempts to 6 requests/minute per IP, returning HTTP 429 (`খুব বেশি চেষ্টার কারণে সাময়িকভাবে স্থগিত`).
- **Frontend Reactive Notification System & HTTP Interceptor**:
  - `NotificationService`: Angular Signals-based notification bus emitting dismissible toast alerts (success, error, warning, info) with configurable auto-dismiss timers.
  - `errorInterceptor`: Functional Angular interceptor catching HTTP status `0` (offline/server unreachable), `429` (rate limited), `404` (not found), and `500+` (server error), surfacing localized Bengali alerts to commuters.
  - Global floating toast UI rendered in `app.component.ts` with backdrop blur, brand-aligned iconography, and smooth slide-in animations.
- **Admin Panel Contrast & Accessibility Polish**:
  - Resolved dark mode contrast issue on Admin Dashboard where standard calculated fare (`৳280`) previously blended into the dark background.
  - Replaced with radiant mint green (`#34D399`) and warm amber (`#FBBF24`), achieving WCAG AAA contrast compliance.
- **Automated Verification**:
  - Backend: `dotnet test` passed **41 / 41 tests across 5 test suites (100%)**.
  - Frontend: `npm test` passed **76 / 76 tests across 15 test suites (100%)**.
  - Production build: `npm run build` succeeded (0 errors, 0 warnings, transfer size 97.86 kB).

---

## 2. Remaining Phases

- **Phase 9: Testing, Responsiveness, Performance Optimization & Project Documentation** *(Final Phase)*

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
6. **Community Data Quality Guardrails**:
   - Multi-tier moderation separates reasonable fare variations from egregious gouging or typos before community data can influence public calculations.
   - IP + User-Agent SHA256 device hashing prevents bot flooding without requiring user sign-in/passwords, keeping the app completely frictionless.
7. **Zero External CSS Framework Bloat**:
   - Every UI component (cards, inputs, autocomplete dropdowns, transport selectors, SVGs, loading screens, modals) is built with native Angular 21 and modern SCSS custom properties without heavy third-party UI libraries.

---

## 4. API Integrations
- `GET /api/health` $\rightarrow$ System health, version, timestamp, and environment status.
- `GET /api/locations/search` $\rightarrow$ Autocomplete location search (local hubs + Photon fallback).
- `GET /api/locations/reverse` $\rightarrow$ Reverse geocoding for GPS coordinate resolution.
- `GET /api/routes/distance` $\rightarrow$ Driving distance & duration calculation (Cache + OSRM + Haversine).
- `POST /api/fares/calculate` $\rightarrow$ Full multi-transport fare calculation engine.
- `GET /api/fares/estimate-for-distance` $\rightarrow$ Quick distance-based fare preview.
- `GET /api/fares/transports` $\rightarrow$ Active transport types and rule configuration.
- `POST /api/fares/contribute` $\rightarrow$ Community fare submission with outlier moderation and anti-spam protection.
- `GET /api/fares/recent-contributions` $\rightarrow$ Feed of verified recent community commuter submissions.
- SQL Server `(localdb)\MSSQLLocalDB` connected and verified.

---

## 5. Database Changes
- Database `VaraKotoDb` created on `(localdb)\MSSQLLocalDB`.
- Migration `InitialCreate` executed.
- Seeded initial records for `TransportTypes`, `FareRules`, and `Locations`.
- Verified dynamic integration with `FareSubmissions` feeding Phase 5 reliability elevation.

---

## 6. Known Issues / Blockers
- None. All backend and frontend builds and test suites are 100% clean and passing.

---

## 7. Next Recommended Phase
👉 **Phase 9: Testing, Responsiveness, Performance Optimization & Project Documentation**
- Comprehensive test coverage, multi-device viewport responsiveness, accessibility audit, production optimization, and final developer/deployment documentation.
