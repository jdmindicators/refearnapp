"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AffiliateStats } from "@/lib/types/affiliate/affiliateStats"
import { getCommonAffiliateColumns } from "@/components/ui-custom/CommonColumns"
import { AffiliateStatus } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { UserX, ShieldAlert, Clock, CheckCircle } from "lucide-react"
import { TableActionPopover } from "@/components/ui-custom/TableActionPopover"

export const AffiliatesColumns = (
  onEmailClick?: (id: string) => void,
  onStatusChange?: (id: string, status: AffiliateStatus) => void,
  currentStatus: AffiliateStatus = "active"
): ColumnDef<AffiliateStats>[] => {
  const commonAffiliate = getCommonAffiliateColumns(onEmailClick)

  return [
    commonAffiliate.email,
    commonAffiliate.links,
    commonAffiliate.visitors,
    commonAffiliate.sales,
    {
      accessorKey: "signups",
      header: "Signups",
      cell: ({ row }) => <div>{row.original.signups ?? 0}</div>,
    },
    {
      accessorKey: "clickToSignupRate",
      header: "C2S Rate",
      cell: ({ row }) => {
        const rate = parseFloat(row.getValue("clickToSignupRate"))
        return <div>{isNaN(rate) ? "0.00%" : `${rate.toFixed(2)}%`}</div>
      },
    },
    {
      accessorKey: "signupToPaidRate",
      header: "S2P Rate",
      cell: ({ row }) => {
        const rate = parseFloat(row.getValue("signupToPaidRate"))
        return <div>{isNaN(rate) ? "0.00%" : `${rate.toFixed(2)}%`}</div>
      },
    },
    commonAffiliate.commission,
    commonAffiliate.paid,
    commonAffiliate.unpaid,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActionPopover>
          <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
            Move to...
          </p>

          {/* 1. ACTIVE Tab Options */}
          {currentStatus === "active" && (
            <>
              <Button
                variant="ghost"
                className="justify-start text-xs h-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => onStatusChange?.(row.original.id, "suspended")}
              >
                <ShieldAlert className="h-3.5 w-3.5 mr-2" /> Suspend
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onStatusChange?.(row.original.id, "rejected")}
              >
                <UserX className="h-3.5 w-3.5 mr-2" /> Reject
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-xs h-8 text-slate-600 hover:bg-slate-50"
                onClick={() => onStatusChange?.(row.original.id, "pending")}
              >
                <Clock className="h-3.5 w-3.5 mr-2" /> Move to Pending
              </Button>
            </>
          )}

          {/* 2. PENDING Tab Options */}
          {currentStatus === "pending" && (
            <>
              <Button
                variant="ghost"
                className="justify-start text-xs h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                onClick={() => onStatusChange?.(row.original.id, "active")}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-2" /> Approve & Activate
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onStatusChange?.(row.original.id, "rejected")}
              >
                <UserX className="h-3.5 w-3.5 mr-2" /> Reject Application
              </Button>
            </>
          )}

          {/* 3. SUSPENDED Tab Options */}
          {currentStatus === "suspended" && (
            <Button
              variant="ghost"
              className="justify-start text-xs h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              onClick={() => onStatusChange?.(row.original.id, "active")}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-2" /> Re-Activate
            </Button>
          )}

          {/* 4. REJECTED Tab Options */}
          {currentStatus === "rejected" && (
            <Button
              variant="ghost"
              className="justify-start text-xs h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              onClick={() => onStatusChange?.(row.original.id, "active")}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-2" /> Restore & Activate
            </Button>
          )}
        </TableActionPopover>
      ),
    },
  ]
}
