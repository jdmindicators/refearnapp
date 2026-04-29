"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Power,
  PowerOff,
  Trash2,
  Star,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react"
import { DomainRow } from "@/lib/types/organization/domainRow"
import { TableActionPopover } from "@/components/ui-custom/TableActionPopover"

export const manageDomainsColumns = ({
  onToggleActive,
  onMakePrimary,
  onToggleRedirect,
  onDelete,
  onVerifyDns,
}: {
  onToggleActive: (id: string, isActive: boolean, domainName: string) => void
  onMakePrimary: (id: string, domainName: string) => void
  onToggleRedirect: (
    id: string,
    isRedirect: boolean,
    domainName: string
  ) => void
  onDelete: (id: string, domainName: string) => void
  onVerifyDns: (id: string) => void
}): ColumnDef<DomainRow>[] => [
  /* ---------------- Domain ---------------- */
  {
    accessorKey: "domainName",
    header: "Domain",
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.original.domainName}</div>
    ),
  },

  /* ---------------- DNS ---------------- */
  {
    accessorKey: "dnsStatus",
    header: "DNS",
    cell: ({ row }) => {
      const { dnsStatus, isVerified } = row.original

      let label = ""
      let classes = "px-2 py-1 rounded-full text-xs border-2"

      if (!isVerified && dnsStatus === "Pending") {
        label = "Pending"
        classes += " border-gray-400 text-gray-600 bg-gray-50"
      } else if (!isVerified && dnsStatus === "Failed") {
        label = "Failed"
        classes += " border-red-500 text-red-600 bg-red-50"
      } else if (isVerified && dnsStatus === "Verified") {
        label = "Valid"
        classes += " border-green-500 text-green-600 bg-green-50"
      } else {
        label = "Broken"
        classes += " border-yellow-500 text-yellow-600 bg-yellow-50"
      }

      return (
        <Badge variant="outline" className={classes}>
          {label}
        </Badge>
      )
    },
  },

  /* ---------------- Status ---------------- */
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const { isActive } = row.original

      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 rounded-full text-xs border-2 ${
            isActive
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-gray-400 text-gray-600 bg-gray-50"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },

  /* ---------------- Role ---------------- */
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => {
      const { isPrimary, isRedirect } = row.original

      if (isPrimary) {
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-400">
            Primary
          </Badge>
        )
      }

      if (isRedirect) {
        return (
          <Badge className="bg-purple-100 text-purple-800 border border-purple-400">
            Redirect
          </Badge>
        )
      }

      return (
        <Badge variant="outline" className="text-gray-600">
          —
        </Badge>
      )
    },
  },

  /* ---------------- Actions ---------------- */
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const {
        id,
        type,
        isActive,
        isPrimary,
        isRedirect,
        dnsStatus,
        isVerified,
        domainName,
      } = row.original

      const isCustom = type === "CUSTOM_DOMAIN" || type === "CUSTOM_SUBDOMAIN"

      const needsVerification = isCustom

      const canDelete = !isPrimary && (isCustom || type === "DEFAULT")
      const canActivate = isVerified && dnsStatus === "Verified"
      if (isPrimary) {
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-400">
            Primary domain
          </Badge>
        )
      }

      return (
        <TableActionPopover>
              {/* Activate / Deactivate */}
              {canActivate && (
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => onToggleActive(id, isActive, domainName)}
                >
                  {isActive ? (
                    <>
                      <PowerOff className="h-4 w-4 text-orange-500" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 text-green-600" />
                      Activate
                    </>
                  )}
                </Button>
              )}

              {/* Verify */}
              {needsVerification && (
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => onVerifyDns(id)}
                >
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Verify DNS
                </Button>
              )}

              {/* Make Primary */}
              {isActive && (
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => onMakePrimary(id, domainName)}
                >
                  <Star className="h-4 w-4 text-yellow-500" />
                  Make Primary
                </Button>
              )}

              {/* Redirect */}
              {isActive && (
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => onToggleRedirect(id, isRedirect, domainName)}
                >
                  <ArrowRightLeft className="h-4 w-4 text-purple-500" />
                  {isRedirect ? "Disable Redirect" : "Enable Redirect"}
                </Button>
              )}

              {/* Delete */}
              {canDelete && (
                <>
                  <Separator className="my-1" />
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(id, domainName)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Domain
                  </Button>
                </>
              )}
        </TableActionPopover>
      )
    },
  },
]
