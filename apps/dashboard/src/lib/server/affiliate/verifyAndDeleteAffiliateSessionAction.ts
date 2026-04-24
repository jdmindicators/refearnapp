"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { db } from "@/db/drizzle"
import { affiliate, organization } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { handleAction } from "@/lib/handleAction"
import { ActionResult } from "@/lib/types/organization/response"
import { AppError } from "@/lib/exceptions"

export const verifyAndDeleteAffiliateSessionAction = async (
  orgId: string
): Promise<
  ActionResult<{ reason: "affiliate_active" | "needs_onboarding" }>
> => {
  return handleAction("Verify Affiliate Session", async () => {
    const cookieStore = await cookies()
    const cookieName = `affiliateToken-${orgId}`
    const token = cookieStore.get(cookieName)?.value

    if (!token) {
      throw new AppError({ status: 401, toast: "No session found" })
    }

    const decoded = jwt.decode(token) as { id: string }

    const affiliateData = await db.query.affiliate.findFirst({
      where: and(
        eq(affiliate.id, decoded.id),
        eq(affiliate.organizationId, orgId)
      ),
    })

    const orgData = await db.query.organization.findFirst({
      where: eq(organization.id, orgId),
    })

    if (!affiliateData || !orgData) {
      cookieStore.delete(cookieName)
      throw new AppError({
        status: 404,
        toast: "Account or Organization no longer exists",
      })
    }
    const hasOnboardingFields =
      orgData.askPromotionMethod ||
      orgData.askWebsiteUrl ||
      orgData.askSocialHandle ||
      orgData.askPromotionDetails
    if (
      affiliateData.status === "active" &&
      !affiliateData.onboardingCompleted
    ) {
      if (hasOnboardingFields) {
        return { ok: true, data: { reason: "needs_onboarding" } }
      } else {
        await db
          .update(affiliate)
          .set({ onboardingCompleted: true })
          .where(eq(affiliate.id, affiliateData.id))

        return { ok: true, data: { reason: "affiliate_active" } }
      }
    }
    if (affiliateData.status !== "active") {
      cookieStore.delete(cookieName)
      const message =
        affiliateData.status === "pending"
          ? "Your application is still under review."
          : "Account deactivated."
      throw new AppError({ status: 403, toast: message })
    }

    return { ok: true, data: { reason: "affiliate_active" } }
  })
}
