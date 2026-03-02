# UPhire Refactoring Plan

Based on code review feedback: break the monolithic `Index.tsx` (~9,600 lines) into maintainable modules.

## Current State
- **Types:** Already in `src/pages/uphire/types.ts`
- **Mock data:** Already in `src/pages/uphire/data.ts`
- **Utils:** Already in `src/pages/uphire/utils.ts`
- **Services:** Separate files (marketDataService, emailService, etc.)
- **Problem:** 30+ components still inline in Index.tsx

## Phase 1: Extract Self-Contained Components (Done)
- [x] `MarketIntelligence` → `src/pages/uphire/components/MarketIntelligence.tsx`
- [x] `MarketIntelligenceTab` → uses MarketIntelligence

## Phase 2: Extract Tab Views (In Progress)
- [x] `DashboardTab` → `src/pages/uphire/views/DashboardTab.tsx`
- [x] `AnalyticsTab` → `src/pages/uphire/views/AnalyticsTab.tsx`
- [ ] `RolesTab` → `src/pages/uphire/views/RolesTab.tsx`
- `CandidatesTab` → `src/pages/uphire/views/CandidatesTab.tsx`
- `EmployeesTab` → `src/pages/uphire/views/EmployeesTab.tsx`
- `DocumentsTab` → `src/pages/uphire/views/DocumentsTab.tsx`
- `AnalyticsTab` → `src/pages/uphire/views/AnalyticsTab.tsx`
- `SavingsTab` → `src/pages/uphire/views/SavingsTab.tsx`
- `OutreachTab` → `src/pages/uphire/views/OutreachTab.tsx`
- `CVDatabaseTab` → `src/pages/uphire/views/CVDatabaseTab.tsx`
- `MyBusinessTab` → `src/pages/uphire/views/MyBusinessTab.tsx`

## Phase 3: Extract Modals
- `EmployeeDetailsModal`, `ProfileViewModal`, `ScreeningModal`, `SendMessageModal`
- `CreateNewRoleModal`, `AIRecruitmentModal`, `AIPredictionModal`
- `MakeOfferModal`, `OnboardingModal`, `CreateOutreachSequenceModal`, `AddJobBoardModal`
- `RoleShortlistView`, `JobDetailsView`

## Phase 4: Shared UI Components
- Reusable cards, tables, modals patterns
- Consider `src/components/uphire/` for shared UPhire-specific UI

## Phase 5: State Management (Optional)
- Consider React Context or Zustand for shared platform state
- Reduce prop drilling between tabs and modals
