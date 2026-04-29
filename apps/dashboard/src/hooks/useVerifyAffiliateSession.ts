"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppQuery } from "@/hooks/useAppQuery"
import { verifyAndDeleteAffiliateSessionAction } from "@/lib/server/affiliate/verifyAndDeleteAffiliateSessionAction"

export function useVerifyAffiliateSession(
  orgId: string,
  affiliate: boolean,
  isPreview?: boolean
) {
  const router = useRouter()
  const query = useAppQuery(
    ["verify-affiliate-session", orgId],
    verifyAndDeleteAffiliateSessionAction,
    [orgId],
    {
      enabled: !!orgId && affiliate && !isPreview,
      staleTime: 0,
      gcTime: 0,
    }
  )
  useEffect(() => {
    if (
      !affiliate ||
      isPreview ||
      query.isPending ||
      query.queryResult.isFetching
    )
      return
    const result = query.data
    if (result?.reason === "needs_onboarding") {
      router.push(`/onboarding`)
      return
    }

    if (query.error) {
      router.push(`/login`)
    }
  }, [
    query.data,
    query.error,
    query.isPending,
    query.queryResult.isFetching,
    orgId,
    affiliate,
    isPreview,
    router,
  ])

  return query
}
