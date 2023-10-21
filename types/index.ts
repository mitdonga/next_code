import { z } from 'zod'

export const CodeRequestObject = z.object({
  code: z.string(),
  lang: z.string()
})