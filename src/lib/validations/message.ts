import { z } from 'zod';

export const singleMessageValidatingSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const messageArrayValidationSchema = z.array(
  singleMessageValidatingSchema
);

export type Message = z.infer<typeof singleMessageValidatingSchema>;
