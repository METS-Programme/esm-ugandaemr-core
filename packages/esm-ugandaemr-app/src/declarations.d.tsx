declare module '*.css';
declare module '*.scss';
declare module '*.png';

type savedReport = {
  id: string;
  label: string;
  description: string;
  type: string;
  columns: string;
  rows: string;
  aggregator: string;
  report_request_object: string;
};

type savedDashboard = {
  uuid: string;
  name: string;
  description: string;
  items: any;
};
