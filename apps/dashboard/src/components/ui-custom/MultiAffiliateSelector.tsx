"use client"

import React, { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, UserCheck } from "lucide-react"
import { api } from "@/lib/apiClient"
import { useAppQuery } from "@/hooks/useAppQuery"

export function MultiAffiliateSelector({
  orgId,
  selectedIds,
  onSelectionChange,
  isTeam = false,
}: {
  orgId: string
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  isTeam?: boolean
}) {
  const [search, setSearch] = useState("")
  const [offset, setOffset] = useState(1)
  const [affiliates, setAffiliates] = useState<any[]>([])

  // 🟢 Fix: useAppQuery needs 4 arguments: Key, Function, Args (as const), Options
  const { data, isPending } = useAppQuery(
    ["affiliate-broadcast-lookup", orgId, offset, search],
    (id, query) => api.organization.affiliateLookup([id, query]),
    [
      orgId,
      {
        offset,
        search: search || undefined,
        context: isTeam ? "team" : "admin",
      },
    ] as const, // This 'as const' is crucial for the Tuple type
    {
      enabled: !!orgId,
    }
  )

  useEffect(() => {
    if (data?.rows) {
      setAffiliates((prev) =>
        offset === 1 ? data.rows : [...prev, ...data.rows]
      )
    }
  }, [data, offset])

  const toggleAffiliate = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id]
    onSelectionChange(newSelection)
  }

  const toggleAllVisible = () => {
    const allVisibleIds = affiliates.map((a) => a.id)
    const allSelected = allVisibleIds.every((id) => selectedIds.includes(id))

    if (allSelected) {
      onSelectionChange(selectedIds.filter((id) => !allVisibleIds.includes(id)))
    } else {
      const uniqueNewIds = Array.from(
        new Set([...selectedIds, ...allVisibleIds])
      )
      onSelectionChange(uniqueNewIds)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setOffset(1)
            }}
            className="pl-8 h-9"
          />
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAllVisible}
            type="button"
            className="text-[11px] h-9"
          >
            Select Page
          </Button>
          {selectedIds.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange([])}
              type="button"
              className="text-[11px] h-9 text-destructive hover:text-destructive"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Fixed height container makes the "Load More" feel more stable */}
      <div className="border rounded-md h-[180px] overflow-y-auto p-1 bg-background/50 custom-scrollbar">
        {affiliates.map((a) => (
          <div
            key={a.id}
            className="flex items-center space-x-3 p-2 hover:bg-muted/80 rounded-sm transition-colors mb-0.5"
          >
            <Checkbox
              id={`selector-${a.id}`}
              checked={selectedIds.includes(a.id)}
              onCheckedChange={() => toggleAffiliate(a.id)}
            />
            <label
              htmlFor={`selector-${a.id}`}
              className="text-sm cursor-pointer flex-1 flex flex-col"
            >
              <span className="font-medium text-[13px] leading-tight">
                {a.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {a.email}
              </span>
            </label>
          </div>
        ))}

        {isPending && (
          <div className="flex justify-center p-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}

        {data?.hasNext && !isPending && (
          <button
            onClick={() => setOffset((p) => p + 1)}
            type="button"
            className="w-full py-2 text-[11px] text-primary hover:underline font-medium"
          >
            View more affiliates...
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`text-[11px] flex items-center gap-1.5 font-medium p-1.5 px-3 rounded-full border transition-colors ${
            selectedIds.length === 0
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-primary/10 text-primary border-primary/20"
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          {selectedIds.length === 0
            ? "Targeting: All active affiliates"
            : `${selectedIds.length} affiliates targeted`}
        </div>
      </div>
    </div>
  )
}
