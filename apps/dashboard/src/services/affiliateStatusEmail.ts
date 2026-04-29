import { sendEmail } from "@/lib/sendEmail"
import { AffiliateStatus, affiliate, organization } from "@/db/schema"
import { InferSelectModel } from "drizzle-orm"
import { getOrgBaseUrl } from "@/lib/server/organization/getOrgBaseUrl"

type Affiliate = InferSelectModel<typeof affiliate>
type Organization = InferSelectModel<typeof organization>

export async function sendAffiliateStatusUpdateEmail({
  affiliate,
  organization,
  newStatus,
  orgId,
}: {
  affiliate: Affiliate
  organization: Pick<Organization, "name" | "supportEmail">
  newStatus: AffiliateStatus
  orgId: string
}) {
  const orgName = organization.name || "RefearnApp"

  // Generate the login URL based on organization settings
  const baseUrl = await getOrgBaseUrl(orgId)
  const loginUrl = `${baseUrl}/login`

  // Define Email Templates
  const templates: Record<
    AffiliateStatus,
    { subject: string; body: string; showLink: boolean }
  > = {
    active: {
      subject: `Welcome to the ${orgName} Affiliate Program!`,
      body: `Great news! Your affiliate application for ${orgName} has been approved. You can now access your dashboard, generate links, and start earning commissions.`,
      showLink: true,
    },
    suspended: {
      subject: `Account Status Update: ${orgName}`,
      body: `We are writing to inform you that your affiliate account for ${orgName} has been suspended. If you have questions regarding this change, please reach out to our support team.`,
      showLink: false,
    },
    rejected: {
      subject: `Update on your application for ${orgName}`,
      body: `Thank you for your interest in the ${orgName} affiliate program. After reviewing your profile, we have decided not to proceed with your application at this time.`,
      showLink: false,
    },
    pending: {
      subject: `Application Under Review: ${orgName}`,
      body: `Your affiliate account for ${orgName} is currently under review. We will notify you via email as soon as a decision has been made.`,
      showLink: false,
    },
  }

  const { subject, body, showLink } = templates[newStatus]

  // Conditional Button HTML
  const actionButton = showLink
    ? `
      <div style="margin: 32px 0; text-align: center;">
        <a href="${loginUrl}" 
           style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
          Go to Dashboard
        </a>
      </div>
      <p style="font-size: 12px; color: #999999; text-align: center; margin-top: 10px;">
        Link not working? Copy and paste this into your browser:<br/>
        <span style="color: #4f46e5;">${loginUrl}</span>
      </p>
    `
    : ""

  try {
    await sendEmail({
      to: affiliate.email,
      fromName: orgName,
      replyTo: organization.supportEmail || undefined,
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 40px; border-radius: 12px;">
          <h2 style="color: #111827; margin-bottom: 24px; font-size: 20px;">Hello ${affiliate.name},</h2>
          <p style="margin-bottom: 24px; font-size: 16px;">${body}</p>
          
          ${actionButton}
          
          <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 32px 0;" />
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
            Best regards,<br />
            <strong>The ${orgName} Team</strong>
          </p>
          ${
            organization.supportEmail
              ? `
            <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
              Questions? Contact us at ${organization.supportEmail}
            </p>
          `
              : ""
          }
        </div>
      `,
    })
  } catch (error) {
    console.error("Failed to send affiliate status notification email:", error)
  }
}
