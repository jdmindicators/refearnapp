import { useAtom } from "jotai"
import { registrationSettingsAtom } from "@/store/RegistrationSettingsAtom"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const RegistrationFieldsCustomization = () => {
  const [settings, setSettings] = useAtom(registrationSettingsAtom)

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
      <h3 className="font-semibold text-sm">Registration Form Fields</h3>

      <div className="flex items-center justify-between">
        <Label htmlFor="askWebsiteUrl">Ask for Website URL</Label>
        <Switch
          id="askWebsiteUrl"
          checked={settings.askWebsiteUrl}
          onCheckedChange={(val) =>
            setSettings((prev) => ({ ...prev, askWebsiteUrl: val }))
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="askPromotionMethod">Ask for Promotion Method</Label>
        <Switch
          id="askPromotionMethod"
          checked={settings.askPromotionMethod}
          onCheckedChange={(val) =>
            setSettings((prev) => ({ ...prev, askPromotionMethod: val }))
          }
        />
      </div>

      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="showTos">Show Terms of Service</Label>
          <Switch
            id="showTos"
            checked={settings.showTos}
            onCheckedChange={(val) =>
              setSettings((prev) => ({ ...prev, showTos: val }))
            }
          />
        </div>
        {settings.showTos && (
          <Input
            placeholder="ToS URL (https://...)"
            value={settings.tosUrl}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, tosUrl: e.target.value }))
            }
            className="text-xs"
          />
        )}
      </div>
    </div>
  )
}
