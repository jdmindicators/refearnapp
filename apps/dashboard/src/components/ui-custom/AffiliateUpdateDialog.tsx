"use client"
import React, { useState } from "react"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import { TextareaField } from "@/components/Auth/FormFields"
import { MultiAssetUpload } from "@/components/ui-custom/MultiAssetUpload"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { useAppMutation } from "@/hooks/useAppMutation"
import { broadcastTeamAffiliateUpdate } from "@/app/(organization)/organization/[orgId]/teams/dashboard/affiliates/action"
import { broadcastAffiliateUpdate } from "@/app/(organization)/organization/[orgId]/dashboard/affiliates/action"
import { MultiAffiliateSelector } from "@/components/ui-custom/MultiAffiliateSelector"

type Props = {
  open: boolean
  onOpenChange: (o: boolean) => void
  orgId: string
  isTeam?: boolean
}

export function AffiliateUpdateDialog({
  open,
  onOpenChange,
  orgId,
  isTeam = false,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const form = useForm({ defaultValues: { message: "" } })

  const broadcastAction = isTeam
    ? broadcastTeamAffiliateUpdate
    : broadcastAffiliateUpdate

  const mutation = useAppMutation(broadcastAction, {
    onSuccess: (res) => {
      if (res.ok) {
        onOpenChange(false)
        form.reset()
        setSelectedIds([])
        setImageUrls([])
      }
    },
  })

  const onSubmit = (data: { message: string }) => {
    mutation.mutate({
      orgId,
      message: data.message,
      imageUrls,
      affiliateIds: selectedIds,
    })
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Affiliate Update"
      description="Send a message and marketing resources to your affiliates."
      confirmText="Send Update"
      confirmLoading={mutation.isPending}
      onConfirm={form.handleSubmit(onSubmit)}
      affiliate={false}
    >
      <Form {...form}>
        {/* 🟢 Internal Scroll Container
            max-h-[calc(100vh-300px)]: Subtracts space for Header + Footer
            overflow-y-auto: Enables scroll only when content exceeds height
            px-1: Prevents focus rings from being cut off on the sides
        */}
        <div className="max-h-[60vh] overflow-y-auto px-1 pr-3 custom-scrollbar">
          <div className="space-y-6 pb-4">
            {" "}
            {/* Added pb-4 so the last image isn't flush against the scroll edge */}
            {/* Section 1: Recipients */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                1. Select Recipients
              </label>
              <p className="text-[10px] text-muted-foreground">
                Defaults to all active affiliates if none are selected.
              </p>
              <MultiAffiliateSelector
                orgId={orgId}
                isTeam={isTeam}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            </div>
            {/* Section 2: Message */}
            <div className="space-y-2">
              <TextareaField
                control={form.control}
                name="message"
                label="2. Message Content"
                placeholder="Write your update here..."
                rows={4}
                affiliate={false}
              />
            </div>
            {/* Section 3: Assets */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                3. Marketing Assets
              </label>
              <p className="text-[10px] text-muted-foreground mb-2">
                Attached images will be displayed in the email.
              </p>
              <MultiAssetUpload
                uploadId="affiliate-broadcast"
                onImagesChange={setImageUrls}
              />
            </div>
          </div>
        </div>
      </Form>
    </AppDialog>
  )
}
