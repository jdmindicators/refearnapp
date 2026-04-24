import { RichTextEditor } from "@/components/ui-custom/RichTextEditor"
import { useEffect, useState } from "react"
import { Pencil } from "lucide-react"
import { IsRichTextEmpty } from "@/util/IsRichTextEmpty"
import { useAtom } from "jotai"
import { notesCustomizationAtom } from "@/store/AuthCustomizationAtom"

type NotesKey =
  | "customNotesLogin"
  | "customNotesSignup"
  | "customNotesOnboarding"

const DefaultAuthHeader = ({ name }: { name: NotesKey }) => {
  if (name === "customNotesLogin") {
    return (
      <>
        <h2 className="text-2xl font-bold text-center">Welcome back</h2>
        <p className="text-center text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </>
    )
  }

  if (name === "customNotesOnboarding") {
    return (
      <>
        <h2 className="text-2xl font-bold text-center">Complete Application</h2>
        <p className="text-center text-muted-foreground">
          Finalize your profile to get started
        </p>
      </>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center">Create An Account</h2>
      <p className="text-center text-muted-foreground">
        Enter Your Information to Sign Up
      </p>
    </>
  )
}

export const InlineNotesEditor = ({ name }: { name: NotesKey }) => {
  const [notes, setNotes] = useAtom(notesCustomizationAtom)

  // FIX: Access the content dynamically using the 'name' key
  const currentContent = notes[name] || ""

  const [isEditing, setIsEditing] = useState(false)
  const [tempContent, setTempContent] = useState<string>(currentContent)
  useEffect(() => {
    setTempContent(currentContent)
  }, [currentContent])

  if (isEditing) {
    return (
      <div className="border rounded p-4 bg-background">
        <RichTextEditor content={tempContent} onChange={setTempContent} />
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded font-medium"
            onClick={() => {
              setNotes({
                ...notes,
                [name]: tempContent,
              })
              setIsEditing(false)
            }}
          >
            Apply Changes
          </button>
          <button
            className="px-3 py-1.5 border rounded text-xs font-medium"
            onClick={() => {
              setTempContent(currentContent)
              setIsEditing(false)
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const showDefault = IsRichTextEmpty(currentContent)

  return (
    <div className="group relative">
      <div className="flex-1">
        {showDefault ? (
          <DefaultAuthHeader name={name} />
        ) : (
          <div
            className="rich-text-preview"
            dangerouslySetInnerHTML={{ __html: currentContent }}
          />
        )}
      </div>
      <button
        className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  )
}
