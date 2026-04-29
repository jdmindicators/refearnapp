"use client"
import { useState, useCallback } from "react"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import { Link as LinkIcon, Copy, ExternalLink, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LinksDialogProps {
  links?: (string | null | undefined)[]
  title?: string
  description?: string
  affiliate?: boolean
  triggerClassName?: string
}

export function LinksDialog({
  links = [],
  title = "Links",
  description = "All the referral links this affiliate has created.",
  affiliate = false,
  triggerClassName,
}: LinksDialogProps) {
  const [open, setOpen] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Filter out null, undefined, or empty strings
  const filteredLinks = Array.isArray(links)
    ? links.filter((l) => l != null && l !== "")
    : []

  const handleCopy = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }, [])

  return (
    <>
      <button
        className={triggerClassName || "p-0 text-blue-600 underline text-sm"}
        onClick={() => setOpen(true)}
      >
        View Links
      </button>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        affiliate={affiliate}
        showFooter={false}
      >
        <div className="space-y-3">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-slate-200 transition-all"
              >
                <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors shrink-0">
                  <LinkIcon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate pr-2">
                    {link}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => handleCopy(link!, index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  
                  <a
                    href={link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-8 w-8 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-500 italic">No links created yet.</p>
            </div>
          )}
        </div>
      </AppDialog>
    </>
  )
}
