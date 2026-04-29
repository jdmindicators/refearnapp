"use client"

import { LinksDialog } from "@/components/ui-custom/LinksDialog"

// 💰 Helper to format currency safely
const formatCurrency = (value: any, currency: string = "USD") => {
  const amount = parseFloat(value)
  if (isNaN(amount)) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

const INTERACTIVE_CLASS = "p-0 h-auto font-medium text-slate-900 underline decoration-dashed decoration-slate-300 underline-offset-4 cursor-help hover:text-slate-600 transition-colors text-left"

// 📦 Common columns shared between affiliate & payout tables
export const getCommonAffiliateColumns = (onEmailClick?: (id: string) => void) => ({
  email: ({
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: any) => {
      const email = row.getValue("email")
      if (onEmailClick) {
        return (
          <button
            onClick={() => onEmailClick(row.original.id)}
            className={INTERACTIVE_CLASS}
          >
            {email}
          </button>
        )
      }
      return <div className="lowercase text-sm">{email}</div>
    },
  } as any),
  links: {
    id: "links",
    header: "Links",
    cell: ({ row }: any) => (
      <LinksDialog
        links={row.original.links}
        title="Affiliate Links"
        description="All links created by this affiliate."
        triggerClassName={INTERACTIVE_CLASS}
      />
    ),
  } as any,
  visitors: {
    accessorKey: "visitors",
    header: "Visitors",
    cell: ({ row }: any) => <div>{row.getValue("visitors")}</div>,
  },
  sales: {
    accessorKey: "sales",
    header: "Sales",
    cell: ({ row }: any) => <div>{row.getValue("sales")}</div>,
  },
  commission: {
    accessorKey: "commission",
    header: () => <div className="text-right">Commission</div>,
    cell: ({ row }: any) => {
      const currency = row.original.currency || "USD"
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("commission"), currency)}
        </div>
      )
    },
  },
  paid: {
    accessorKey: "paid",
    header: () => <div className="text-right">Paid</div>,
    cell: ({ row }: any) => {
      const currency = row.original.currency || "USD"
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("paid"), currency)}
        </div>
      )
    },
  },
  unpaid: {
    accessorKey: "unpaid",
    header: () => <div className="text-right">Unpaid</div>,
    cell: ({ row }: any) => {
      const currency = row.original.currency || "USD"
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("unpaid"), currency)}
        </div>
      )
    },
  },
});

// 🚀 Instance for standard use (like Payout table) to prevent import errors
export const commonAffiliateColumns = getCommonAffiliateColumns();
