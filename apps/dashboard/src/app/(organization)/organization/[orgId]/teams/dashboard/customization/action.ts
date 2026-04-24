"use server"

import { MutationData } from "@/lib/types/organization/response"
import { handleAction } from "@/lib/handleAction"
import { saveOrganizationCustomization } from "@/lib/organizationAction/saveOrganizationCustomization"
import { getTeamAuthAction } from "@/lib/server/team/getTeamAuthAction"
import { AuthCustomization } from "@/customization/Auth/defaultAuthCustomization"
import { DashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization"

export async function saveTeamCustomizationsAction(
  orgId: string,
  data: {
    auth?: Partial<AuthCustomization>
    dashboard?: Partial<DashboardCustomization>
    registration?: any
  }
): Promise<MutationData> {
  return handleAction("saveCustomizationsAction", async () => {
    await getTeamAuthAction(orgId)
    // Quick guard
    await saveOrganizationCustomization(orgId, data)
    return { ok: true, toast: "Customization Saved Successfully" }
  })
}
