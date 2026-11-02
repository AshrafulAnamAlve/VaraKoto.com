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
- **LogoComponent**: Native Angular standalone SVG component recreating `Logo system-html`:
  - Primary (horizontal with tagline)
  - Stacked (vertical centered)
  - Compact (navigation bar)
  - Icon-only (app icon / favicon)
  - Full reactive Light/Dark mode auto-adaptation using Angular 21 `input()` signals.
- **LoadingScreenComponent**: Native Angular standalone component recreating `Loading page-html`:
  - Bottom city skyline backdrop SVG (`#0B4F44` with 10% opacity).
  - Drifting clouds SVG (`drift` keyframes).
  - Animated cartoon commuter scratching head (`scratch`, `bob`, `look`, `drop` keyframes).
  - Floating colored question marks (`qm` keyframes in orange, yellow, green).
  - Idea lightbulb illumination sequence (`bulb` keyframes).
  - Swinging fare tag (`tag` keyframes alternating between `৳ ?` and `৳ ৫,০০০`).
  - Road progress track with dashed animated stripes (`dash`) and moving VaraKoto car (`drive`).
  - Dynamic Bangla status message sequence (*গাড়ি খুঁজছি…*, *ভাড়া মিলিয়ে দেখছি…*, *পেয়ে গেছি!*).
  - Complete `@media (prefers-reduced-motion: reduce)` accessibility support.
- **Showcase Interface**: Responsive header with compact logo, live Light/Dark mode switch, and full interactive loading animation preview.
- **Verification**:
  - `npm test`: **16 passed (100%)** across `ThemeService`, `LogoComponent`, `LoadingScreenComponent`, and `AppComponent`.
  - `npm run build`: **Success (0 Errors, 0 Warnings)**. Bundle size: 237.21 kB (62.77 kB gzipped).
  - `dotnet test`: **1 passed (100%)**.

---

## 2. Remaining Phases

- **Phase 3: Database Design, EF Core & Backend Foundation** *(Next)*
- **Phase 4: Location Services, Geocoding & Routing Engine**
- **Phase 5: Transportation Fare Calculation Engine**
- **Phase 6: Core Frontend Homepage – Find Fare Interface**
- **Phase 7: Community Fare Contribution & Verification System**
- **Phase 8: End-to-End Integration, Validation & Anti-Spam Safeguards**
- **Phase 9: Testing, Responsiveness, Performance Optimization & Project Documentation**

---

## 3. Important Technical Decisions

1. **Angular 21 Signal Inputs (`input()`)**:
   - Upgraded component properties (`variant`, `mode`, `active`, etc.) from legacy `@Input()` to Angular signal inputs (`input()`). This ensures seamless reactivity with `computed()` signals and completely eliminates `NG0100: ExpressionChangedAfterItHasBeenCheckedError` during Vitest execution.
2. **Zero Runtime Bloat for Animations**:
   - Recreated all SVG shapes, bobbing, scratching, swinging, and driving mechanics strictly through pure hardware-accelerated CSS keyframe transforms (`translateY`, `rotate`, `scaleX`, `opacity`), achieving 60fps on mobile without third-party animation libraries or React runtimes.
3. **Color & Theme Tokens Architecture**:
   - Defined in `:root` and `[data-theme="dark"]` using CSS custom properties for instant, flicker-free theme switching.

---

## 4. API Integrations
- `GET /api/health` $\rightarrow$ System health, version, timestamp, and environment status.

---

## 5. Database Changes
- Scheduled for **Phase 3** (SQL Server tables for `Locations`, `TransportTypes`, `FareRules`, `FareSubmissions`, `RouteCaches`).

---

## 6. Known Issues / Blockers
- None. All builds, tests, and styles are clean and passing with 0 warnings.

---

## 7. Next Recommended Phase
👉 **Phase 3: Database Design, EF Core & Backend Foundation**
- Define EF Core entity models (`Location`, `TransportType`, `FareRule`, `FareSubmission`, `RouteCache`).
- Configure `VaraKotoDbContext` with Fluent API mappings, indices, and constraints.
- Seed initial transit hubs for Bangladesh (Dhaka and Chittagong metro hubs) and official BRTA / ground fare rules.
- Execute EF Core migrations to `(localdb)\MSSQLLocalDB`.
