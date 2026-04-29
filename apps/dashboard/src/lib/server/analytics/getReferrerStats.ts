import { db } from "@/db/drizzle"
import { affiliate, affiliateClick, affiliateLink } from "@/db/schema"
import { eq, inArray, sql } from "drizzle-orm"
import { buildWhereWithDate } from "@/util/BuildWhereWithDate"

export async function getReferrerStats(
  linkIds: string[],
  year?: number,
  month?: number
) {
  return db
    .select({
      referrer: affiliateClick.referrer,
      clicks: sql<number>`COUNT(*)`.mapWith(Number),
    })
    .from(affiliateClick)
    .innerJoin(
      affiliateLink,
      eq(affiliateLink.id, affiliateClick.affiliateLinkId)
    )
    .innerJoin(affiliate, eq(affiliate.id, affiliateLink.affiliateId))
    .where(
      buildWhereWithDate(
        [
          inArray(affiliateClick.affiliateLinkId, linkIds),
          eq(affiliate.status, "active"),
        ],
        affiliateClick,
        year,
        month
      )
    )
    .groupBy(affiliateClick.referrer)
}
