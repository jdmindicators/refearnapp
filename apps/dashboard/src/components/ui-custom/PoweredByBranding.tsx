import React from "react"

interface PoweredByBrandingProps {
  color?: string
  isLoading: boolean
  showBranding: boolean
}

export const PoweredByBranding = ({
  color,
  isLoading,
  showBranding,
}: PoweredByBrandingProps) => {
  if (!isLoading && !showBranding) return null

  if (isLoading) {
    return (
      <div className="mt-8 mb-4 flex items-center justify-center gap-2 animate-pulse h-4">
        <div
          className="h-3 w-16 rounded-sm opacity-20"
          style={{ backgroundColor: color || "currentColor" }}
        />
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-full opacity-20"
            style={{ backgroundColor: color || "currentColor" }}
          />
          <div
            className="h-3 w-20 rounded-sm opacity-25"
            style={{ backgroundColor: color || "currentColor" }}
          />
        </div>
      </div>
    )
  }

  const utmLink =
    "https://refearnapp.com?utm_source=affiliate_auth&utm_medium=powered_by&utm_campaign=viral_loop"

  return (
    <div
      className="mt-8 mb-4 text-center text-xs flex items-center justify-center gap-1.5 opacity-70 transition-opacity duration-300 h-4"
      style={{ color }}
    >
      <span>Powered by</span>
      <a
        href={utmLink}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-1 font-semibold hover:opacity-80 transition-opacity"
        style={{ color: "inherit" }}
      >
        <img src="/refearnapp.svg" alt="RefEarnApp Logo" className="w-4 h-4" />
        RefearnApp
      </a>
    </div>
  )
}
