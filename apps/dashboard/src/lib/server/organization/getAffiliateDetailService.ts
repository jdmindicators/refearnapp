import { db } from "@/db/drizzle"
import { AppError } from "@/lib/exceptions"

export async function getAffiliateDetailService(
  orgId: string,
  affiliateId: string
) {
  const data = await db.query.affiliate.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.id, affiliateId), eq(table.organizationId, orgId)),
  })

  if (!data) {
    throw new AppError({
      error: "AFFILIATE_NOT_FOUND",
      status: 404,
    })
  }

  return data
}
