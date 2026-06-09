import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Settings2 } from "lucide-react"
import { Table as ReactTable } from "@tanstack/react-table"
import { OrderBy, OrderDir } from "@/lib/types/analytics/orderTypes"
import OrderSelect from "@/components/ui-custom/OrderSelect"
import { SearchInput } from "@/components/ui-custom/SearchInput"
import { ReactNode } from "react"

type TableProps<TData, TOrder extends string> = {
  table: ReactTable<TData>
  filters: { orderBy?: TOrder; orderDir?: OrderDir; email?: string }
  onOrderChange: (orderBy?: TOrder, orderDir?: OrderDir) => void
  onEmailChange: (email: string) => void
  affiliate: boolean
  mode?: "default" | "top"
  hideOrder?: boolean
  placeholder?: string
  rightActions?: ReactNode
  leftActions?: ReactNode
  orderOptions?: TOrder[]
}

export const TableTop = <TData, TOrder extends string>({
  table,
  filters,
  onOrderChange,
  onEmailChange,
  affiliate,
  hideOrder = false,
  placeholder = "Filter emails...",
  rightActions,
  leftActions,
  orderOptions,
}: TableProps<TData, TOrder>) => {
  const iconHiddenAt = hideOrder ? "lg:hidden" : "xl:hidden"
  const textVisibleAt = hideOrder ? "hidden lg:flex" : "hidden xl:flex"

  return (
    <div className="py-4 grid grid-cols-1 gap-3 xl:flex xl:items-center xl:justify-between">
      {/* Search Input: Full width until xl */}
      <div className="w-full xl:w-auto xl:flex xl:items-center xl:gap-3">
        <div className="w-full xl:w-[280px] flex-shrink-0">
          <SearchInput
            value={filters.email ?? ""}
            onChange={onEmailChange}
            placeholder={placeholder}
            className="w-full"
          />
        </div>
        {leftActions && (
          <div className="w-full xl:w-auto mt-2 xl:mt-0 flex-shrink-0">
            {leftActions}
          </div>
        )}
      </div>
      {/* 🟢 Actions Group: grid on mobile/tablet, flex on xl */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center xl:gap-3">
        {!hideOrder && (
          <div
            className={rightActions ? "col-span-1" : "col-span-2 sm:col-span-1"}
          >
            <OrderSelect
              value={filters}
              onChange={onOrderChange}
              affiliate={affiliate}
              options={orderOptions as OrderBy[]}
            />
          </div>
        )}

        {rightActions && (
          // 🟢 Spans full width on mobile, auto on sm+
          <div className="col-span-2 sm:col-span-1 sm:w-auto">
            {rightActions}
          </div>
        )}

        {!affiliate && (
          <div className="col-span-2 sm:col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-2 xl:px-4"
                >
                  <Settings2 className={`h-4 w-4 ${iconHiddenAt}`} />
                  <div className={`${textVisibleAt} items-center gap-2`}>
                    Columns <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                      className="capitalize"
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  )
}
