import { affiliate } from "@/db/schema"
import { InferSelectModel } from "drizzle-orm"

export type AffiliateDetail = InferSelectModel<typeof affiliate>
