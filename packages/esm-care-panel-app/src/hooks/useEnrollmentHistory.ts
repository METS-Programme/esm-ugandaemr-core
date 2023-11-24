import useSWR from 'swr';
import groupBy from 'lodash/groupBy';
import { openmrsFetch } from '@openmrs/esm-framework';
import { Result } from './useCarePrograms';

export interface Result {
  uuid: string;
  patient: Patient;
  program: Program;
  display: string;
  dateEnrolled: string;
  dateCompleted: any;
  location: Location;
  voided: boolean;
  outcome: any;
  states: any[];
  auditInfo: AuditInfo2;
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
  outcomesConcept?: OutcomesConcept;
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
  states: any[];
  links: Link[];
  resourceVersion: string;
}

export interface Concept2 {
  uuid: string;
  display: string;
  links: Link[];
}

export interface OutcomesConcept {
  uuid: string;
  display: string;
  name: Name;
  datatype: Datatype;
  conceptClass: ConceptClass;
  set: boolean;
  version: any;
  retired: boolean;
  names: Name2[];
  descriptions: any[];
  mappings: any[];
  answers: Answer[];
  setMembers: any[];
  auditInfo: AuditInfo;
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
  name: string;
  description: string;
  hl7Abbreviation: string;
  retired: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface ConceptClass {
  uuid: string;
  display: string;
  name: string;
  description: string;
  retired: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface Name2 {
  display: string;
  uuid: string;
  name: string;
  locale: string;
  localePreferred: boolean;
  conceptNameType: string;
  links: Link[];
  resourceVersion: string;
}

export interface Answer {
  uuid: string;
  display: string;
  name: Name3;
  datatype: Datatype2;
  conceptClass: ConceptClass2;
  set: boolean;
  version?: string;
  retired: boolean;
  names: Name4[];
  descriptions: Description[];
  mappings: any[];
  answers: Answer2[];
  setMembers: any[];
  attributes: any[];
  links: Link[];
  resourceVersion: string;
}

export interface Name3 {
  display: string;
  uuid: string;
  name: string;
  locale: string;
  localePreferred: boolean;
  conceptNameType: string;
  links: Link[];
  resourceVersion: string;
}

export interface Datatype2 {
  uuid: string;
  display: string;
  links: Link[];
}
export interface ConceptClass2 {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Name4 {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Description {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Answer2 {
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
export interface Location {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: any;
  address2: any;
  cityVillage: any;
  stateProvince: any;
  country: any;
  postalCode: any;
  latitude: any;
  longitude: any;
  countyDistrict: any;
  address3: any;
  address4: any;
  address5: any;
  address6: any;
  tags: Tag[];
  parentLocation: ParentLocation;
  childLocations: ChildLocation[];
  retired: boolean;
  attributes: any[];
  address7: any;
  address8: any;
  address9: any;
  address10: any;
  address11: any;
  address12: any;
  address13: any;
  address14: any;
  address15: any;
  links: Link[];
  resourceVersion: string;
}

export interface Tag {
  uuid: string;
  display: string;
  links: Link[];
}

export interface ParentLocation {
  uuid: string;
  display: string;
  links: Link[];
}
export interface ChildLocation {
  uuid: string;
  display: string;
  links: Link[];
}

export interface AuditInfo2 {
  creator: Creator2;
  dateCreated: string;
  changedBy?: ChangedBy;
  dateChanged?: string;
}

export interface Creator2 {
  uuid: string;
  display: string;
  links: Link[];
}

export interface ChangedBy {
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

  console.info('show prog', data?.data.results);

  return {
    error: error,
    isLoading: isLoading,
    enrollments: data?.data.results ?? [],
    isValidating,
  };
};
