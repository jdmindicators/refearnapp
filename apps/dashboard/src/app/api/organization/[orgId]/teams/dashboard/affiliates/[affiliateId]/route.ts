import { NextResponse } from "next/server"
import { handleRoute } from "@/lib/handleRoute"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
import { getAffiliateDetailService } from "@/lib/server/organization/getAffiliateDetailService"

export const GET = handleRoute(
  "Get Specific Affiliate Detail (Team)",
  async (
    req,
    { orgId, affiliateId }: { orgId: string; affiliateId: string }
  ) => {
    await getTeamAuthAction(orgId)
    const data = await getAffiliateDetailService(orgId, affiliateId)
    return NextResponse.json({ ok: true, data })
  }
)
