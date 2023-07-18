import { openmrsFetch } from '@openmrs/esm-framework';
import { Appointment } from '../../types';

export async function addQueueEntry(
  visitUuid: string,
  patientUuid: string,
  priority: string,
  status: string,
  queueServiceUuid: string,
  appointment: Appointment,
  locationUuid: string,
) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/patientqueue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      patient: patientUuid,
      provider: '',
      locationFrom: locationUuid,
      locationTo: queueServiceUuid !== undefined ? queueServiceUuid : 'Not Set',
      status: status ? status : 'pending',
      encounter: null,
      visitNumber: '',
      priority: 1,
      priorityComment: 'Urgent',
      comment: 'Na',
      queueRoom: queueServiceUuid !== undefined ? queueServiceUuid : 'Not Set',
    },
  });
}

export async function saveAppointment(appointment: Appointment) {
  const abortController = new AbortController();

  await openmrsFetch(`/ws/rest/v1/appointment`, {
    method: 'POST',
    signal: abortController.signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      patientUuid: appointment?.patient.uuid,
      serviceUuid: appointment?.service?.uuid,
      startDateTime: appointment?.startDateTime,
      endDateTime: appointment?.endDateTime,
      appointmentKind: appointment?.appointmentKind,
      locationUuid: appointment?.location?.uuid,
      comments: appointment?.comments,
      status: 'CheckedIn',
      appointmentNumber: appointment?.appointmentNumber,
      uuid: appointment?.uuid,
      providerUuid: appointment?.provider?.uuid,
    },
  });
}
