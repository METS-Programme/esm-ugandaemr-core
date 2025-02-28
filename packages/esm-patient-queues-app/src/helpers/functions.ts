import dayjs from 'dayjs';

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

  console.log('entryProvider', entryProvider, 'loggedInProviderName', loggedInProviderName);
  if (entryProvider === loggedInProviderName) {
    return '#07a862';
  } else {
    return '#942509';
  }
};
