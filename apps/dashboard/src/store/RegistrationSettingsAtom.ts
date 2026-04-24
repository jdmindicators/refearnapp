import { atom } from "jotai"
import equal from "fast-deep-equal"

export interface RegistrationSettings {
  askPromotionMethod: boolean
  askWebsiteUrl: boolean
  askSocialHandle: boolean
  askPromotionDetails: boolean
  showTos: boolean
  tosUrl: string
  privacyPolicyUrl: string
}

const defaultSettings: RegistrationSettings = {
  askPromotionMethod: false,
  askWebsiteUrl: false,
  askSocialHandle: false,
  askPromotionDetails: false,
  showTos: false,
  tosUrl: "",
  privacyPolicyUrl: "",
}

// Current UI State
export const registrationSettingsAtom =
  atom<RegistrationSettings>(defaultSettings)

// Server State (Source of Truth)
export const initialRegistrationSettingsAtom =
  atom<RegistrationSettings | null>(null)

// Robust Change Tracking
export const registrationHasChangesAtom = atom((get) => {
  const current = get(registrationSettingsAtom)
  const initial = get(initialRegistrationSettingsAtom)

  if (initial === null) return false
  return !equal(current, initial)
})
