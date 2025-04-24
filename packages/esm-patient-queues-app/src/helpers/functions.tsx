import React from 'react';
import dayjs from 'dayjs';
import { restBaseUrl } from '@openmrs/esm-framework';
import debounce from 'lodash-es/debounce';
import { mutate } from 'swr';
import { Group, InProgress } from '@carbon/react/icons';
import { PatientQueue } from '../types/patient-queues';
import { getGlobalStore } from '@openmrs/esm-framework';


export type amPm = 'AM' | 'PM';


export const buildStatusString = (status: string) => {
  if (!status) {
    return '';
  }
  if (status === 'pending') {
    return `${status}`;
  } else if (status === 'picked') {
    return `Attending`;
  } else if (status === 'completed') {
    return `Finished`;
  }
};

export const trimVisitNumber = (visitNumber: string) => {
  if (!visitNumber) {
    return;
  }
  return visitNumber.substring(15);
};

export const formatWaitTime = (dateCreated: string, t) => {
  if (!dateCreated) return t('unknown', 'Unknown');

  const now = dayjs();
  const createdTime = dayjs(dateCreated);
  const diffInMinutes = now.diff(createdTime, 'minute');

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60; // Get the remainder after extracting hours

  if (hours > 0) {
    return `${hours} ${t('hoursAnd', 'hours and')} ${minutes} ${t('minutes', 'minutes')}`;
  } else {
    return `${minutes} ${t('minutes', 'minutes')}`;
  }
};

export const getTagColor = (waitTime: string) => {
  const num = parseInt(waitTime);
  if (num <= 30) {
    return 'green';
  } else if (num > 30 && num <= 45) {
    return 'orange';
  } else {
    return 'red';
  }
};

export const getProviderTagColor = (entryProvider: string, loggedInProviderName: string) => {
  if (entryProvider === loggedInProviderName) {
    return '#07a862';
  } else {
    return '#942509';
  }
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


export const convertTime12to24 = (time12h, timeFormat: amPm) => {
  let [hours, minutes] = time12h.split(':');

  if (hours === '12' && timeFormat === 'AM') {
    hours = '00';
  }

  if (timeFormat === 'PM') {
    hours = hours === '12' ? hours : parseInt(hours, 10) + 12;
  }

  return [hours, minutes];
};


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

export interface PageableResult<ResultType> {
  results: ResultType[];
  links: ResultLink[] | null;
  totalCount: number | null;
}

export interface ResultLink {
  rel: string;
  uri: string;
}

export interface PagingCriteria {
  startIndex?: number | null;
  limit?: number | null;
}


export enum ResourceRepresentation {
  Default = 'default',
  Full = 'full',
  REF = 'ref',
}

export interface ResourceFilterCriteria extends PagingCriteria {
  v?: ResourceRepresentation | null | string;
  q?: string | null;
  totalCount?: boolean | null;
  limit?: number | null;
  sort?: string;
}

export function toQueryParams<T extends ResourceFilterCriteria>(
  filterCriteria?: T | null,
  skipEmptyString = true,
): string {
  if (!filterCriteria) return '';
  const queryParams: string = Object.keys(filterCriteria)
    ?.map((key) => {
      const value = filterCriteria[key];
      return (skipEmptyString && (value === false || value === true ? true : value)) ||
        (!skipEmptyString && (value === '' || (value === false || value === true ? true : value)))
        ? `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
        : null;
    })
    .filter((o) => o != null)
    .join('&');
  return queryParams.length > 0 ? '?' + queryParams : '';
}



export function getPatientQueueWaitingList() {
  return getGlobalStore<{ queue: PatientQueue[] }>('patientQueueWaitingList', { queue: [] });
}

// Patient Queue stores
export const updatePatientQueueWaitingList = (queue: PatientQueue[]) => {
  const store = getPatientQueueWaitingList();
  store.setState({ queue });
};