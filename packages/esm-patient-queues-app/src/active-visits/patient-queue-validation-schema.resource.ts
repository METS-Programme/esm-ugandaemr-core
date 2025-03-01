import { z } from 'zod';

const visitSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  startDatetime: z.string().min(1, 'Start date is required'),
  visitType: z.string().min(1, 'Visit type is required'),
  location: z.string().min(1, 'Location is required'),
  attributes: z.array(z.object({})).nullable(),
});

export const createQueueEntrySchema = z.object({
  patient: z.string().optional(),
  provider: z.string().min(1, 'Provider is required'),
  locationFrom: z.string().optional(),
  locationTo: z.string().min(1, 'Destination is required'),
  status: z.string().optional(),
  priority: z.string().optional(),
  priorityComment: z.string().optional(),
  comment: z.string().optional(),
  queueRoom: z.string().optional(),
});

export type CreateQueueEntryFormData = z.infer<typeof createQueueEntrySchema>;

export type StartVisitFormData = z.infer<typeof visitSchema>;
