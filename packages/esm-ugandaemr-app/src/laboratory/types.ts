import { OpenmrsResource } from '@openmrs/esm-framework';
import { Order } from '@openmrs/esm-patient-common-lib';

export interface Encounter {
  uuid: string;
  display: string;
  encounterDatetime: string;
  patient: OpenmrsResource;
  location: Location;
  form: OpenmrsResource;
  encounterType: OpenmrsResource;
  obs: Obs[];
  orders: Order[];
  voided: boolean;
  auditInfo: OpenmrsResource;
  visit: OpenmrsResource;
  encounterProviders: OpenmrsResource[];
  diagnoses: any[];
  resourceVersion: string;
}

export interface Obs {
  uuid: string;
  display: string;
  concept: OpenmrsResource;
  person: OpenmrsResource;
  obsDatetime: string;
  accessionNumber: any;
  obsGroup: any;
  valueCodedName: any;
  groupMembers: ObsGroupMember[];
  comment: any;
  location: Location;
  order: any;
  encounter: Encounter;
  voided: boolean;
  value: any;
  valueModifier: any;
  formFieldPath: string;
  formFieldNamespace: string;
  resourceVersion: string;
}

export interface ObsGroupMember {
  uuid: string;
  display: string;
  concept: OpenmrsResource;
  person: OpenmrsResource;
  obsDatetime: string;
  accessionNumber: any;
  obsGroup: OpenmrsResource;
  valueCodedName: any;
  groupMembers: any;
  comment: any;
  location: Location;
  order: Order;
  encounter: Encounter;
  voided: boolean;
  value: number | OpenmrsResource;
  valueModifier: any;
  formFieldPath: any;
  formFieldNamespace: any;
  resourceVersion: string;
}

export interface Concept {
  uuid: string;
  display: string;
  name: OpenmrsResource;
  datatype: OpenmrsResource;
  conceptClass: OpenmrsResource;
  set: boolean;
  version: any;
  retired: boolean;
  names: OpenmrsResource[];
  descriptions: OpenmrsResource[];
  mappings: OpenmrsResource[];
  answers: any[];
  setMembers: any[];
  auditInfo: OpenmrsResource;
  hiNormal: number;
  hiAbsolute: number;
  hiCritical: number;
  lowNormal: number;
  lowAbsolute: number;
  lowCritical: number;
  units: string;
  allowDecimal: boolean;
  displayPrecision: any;
  attributes: any[];
  resourceVersion: string;
}
