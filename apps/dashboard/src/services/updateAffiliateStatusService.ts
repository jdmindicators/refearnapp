import { db } from "@/db/drizzle"
import { affiliate, organization, AffiliateStatus } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { AppError } from "@/lib/exceptions"
import { sendAffiliateStatusUpdateEmail } from "./affiliateStatusEmail"

export async function updateAffiliateStatusService({
  orgId,
  affiliateId,
  status,
}: {
  orgId: string
  affiliateId: string
  status: AffiliateStatus
}) {
  // 1. Update Database
  const [updatedAffiliate] = await db
    .update(affiliate)
    .set({ status, updatedAt: new Date() })
    .where(
      and(eq(affiliate.id, affiliateId), eq(affiliate.organizationId, orgId))
    )
    .returning()

  if (!updatedAffiliate) {
    throw new AppError({
      status: 404,
      error: "AFFILIATE_NOT_FOUND",
      toast: "Affiliate not found or update failed.",
    })
  }

  // 2. Fetch Organization context for the email
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
    columns: {
      id: true,
      name: true,
      supportEmail: true,
    },
  })

  if (!org) {
    throw new AppError({
      status: 404,
      error: "ORGANIZATION_NOT_FOUND",
      toast: "Organization not found for email context.",
    })
  }

  // 3. Send Notification with full context
  await sendAffiliateStatusUpdateEmail({
    affiliate: updatedAffiliate,
    organization: org,
    newStatus: status,
    orgId: orgId,
  })

  return updatedAffiliate
}
