export const PROMOTION_METHODS = [
  "social_media",
  "blog_website",
  "email_marketing",
  "paid_ads",
  "content_creation",
  "offline_networking",
  "other",
] as const

export type PromotionMethod = (typeof PROMOTION_METHODS)[number]

export const PROMOTION_METHOD_LABELS: Record<PromotionMethod, string> = {
  social_media: "Social Media (Instagram, TikTok, X)",
  blog_website: "Blog or Personal Website",
  email_marketing: "Email Marketing / Newsletter",
  paid_ads: "Paid Advertising (Google, Meta, etc.)",
  content_creation: "Content Creation (YouTube, Podcasts)",
  offline_networking: "Offline / Word of Mouth",
  other: "Other / Unique Strategy",
}
