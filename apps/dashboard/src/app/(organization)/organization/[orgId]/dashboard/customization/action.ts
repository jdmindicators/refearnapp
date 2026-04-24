"use server"

import { AuthCustomization } from "@/customization/Auth/defaultAuthCustomization"
import { DashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization"
import { getOrgAuth } from "@/lib/server/organization/GetOrgAuth"
import { MutationData } from "@/lib/types/organization/response"
import { handleAction } from "@/lib/handleAction"
import { saveOrganizationCustomization } from "@/lib/organizationAction/saveOrganizationCustomization"

export async function saveCustomizationsAction(
  orgId: string,
  data: {
    auth?: Partial<AuthCustomization>
    dashboard?: Partial<DashboardCustomization>
    registration?: any
  }
): Promise<MutationData> {
  return handleAction("saveCustomizationsAction", async () => {
    await getOrgAuth(orgId)
    // Quick guard
    await saveOrganizationCustomization(orgId, data)
    return { ok: true, toast: "Customization Saved Successfully" }
  })
}
