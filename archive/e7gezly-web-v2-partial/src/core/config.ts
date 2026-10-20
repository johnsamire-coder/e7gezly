/**
 * Phase 1 is UI only. These flags describe what the running app can actually do,
 * so copy and disabled states never claim a capability that is not wired up.
 */
export const features = {
  realAuth: false,
  persistentStorage: false,
  payments: false,
  liveAvailability: false,
  aiAssistant: false,
  realProviderDirectory: false,
} as const;

export const listingsAreDemoOnly = !features.realProviderDirectory;

export const PLACEHOLDER_LISTINGS = 'لسّه مفيش مزوّدين حقيقيين مضافين للسوق';
