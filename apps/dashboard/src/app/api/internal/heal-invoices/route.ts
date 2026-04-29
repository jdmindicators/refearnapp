// app/api/internal/heal-invoices/route.ts
import { handleRoute } from "@/lib/handleRoute"
import { db } from "@/db/drizzle"
import { affiliateInvoice } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { AppError } from "@/lib/exceptions"

export const POST = handleRoute("Heal Invoices", async (req) => {
  const secret = req.headers.get("x-internal-secret")
  if (secret !== process.env.INTERNAL_SECRET) {
    throw new AppError({
      error: "UNAUTHORIZED",
      status: 401,
      toast: "Invalid internal secret",
    })
  }
  const RACE_WINDOW_MS = 10000
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const incompleteInvoices = await db.query.affiliateInvoice.findMany({
    where: (t, { isNull, and, ne, between }) =>
      and(
        isNull(t.transactionId),
        ne(t.reason, "placeholder_from_charge"),
        between(t.createdAt, oneDayAgo, twoMinutesAgo)
      ),
  })

  let healedCount = 0
  for (const inv of incompleteInvoices) {
    const match = await db.query.affiliateInvoice.findFirst({
      where: (t, { eq, and, between }) =>
        and(
          eq(t.customerId, inv.customerId),
          eq(t.reason, "placeholder_from_charge"),
          between(
            t.createdAt,
            new Date(inv.createdAt.getTime() - RACE_WINDOW_MS),
            new Date(inv.createdAt.getTime() + RACE_WINDOW_MS)
          )
        ),
    })

    if (match && match.transactionId) {
      await db.transaction(async (tx) => {
        await tx
          .update(affiliateInvoice)
          .set({
            transactionId: match.transactionId,
            updatedAt: new Date(),
          })
          .where(eq(affiliateInvoice.id, inv.id))

        await tx
          .delete(affiliateInvoice)
          .where(eq(affiliateInvoice.id, match.id))
      })
      healedCount++
    }
  }

  return NextResponse.json({
    success: true,
    healed: healedCount,
    checked: incompleteInvoices.length,
  })
})
