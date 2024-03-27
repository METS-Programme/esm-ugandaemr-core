import { OpenmrsResource } from '@openmrs/esm-framework';
import { MappedQueuePriority } from '../active-visits/active-visits-table.resource';

export const getTagType = (priority: string) => {
  switch (priority as MappedQueuePriority) {
    case 'Emergency':
      return 'red';
    case 'Not Urgent':
      return 'green';
    default:
      return 'gray';
  }
};

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

export const formatWaitTime = (waitTime: string, t) => {
  const num = parseInt(waitTime);
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  if (rhours > 0) {
    return rhours + ' ' + `${t('hoursAnd', 'hours and ')}` + rminutes + ' ' + `${t('minutes', 'minutes')}`;
  } else {
    return rminutes + ' ' + `${t('minutes', 'minutes')}`;
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

export const getGender = (gender, t) => {
  switch (gender) {
    case 'M':
      return t('male', 'Male');
    case 'F':
      return t('female', 'Female');
    case 'O':
      return t('other', 'Other');
    case 'U':
      return t('unknown', 'Unknown');
    default:
      return gender;
  }
};

export const getProviderTagColor = (entryProvider: string, loggedInProviderName: string) => {
  if (entryProvider === loggedInProviderName) {
    return '#07a862';
  } else {
    return '#942509';
  }
};
