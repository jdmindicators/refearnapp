// lib/emails/affiliateUpdate.ts
import { db } from "@/db/drizzle"
import { organization } from "@/db/schema"
import { sendEmail } from "@/lib/sendEmail"
import { escapeHtml } from "@/util/escapeHtml"
import { eq } from "drizzle-orm"

type AffiliateUpdatePayload = {
  to: string
  name: string
  message: string
  images: string[]
  orgId: string
}

function buildAffiliateUpdateTemplate(
  name: string,
  message: string,
  images: string[]
) {
  const safeName = escapeHtml(name)
  const safeMessage = escapeHtml(message)

  const imagesHtml = images
    .map(
      (url) => `
    <div style="margin-top: 20px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <a href="${url}" target="_blank" download style="text-decoration: none; display: block;">
        <img src="${url}" alt="Affiliate Resource" style="width: 100%; display: block; max-width: 600px;" />
        <div style="background: #f8f9fa; padding: 8px; text-align: center; font-size: 12px; color: #1a73e8; border-top: 1px solid #eee;">
          Click to View / Download High-Res
        </div>
      </a>
    </div>
  `
    )
    .join("")

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
      <h2 style="color: #1a73e8;">Hello ${safeName},</h2>
      <p style="white-space: pre-line; font-size: 16px;">${safeMessage}</p>
      
      ${images.length > 0 ? `<h3 style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">Marketing Resources:</h3>` : ""}
      ${imagesHtml}
      
      <p style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
        You are receiving this update because you are an active affiliate of ${safeName ? "our program" : "the program"}.
      </p>
    </div>
  `
}

export const sendAffiliateUpdateEmail = async ({
  to,
  name,
  message,
  images,
  orgId,
}: AffiliateUpdatePayload) => {
  const html = buildAffiliateUpdateTemplate(name, message, images)

  let fromName = "RefearnApp"
  let replyTo = "support@refearnapp.com"

  if (orgId) {
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, orgId),
      columns: { name: true, supportEmail: true },
    })

    if (org) {
      if (org.name) fromName = org.name
      if (org.supportEmail) replyTo = org.supportEmail
    }
  }

  return sendEmail({
    to,
    subject: `Affiliate Update: New resources from ${fromName}`, // Changed to Affiliate
    fromName,
    html,
    replyTo,
  })
}
