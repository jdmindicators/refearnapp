import React from "react"
import { Badge } from "@/components/ui/badge"
import { Globe, Mail, User, Share2, MessageSquare, Target } from "lucide-react"

interface AffiliateDetailsProps {
  data: any
}

export const AffiliateDetails: React.FC<AffiliateDetailsProps> = ({ data }) => {
  const InfoItem = ({ icon: Icon, label, value, isLink = false }: any) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      {isLink && value ? (
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-slate-900 underline decoration-dashed decoration-slate-300 underline-offset-4 cursor-help hover:text-indigo-600 transition-colors truncate"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-slate-700 truncate">
          {value || "Not provided"}
        </p>
      )}
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header Profile Section */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
        <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {data.name}
          </h3>
          <p className="text-sm text-slate-500">{data.email}</p>
        </div>
      </div>

      {/* Core Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <InfoItem icon={Mail} label="Contact Email" value={data.email} />
        <InfoItem
          icon={Globe}
          label="Website / Blog"
          value={data.websiteUrl}
          isLink
        />
        <InfoItem
          icon={Share2}
          label="Social Handle"
          value={data.socialHandle}
        />
      </div>

      {/* Promotion Strategy */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <MessageSquare className="w-3 h-3" />
          Promotion Strategy
        </div>

        <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-5 space-y-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
              Preferred Channels
            </p>
            <div className="flex flex-wrap gap-2">
              {data.promotionMethods?.map((method: string) => (
                <Badge
                  key={method}
                  variant="secondary"
                  className="bg-white border-slate-200 text-slate-600 capitalize py-1 px-3"
                >
                  {method.replace("_", " ")}
                </Badge>
              )) || (
                <span className="text-xs text-slate-400 italic">
                  No methods selected
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
              Detailed Plan
            </p>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap italic">
              &ldquo;
              {data.promotionDetails ||
                "The affiliate has not provided a written description of their promotion plan."}
              &rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
