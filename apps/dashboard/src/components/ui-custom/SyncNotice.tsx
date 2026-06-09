import React from "react"
import { RefreshCw } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SyncNoticeProps {
  className?: string
  intervalText?: string // e.g., "10 minutes"
  shortIntervalText?: string // 🟢 Added for the button text, e.g., "10m"
  dataText?: string
}

export const SyncNotice = ({
  className = "",
  intervalText = "10 minutes",
  shortIntervalText = "10m", // 🟢 Defaults to a clean, tight format
  dataText = "Clicks & signups",
}: SyncNoticeProps) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 px-2 py-1.5 rounded-md border border-slate-100 dark:border-slate-800/60 transition-all cursor-help select-none w-fit flex-shrink-0 ${className}`}
          >
            {/* Pulsing state icon */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <RefreshCw className="h-3 w-3 animate-[spin_6s_linear_infinite] text-slate-400" />

            {/* 🟢 Much more intuitive button text */}
            <span>Updates every {shortIntervalText}</span>
          </button>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          align="start"
          className="max-w-[260px] p-2.5 text-xs bg-white dark:bg-white border border-slate-200/80 shadow-md text-slate-900"
        >
          <p className="font-semibold text-slate-900 mb-0.5">Edge Data Cache</p>
          <p className="text-slate-600 leading-relaxed">
            {dataText} sync every {intervalText} to maintain maximum tracking
            and routing performance.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
