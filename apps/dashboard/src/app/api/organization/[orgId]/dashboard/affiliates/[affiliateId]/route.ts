import { NextResponse } from "next/server"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { db } from "@/db/drizzle"
import { handleRoute } from "@/lib/handleRoute"
import { AppError } from "@/lib/exceptions"

export const GET = handleRoute(
  "Get Specific Affiliate Detail",
  async (
    req,
    { orgId, affiliateId }: { orgId: string; affiliateId: string }
  ) => {
    // 1. Authorization
    await getOrgAuth(orgId)

    // 2. Fetch Data
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

    return NextResponse.json({ ok: true, data })
  }
)
