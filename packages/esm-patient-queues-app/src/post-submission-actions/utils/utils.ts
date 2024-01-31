export interface ProgramEnrollmentPayload {
  patient: string;
  program: string;
  dateEnrolled: string | Date;
  dateCompleted: string | Date | null;
  location: string;
}
export function CreateProgramEnrollmentPayload(
  programUuid: string,
  locationUuid: string,
  patientUuid: string,
  dateEnrolled: Date | string,
  dateCompleted: Date | null,
): ProgramEnrollmentPayload {
  return {
    patient: patientUuid,
    program: programUuid,
    dateEnrolled: dateEnrolled,
    dateCompleted: dateCompleted ?? null,
    location: locationUuid,
  };
}
