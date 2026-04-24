import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { SelectFieldProps } from "@/components/ui-custom/SelectFields"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
export const MultiSelectField = ({
  control,
  name,
  label,
  options,
  affiliate = false,
  icon: Icon,
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValues = Array.isArray(field.value) ? field.value : []

        const handleSelect = (val: string) => {
          if (!selectedValues.includes(val)) {
            field.onChange([...selectedValues, val])
          }
        }

        const handleRemove = (val: string) => {
          field.onChange(selectedValues.filter((v: string) => v !== val))
        }

        return (
          <FormItem>
            <FormLabel className={fieldState.error ? "text-destructive" : ""}>
              {label}
            </FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedValues.map((val: string) => {
                const label = options.find((o) => o.value === val)?.label || val
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemove(val)}
                    />
                  </Badge>
                )
              })}
            </div>
            <FormControl>
              <div className="relative">
                {Icon && (
                  <Icon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                )}
                <Select onValueChange={handleSelect} value="">
                  <SelectTrigger
                    affiliate={affiliate}
                    className={`w-full border ${Icon ? "pl-10" : ""}`}
                  >
                    <SelectValue placeholder="Add method..." />
                  </SelectTrigger>
                  <SelectContent affiliate={affiliate}>
                    {options
                      .filter((opt) => !selectedValues.includes(opt.value))
                      .map((opt) => (
                        <SelectItem
                          affiliate={affiliate}
                          key={opt.value}
                          value={opt.value}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
            {fieldState.error && (
              <div className="text-destructive text-sm font-medium mt-1">
                {fieldState.error.message}
              </div>
            )}
          </FormItem>
        )
      }}
    />
  )
}
