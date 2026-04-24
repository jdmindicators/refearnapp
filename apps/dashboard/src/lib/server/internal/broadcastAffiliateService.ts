// lib/server/internal/broadcastAffiliateService.ts
import { db } from "@/db/drizzle"
import { sendAffiliateUpdateEmail } from "@/lib/affiliateUpdate"

export type BroadcastPayload = {
  orgId: string
  message: string
  imageUrls: string[]
  affiliateIds: string[]
}

export const broadcastAffiliateService = async (payload: BroadcastPayload) => {
  // 1. Fetch target affiliates
  const targetAffiliates = await db.query.affiliate.findMany({
    where: (a, { and, eq, inArray }) =>
      and(
        eq(a.organizationId, payload.orgId),
        eq(a.status, "active"),
        payload.affiliateIds.length > 0
          ? inArray(a.id, payload.affiliateIds)
          : undefined
      ),
    columns: { email: true, name: true },
  })

  if (targetAffiliates.length === 0) {
    throw new Error("No active affiliates found to message.")
  }

  // 2. Batch Send Emails
  const sendPromises = targetAffiliates.map((aff) =>
    sendAffiliateUpdateEmail({
      to: aff.email,
      name: aff.name,
      message: payload.message,
      images: payload.imageUrls,
      orgId: payload.orgId,
    })
  )

  await Promise.all(sendPromises)

  return targetAffiliates.length
}
