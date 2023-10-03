import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';
import { TabPanel } from '@carbon/react';
import React from 'react';
import { pivotRender } from './user-dashboard.component';
import GridLayout from 'react-grid-layout';
type saveDashboardRequest = {
  name: string;
  description: string;
  items: Array<string>;
};

const layout = [
  { i: 'a', x: 0, y: 0, w: 1, h: 50, isBounded: true },
  { i: 'b', x: 1, y: 0, w: 1, h: 50, isBounded: true },
  { i: 'c', x: 4, y: 0, w: 1, h: 50, isBounded: true },
];

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

  let keysArray = ['a', 'c', 'b'];
  let dashboardItems = [];
  if (data) {
    let savedDashboards = mapDataElements(data?.data['results'], 'dashboards');
    savedDashboards?.map((dashboardItem: savedDashboard) => {
      dashboardItems.push({
        label: dashboardItem.name,
        description: dashboardItem.description,
        panel: (
          <TabPanel>
            <GridLayout className="layout" layout={layout} cols={1} rowHeight={5} width={1200} margin={[10, 10]}>
              {dashboardItem?.items?.map((item, index) => pivotRender(item, index, keysArray))}
            </GridLayout>
          </TabPanel>
        ),
        dashboardItems: dashboardItem?.items,
      });
    });
  }

  return {
    dashboardItems,
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
