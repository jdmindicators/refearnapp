"use server"

import { db } from "@/db/drizzle"
import { affiliate } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { handleAction } from "@/lib/handleAction"
import { getAffiliateOrganization } from "@/lib/server/affiliate/GetAffiliateOrganization"
import { MutationData } from "@/lib/types/organization/response"
import { buildAffiliateUrl } from "@/util/Url"
import { getBaseUrl } from "@/lib/server/affiliate/getBaseUrl"
import { PromotionMethod } from "@/lib/constants"

export async function completeAffiliateOnboardingAction(
  orgId: string,
  data: {
    websiteUrl?: string
    promotionMethod?: string[]
    promotionDetails?: string
    socialHandle?: string
  }
): Promise<MutationData> {
  return handleAction("completeAffiliateOnboarding", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const affiliateId = decoded.id

    await db
      .update(affiliate)
      .set({
        websiteUrl: data.websiteUrl || null,
        promotionMethods: (data.promotionMethod as PromotionMethod[]) || null,
        promotionDetails: data.promotionDetails || null,
        socialHandle: data.socialHandle || null,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(
        and(eq(affiliate.id, affiliateId), eq(affiliate.organizationId, orgId))
      )

    const baseUrl = await getBaseUrl()
    const redirectUrl = buildAffiliateUrl({
      path: "dashboard",
      organizationId: orgId,
      baseUrl,
    })

    return {
      ok: true,
      toast: "Application completed successfully!",
      redirectUrl,
    }
  })
}
