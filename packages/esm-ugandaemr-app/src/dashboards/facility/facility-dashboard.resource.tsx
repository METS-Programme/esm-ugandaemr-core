import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { openmrsFetch } from '@openmrs/esm-framework';
import { TabPanel } from '@carbon/react';
import React from 'react';
import { pivotRender } from './facility-dashboard.component';
type saveDashboardRequest = {
  name: string;
  description: string;
  items: Array<string>;
};

export function useGetSaveReports() {
  const apiUrl = `/ws/rest/v1/dashboardReport/`;
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

export function useSaveDashboard(params: saveDashboardRequest) {
  const apiUrl = params.name ? `/ws/rest/v1/dashboard` : null;
  const abortController = new AbortController();

  const fetcher = () =>
    openmrsFetch(apiUrl, {
      method: 'POST',
      signal: abortController.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        name: params.name,
        description: params?.description,
        items: params?.items,
      },
    });

  const { data, error, isLoading, isValidating } = useSWR<
    {
      data: {
        results: any;
      };
    },
    Error
  >(apiUrl, fetcher);

  return {
    hasSavedDashboard: !!data,
    isErrorInSavingDashboard: error,
    isLoadingSaveDashboard: isLoading,
    isValidatingSaveDashboard: isValidating,
  };
}

export async function saveDashboard(params: saveDashboardRequest) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/dashboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      name: params.name,
      description: params?.description,
      items: params?.items,
    },
  });
}

export function useGetSavedDashboards() {
  const apiUrl = `/ws/rest/v1/dashboard`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: any } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  let dashboardArray = [];
  if (data) {
    let savedDashboards = mapDataElements(data?.data['results'], 'dashboards');
    savedDashboards?.map((dashboardItem: savedDashboard) => {
      dashboardArray.push({
        label: dashboardItem.name,
        description: dashboardItem.description,
        panel: <TabPanel>{dashboardItem?.items?.map((item, index) => pivotRender(item, index))}</TabPanel>,
        dashboardItems: dashboardItem?.items,
      });
    });
  }

  return {
    dashboardArray,
    isErrorInSavedDashboard: error,
    isLoadingSavedDashboard: isLoading,
    mutate,
  };
}

export function mapDataElements(dataArray: Array<Record<string, string>>, category?: string) {
  let arrayToReturn: Array<savedReport | savedDashboard> = [];
  if (dataArray) {
    if (category === 'dashboards') {
      dataArray.map((savedDashboard: Record<string, string>, index) => {
        arrayToReturn.push({
          uuid: savedDashboard.uuid,
          name: savedDashboard.name,
          description: savedDashboard.description,
          items: savedDashboard.items,
        });
      });
    } else {
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
  }

  return arrayToReturn;
}
