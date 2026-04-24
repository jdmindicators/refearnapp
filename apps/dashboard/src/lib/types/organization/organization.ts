// types/organization.ts
import { organization } from "@/db/schema"

export type OrgData = Omit<
  typeof organization.$inferSelect,
  | "createdAt"
  | "updatedAt"
  | "userId"
  | "askPromotionMethod"
  | "askWebsiteUrl"
  | "askSocialHandle"
  | "askPromotionDetails"
  | "showTos"
  | "tosUrl"
  | "privacyPolicyUrl"
>
