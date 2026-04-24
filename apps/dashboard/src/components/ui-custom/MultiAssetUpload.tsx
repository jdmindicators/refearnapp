"use client"
import React, { useRef, useEffect, useState } from "react"
import { useAtom, useSetAtom } from "jotai"
import { uploadsAtom, removeFileAtom } from "@/store/UploadAtom"
import { FileUploadRef } from "@/components/ui-custom/FileUploadRef"
import { X, Image as ImageIcon, Loader2 } from "lucide-react"
import { deleteOrganizationLogo } from "@/app/(organization)/(auth)/create-company/action"

export function MultiAssetUpload({
  uploadId,
  onImagesChange,
}: {
  uploadId: string
  onImagesChange: (urls: string[]) => void
}) {
  const [allUploads] = useAtom(uploadsAtom)
  const removeFile = useSetAtom(removeFileAtom)
  const fileRef = useRef<FileUploadRef>(null)

  // Track which IDs are currently being deleted from Cloudflare
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  const currentNamespace = allUploads[uploadId] || { files: [] }
  const lastNotifiedRef = useRef<string>("")

  useEffect(() => {
    const successUrls = currentNamespace.files
      .filter((f) => f.status === "success" && f.url)
      .map((f) => f.url as string)
    const urlsString = JSON.stringify(successUrls)

    if (urlsString !== lastNotifiedRef.current) {
      lastNotifiedRef.current = urlsString
      onImagesChange(successUrls)
    }
  }, [currentNamespace.files, onImagesChange])

  const handleDelete = async (fileId: string, url?: string) => {
    // 1. If it has a URL, delete from Cloudflare R2 first
    if (url) {
      setDeletingIds((prev) => new Set(prev).add(fileId))
      try {
        await deleteOrganizationLogo(url)
      } catch (error) {
        console.error("Failed to delete from storage:", error)
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev)
          next.delete(fileId)
          return next
        })
      }
    }

    // 2. Remove from global Jotai state
    removeFile(uploadId, fileId)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {currentNamespace.files.map((file) => {
          const isDeleting = deletingIds.has(file.id)
          const isUploading =
            file.status !== "success" && file.status !== "error"

          return (
            <div
              key={file.id}
              className="relative aspect-square border rounded-md bg-muted flex items-center justify-center overflow-hidden group"
            >
              {file.status === "success" && file.url ? (
                <>
                  <img
                    src={file.url}
                    className={`object-cover w-full h-full transition-opacity ${isDeleting ? "opacity-40" : "opacity-100"}`}
                    alt="asset"
                  />
                  {isDeleting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                      <Loader2 className="animate-spin h-5 w-5 text-destructive" />
                    </div>
                  )}
                </>
              ) : file.status === "error" ? (
                <div className="text-[10px] text-red-500 p-2 text-center">
                  Failed
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5 text-primary" />
                  <span className="text-[10px] text-muted-foreground">
                    Uploading...
                  </span>
                </div>
              )}

              {/* Delete Button - Hidden while uploading or deleting */}
              {!isUploading && !isDeleting && (
                <button
                  type="button"
                  onClick={() => handleDelete(file.id, file.url)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )
        })}

        <button
          type="button"
          onClick={() => fileRef.current?.openFilePicker()}
          className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center hover:bg-muted/50 transition-colors"
        >
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
          <span className="text-[10px] mt-1 text-muted-foreground">
            Add Asset
          </span>
        </button>
      </div>

      <div className="hidden">
        <FileUploadRef
          ref={fileRef}
          uploadId={uploadId}
          type="image"
          affiliate={false}
          maxFiles={10}
          path="marketing-assets"
        />
      </div>
    </div>
  )
}
