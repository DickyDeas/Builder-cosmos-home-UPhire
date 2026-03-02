/**
 * Onboarding Service
 * Manages the full onboarding flow after offer acceptance:
 * - Contract sent and signed copy received
 * - ID documents (passport/visa/NI number)
 * - Bank details for payment
 * - References (candidate provides or referee contact for UPhire to request)
 * - Start date (client provides 3 options; notice period considered)
 * - First-day info (dress code, arrival time, handbook)
 * All data saved to Employees section under candidate folder.
 */

export interface OnboardingCandidate {
  id: number | string;
  name: string;
  email: string;
  role: string;
  roleId?: string | number;
  noticePeriod?: string;
  offerAcceptedAt?: string;
}

export interface OnboardingChecklist {
  candidateId: string | number;
  contractSent: boolean;
  contractSignedReceived: boolean;
  idDocumentsReceived: boolean; // passport/visa/NI
  bankDetailsReceived: boolean;
  referencesComplete: boolean; // candidate provided or UPhire requested from referees
  startDateConfirmed: boolean;
  firstDayInfoSent: boolean; // dress code, arrival time, handbook
}

export interface ReferenceRequest {
  id: string;
  refereeName: string;
  refereeEmail: string;
  refereeCompany?: string;
  relationship: "current" | "previous" | "other";
  status: "pending" | "requested" | "received";
  receivedAt?: string;
}

export interface StartDateOption {
  date: string;
  preferred: boolean;
  confirmed: boolean;
}

// In-memory store (use Supabase for production)
const onboardingStore = new Map<string | number, {
  candidate: OnboardingCandidate;
  checklist: OnboardingChecklist;
  references: ReferenceRequest[];
  startDateOptions: StartDateOption[];
  firstDayInfo?: {
    dressCode?: string;
    arrivalTime?: string;
    handbookUrl?: string;
    otherInfo?: string;
  };
}>();

export function startOnboarding(candidate: OnboardingCandidate): void {
  const key = candidate.id;
  if (onboardingStore.has(key)) return;
  onboardingStore.set(key, {
    candidate,
    checklist: {
      candidateId: key,
      contractSent: false,
      contractSignedReceived: false,
      idDocumentsReceived: false,
      bankDetailsReceived: false,
      referencesComplete: false,
      startDateConfirmed: false,
      firstDayInfoSent: false,
    },
    references: [],
    startDateOptions: [],
  });
}

export function getOnboarding(candidateId: string | number) {
  return onboardingStore.get(candidateId) || null;
}

export function updateChecklist(
  candidateId: string | number,
  updates: Partial<OnboardingChecklist>
): void {
  const existing = onboardingStore.get(candidateId);
  if (existing) {
    existing.checklist = { ...existing.checklist, ...updates };
  }
}

export function addReference(
  candidateId: string | number,
  ref: Omit<ReferenceRequest, "id" | "status">
): void {
  const existing = onboardingStore.get(candidateId);
  if (existing) {
    existing.references.push({
      ...ref,
      id: `ref-${Date.now()}`,
      status: "pending",
    });
  }
}

export function setStartDateOptions(
  candidateId: string | number,
  options: StartDateOption[]
): void {
  const existing = onboardingStore.get(candidateId);
  if (existing) {
    existing.startDateOptions = options;
  }
}

export function setFirstDayInfo(
  candidateId: string | number,
  info: NonNullable<ReturnType<typeof getOnboarding>["firstDayInfo"]>
): void {
  const existing = onboardingStore.get(candidateId);
  if (existing) {
    existing.firstDayInfo = info;
  }
}
