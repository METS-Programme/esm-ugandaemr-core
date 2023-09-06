import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';

export function useGetSaveReports() {
  const apiUrl = `/ws/rest/v1/dashboardReport`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: any } }, Error>(
    apiUrl,
    openmrsFetch,
  );
  return {
    savedReports: data ? mapDataElements(data?.data['results']) : [],
    isError: error,
    isLoading: isLoading,
    mutate,
  };
}

export function mapDataElements(dataArray: Array<Record<string, string>>) {
  let arrayToReturn: Array<savedReport> = [];
  if (dataArray) {
    dataArray.map((savedReport: Record<string, string>, index) => {
      arrayToReturn.push({
        id: savedReport.uuid,
        label: savedReport.name,
        description: savedReport?.description,
        type: savedReport?.type,
        columns: savedReport?.columns,
        rows: savedReport?.rows,
        aggregator: savedReport?.aggregator,
        report_request_object: savedReport?.report_request_object,
      });
    });
  }

  return arrayToReturn;
}
