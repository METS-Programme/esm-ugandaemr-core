import useSWR from 'swr';
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
  links: Link23[];
  resourceVersion: string;
}

export interface Patient {
  uuid: string;
  display: string;
  identifiers: Identifier[];
  person: Person;
  voided: boolean;
  links: Link6[];
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
  links: Link5[];
  resourceVersion: string;
}

export interface PreferredName {
  uuid: string;
  display: string;
  links: Link2[];
}

export interface Link2 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface PreferredAddress {
  uuid: string;
  display: any;
  links: Link3[];
}

export interface Link3 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Attribute {
  uuid: string;
  display: string;
  links: Link4[];
}

export interface Link4 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Link5 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Link6 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Program {
  name: string;
  uuid: string;
  retired: boolean;
  description: string;
  concept: Concept;
  allWorkflows: AllWorkflow[];
  outcomesConcept: any;
  links: Link18[];
  resourceVersion: string;
}

export interface Concept {
  uuid: string;
  display: string;
  links: Link7[];
}

export interface Link7 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface AllWorkflow {
  uuid: string;
  concept: Concept2;
  description: any;
  retired: boolean;
  states: State[];
  links: Link17[];
  resourceVersion: string;
}

export interface Concept2 {
  uuid: string;
  display: string;
  links: Link8[];
}

export interface Link8 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface State {
  uuid: string;
  description: any;
  retired: boolean;
  concept: Concept3;
  links: Link16[];
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
  links: Link15[];
  resourceVersion: string;
}

export interface Name {
  display: string;
  uuid: string;
  name: string;
  locale: string;
  localePreferred: boolean;
  conceptNameType: string;
  links: Link9[];
  resourceVersion: string;
}

export interface Link9 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Datatype {
  uuid: string;
  display: string;
  links: Link10[];
}

export interface Link10 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface ConceptClass {
  uuid: string;
  display: string;
  links: Link11[];
}

export interface Link11 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Name2 {
  uuid: string;
  display: string;
  links: Link12[];
}

export interface Link12 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Description {
  uuid: string;
  display: string;
  links: Link13[];
}

export interface Link13 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Answer {
  uuid: string;
  display: string;
  links: Link14[];
}

export interface Link14 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Link15 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Link16 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Link17 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Link18 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface State2 {
  state: State3;
  uuid: string;
  startDate: string;
  endDate: any;
  voided: boolean;
  links: Link21[];
}

export interface State3 {
  uuid: string;
  retired: boolean;
  concept: Concept4;
  links: Link20[];
}

export interface Concept4 {
  uuid: string;
  display: string;
  links: Link19[];
}

export interface Link19 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Link20 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Link21 {
  rel: string;
  uri: string;
  resourceAlias: string;
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
  links: Link22[];
}

export interface Link22 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Link23 {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export const useCarePrograms = (patientUuid: string) => {
  const url = `/ws/rest/v1/programenrollment?patient=${patientUuid}&v=full`;
  const { data, error, isLoading, isValidating } = useSWR<{ data: Array<Result> }>(url, openmrsFetch);

  return {
    carePrograms: data?.data ?? [],
    error,
    isLoading,
    isValidating,
  };
};
