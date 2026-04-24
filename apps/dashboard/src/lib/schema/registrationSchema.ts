import * as z from "zod"

export const registrationSchema = z.object({
  tosUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  privacyPolicyUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
})

export type RegistrationFormValues = z.infer<typeof registrationSchema>
