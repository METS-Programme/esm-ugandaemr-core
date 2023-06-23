export interface PatientChartProps {
  patientUuid: string;
}

export const spaBasePath = `${window.spaBase}/home`;

export enum SearchTypes {
  BASIC = 'basic',
  ADVANCED = 'advanced',
  SEARCH_RESULTS = 'search_results',
  SCHEDULED_VISITS = 'scheduled-visits',
  VISIT_FORM = 'visit_form',
  QUEUE_SERVICE_FORM = 'queue_service_form',
  QUEUE_ROOM_FORM = 'queue_room_form',
}

export interface WaitTime {
  metric: string;
  averageWaitTime: string;
}
