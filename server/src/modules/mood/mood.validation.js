import { z } from 'zod';

const VALID_EMOTIONS = [
  'happiness',
  'sadness',
  'anger',
  'calm',
  'excitement',
  'anxiety',
  'tired',
  'hopeful',
];

export const createMoodSchema = z.object({
  emotion: z.enum(VALID_EMOTIONS, {
    errorMap: () => ({ message: `Emotion must be one of: ${VALID_EMOTIONS.join(', ')}` }),
  }),
  intensity: z
    .number({ required_error: 'Intensity is required' })
    .int('Intensity must be an integer')
    .min(1, 'Intensity must be at least 1')
    .max(10, 'Intensity must be at most 10'),
  journal: z.string().optional(),
});

export const historyQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().positive().max(100)),
});
