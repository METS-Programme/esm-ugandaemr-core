import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const visitSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  startDatetime: z.string().min(1, 'Start date is required'),
  visitType: z.string().min(1, 'Visit type is required'),
  location: z.string().min(1, 'Location is required'),
  attributes: z.array(z.object({})).nullable(),
});

export const createQueueEntrySchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  provider: z.string().min(1, 'Provider is required'),
  locationFrom: z.string().min(1, 'Origin location is required'),
  locationTo: z.string().min(1, 'Destination location is required'),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().optional(),
  priorityComment: z.string().optional(),
  comment: z.string().optional(),
  queueRoom: z.string().min(1, 'Queue room is required'),
});

export type CreateQueueEntryFormData = z.infer<typeof createQueueEntrySchema>;

export type StartVisitFormData = z.infer<typeof visitSchema>;
