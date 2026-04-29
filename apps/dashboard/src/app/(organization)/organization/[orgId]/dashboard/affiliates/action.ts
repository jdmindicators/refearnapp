"use server"
import { handleAction } from "@/lib/handleAction"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { inviteAffiliateService } from "@/lib/server/internal/inviteAffiliateService"
import { updateAffiliateStatusService } from "@/services/updateAffiliateStatusService"
import {
  broadcastAffiliateService,
  BroadcastPayload,
} from "@/lib/server/internal/broadcastAffiliateService"
import { AffiliateStatus } from "@/db/schema"

export const inviteAffiliateAction = async (data: {
  email: string
  message: string
  orgId: string
}) => {
  return handleAction("inviteAffiliateAction", async () => {
    await getOrgAuth(data.orgId)
    await inviteAffiliateService(data)
    return { ok: true, toast: "Affiliate invited successfully!" }
  })
}
export const broadcastAffiliateUpdate = async (payload: BroadcastPayload) => {
  return handleAction("Broadcast Affiliate Update", async () => {
    await getOrgAuth(payload.orgId)
    const count = await broadcastAffiliateService(payload)
    return {
      ok: true,
      toast: `Update sent to ${count} affiliate(s)!`,
    }
  })
}

export const updateAffiliateStatusAction = async (data: { orgId: string; affiliateId: string; status: AffiliateStatus }) => {
  return handleAction("updateAffiliateStatusAction", async () => {
    await getOrgAuth(data.orgId)
    await updateAffiliateStatusService(data)
    return { ok: true, toast: `Affiliate status updated to ${data.status}!` }
  })
}
