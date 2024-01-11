import useSWR from 'swr';
import groupBy from 'lodash/groupBy';
import { openmrsFetch } from '@openmrs/esm-framework';

export interface Result {
  uuid: string;
  patient: Patient;
  program: Program;
  display: string;
  dateEnrolled: string;
  dateCompleted: any;
  location: any;
  voided: boolean;
  outcome: any;
  states: State2[];
  auditInfo: AuditInfo;
  attributes: any[];
  links: Link[];
  resourceVersion: string;
}

export interface Patient {
  uuid: string;
  display: string;
  identifiers: Identifier[];
  person: Person;
  voided: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface Identifier {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Person {
  uuid: string;
  display: string;
  gender: string;
  age: number;
  birthdate: string;
  birthdateEstimated: boolean;
  dead: boolean;
  deathDate: any;
  causeOfDeath: any;
  preferredName: PreferredName;
  preferredAddress: PreferredAddress;
  attributes: Attribute[];
  voided: boolean;
  birthtime: any;
  deathdateEstimated: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface PreferredName {
  uuid: string;
  display: string;
  links: Link[];
}

export interface PreferredAddress {
  uuid: string;
  display: any;
  links: Link[];
}

export interface Attribute {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Program {
  name: string;
  uuid: string;
  retired: boolean;
  description: string;
  concept: Concept;
  allWorkflows: AllWorkflow[];
  outcomesConcept: any;
  links: Link[];
  resourceVersion: string;
}

export interface Concept {
  uuid: string;
  display: string;
  links: Link[];
}

export interface AllWorkflow {
  uuid: string;
  concept: Concept2;
  description: any;
  retired: boolean;
  states: State[];
  links: Link[];
  resourceVersion: string;
}

export interface Concept2 {
  uuid: string;
  display: string;
  links: Link[];
}

export interface State {
  uuid: string;
  description: any;
  retired: boolean;
  concept: Concept3;
  links: Link[];
  resourceVersion: string;
}

export interface Concept3 {
  uuid: string;
  display: string;
  name: Name;
  datatype: Datatype;
  conceptClass: ConceptClass;
  set: boolean;
  version: any;
  retired: boolean;
  names: Name2[];
  descriptions: Description[];
  mappings: any[];
  answers: Answer[];
  setMembers: any[];
  attributes: any[];
  links: Link[];
  resourceVersion: string;
}

export interface Name {
  display: string;
  uuid: string;
  name: string;
  locale: string;
  localePreferred: boolean;
  conceptNameType: string;
  links: Link[];
  resourceVersion: string;
}

export interface Datatype {
  uuid: string;
  display: string;
  links: Link[];
}

export interface ConceptClass {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Name2 {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Description {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Answer {
  uuid: string;
  display: string;
  links: Link[];
}

export interface State2 {
  state: State3;
  uuid: string;
  startDate: string;
  endDate: any;
  voided: boolean;
  links: Link[];
}

export interface State3 {
  uuid: string;
  retired: boolean;
  concept: Concept4;
  links: Link[];
}

export interface Concept4 {
  uuid: string;
  display: string;
  links: Link[];
}

export interface AuditInfo {
  creator: Creator;
  dateCreated: string;
  changedBy: any;
  dateChanged: any;
}

export interface Creator {
  uuid: string;
  display: string;
  links: Link[];
}

export const useEnrollmentHistory = (patientUuid: string) => {
  const enrollmentHistoryUrl = `/ws/rest/v1/programenrollment?patient=${patientUuid}&v=full`;
  const { data, isValidating, error, isLoading } = useSWR<{ data: { results: Array<Result> } }, Error>(
    enrollmentHistoryUrl,
    openmrsFetch,
  );

  return {
    error: error,
    isLoading: isLoading,
    enrollments: data?.data.results ?? [],
    isValidating,
  };
};
