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
export const PRIVILEGE_RECEPTION_METRIC = 'View Reception Metrics';
export const PRIVILIGE_TRIAGE_METRIC = 'View Triage Metrics';
export const PRIVILEGE_CLINICIAN_METRIC = 'View Clinician Metrics';
export const PRIVILEGE_RECEPTION_QUEUE_LIST = 'View Reception Queuelist';
export const PRIVILEGE_TRIAGE_QUEUE_LIST = 'View Triage Queuelist';
export const PRIVILEGE_CLINICIAN_QUEUE_LIST = 'View Clinician Queuelist';
