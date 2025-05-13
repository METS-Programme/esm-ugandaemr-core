import { Group, InProgress } from '@carbon/react/icons';
import React from 'react';
import { restBaseUrl } from '@openmrs/esm-framework';
import debounce from 'lodash-es/debounce';
import { mutate } from 'swr';

export function extractErrorMessagesFromResponse(errorObject) {
  const fieldErrors = errorObject?.responseBody?.error?.fieldErrors;
  if (!fieldErrors) {
    return [errorObject?.responseBody?.error?.message ?? errorObject?.message];
  }
  return Object.values(fieldErrors).flatMap((errors: Array<Error>) => errors.map((error) => error.message));
}

export const QueueStatus = { Completed: 'completed', Pending: 'pending', Picked: 'picked' };

export enum QueueEnumStatus {
  COMPLETED = 'COMPLETED',
  PICKED = 'PICKED',
  PENDING = 'PENDING',
}

const refreshDashboardMetrics = debounce(
  () =>
    mutate((key) => typeof key === 'string' && key.startsWith(`${restBaseUrl}/patientqueue`), undefined, {
      revalidate: true,
    }),
  300,
);

export const handleMutate = (url: string) => {
  mutate((key) => typeof key === 'string' && key.startsWith(url), undefined, {
    revalidate: true,
  });
  refreshDashboardMetrics();
};




function StatusIcon({ status }) {
  switch (status) {
    case 'pending':
      return <InProgress size={16} />;
    case 'picked':
      return <Group size={16} />;
    case 'completed':
      return <Group size={16} />;
    default:
      return null;
  }
}

export default StatusIcon;