import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import useSWR from "swr";

export interface Notifications {
  uuid: string;
  display: string;
  alertId: number;
  alertRead: boolean;
  dateToExpire: string;
  dateCreated: string;
  timeDifference: string;
}

export function useGetAlerts() {
  const apiURL = `${restBaseUrl}/alert?v=full&limit=200`;
  const { data, error, isLoading } = useSWR<
    { data: { results: Array<Notifications> } },
    Error
  >(apiURL, openmrsFetch);

  const alerts = data?.data?.results.filter((alert) => alert.dateToExpire !== null) || [];

  alerts.forEach((notification) => {
    const dateCreated = new Date(notification.dateCreated);
    const currentDate = new Date();
    const timeDifference = calculateTimeDifference(dateCreated, currentDate);
    notification.timeDifference = timeDifference;
  });

  return {
    alerts,
    isLoading,
    isError: error,
  };
}

function calculateTimeDifference(date1: Date, date2: Date): string {
  const timeDifferenceInMs = date2.getTime() - date1.getTime();
  const seconds = Math.floor(timeDifferenceInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }
}
