import dayjs from 'dayjs';

// module name
export const moduleName = '@ugandaemr/esm-patient-queues-app';

export const spaRoot = window['getOpenmrsSpaBase'];
export const basePath = '/outpatient';
export const spaBasePath = `${window.spaBase}/home`;
export const omrsDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';
export const startOfDay = dayjs(new Date().setUTCHours(0, 0, 0, 0)).format(omrsDateFormat);
export const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// privileges
export const PRIVILEGE_CHECKIN = 'App: ugandaemrpoc.findPatient';
export const PRIVILEGE_RECEPTION_METRIC = 'App: ugandaemrpoc.findPatient';
export const PRIVILIGE_TRIAGE_METRIC = 'App: ugandaemrpoc.triage';
export const PRIVILEGE_CLINICIAN_METRIC = 'App: patientqueueing.providerDashboard';
export const PRIVILEGE_RECEPTION_QUEUE_LIST = 'App: ugandaemrpoc.findPatient';
export const PRIVILEGE_TRIAGE_QUEUE_LIST = 'App: ugandaemrpoc.triage';
export const PRIVILEGE_CLINICIAN_QUEUE_LIST = 'App: patientqueueing.providerDashboard';
