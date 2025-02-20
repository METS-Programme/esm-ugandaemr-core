export interface PatientQueueResponse {
  results: PatientQueue[];
  links: Links[];
  totalcount: number;
}

export interface PatientQueue {
  uuid: string;
  creator: Creator;
  dateCreated: string;
  changedby: string;
  dateChanged: string;
  voided: boolean;
  datevoided: string;
  voidedby: string;
  patient: Patient;
  provider: Provider;
  locationFrom: LocationFrom;
  locationTo: LocationTo;
  encounter: string;
  status: string;
  priority: number;
  priorityComment: string;
  visitNumber: string;
  comment: string;
  queueRoom: QueueRoom;
  datePicked: string;
  dateCompleted: string;
  links: Links[];
  resourceVersion: string;
}
export interface QueueRoom {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityVillage: string;
  stateProvince: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  countyDistrict: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  tags: Tags[];
  parentLocation: ParentLocation;
  childLocations: String[];
  retired: boolean;
  attributes: String[];
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
  links: Links[];
  resourceVersion: string;
}

export interface LocationTo {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityvillage: string;
  stateprovince: string;
  country: string;
  postalcode: string;
  latitude: string;
  longitude: string;
  countydistrict: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  tags: Tags[];
  parentlocation: ParentLocation;
  childlocations: String[];
  retired: boolean;
  attributes: String[];
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
  links: Links[];
  resourceversion: string;
}

export interface LocationFrom {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityvillage: string;
  stateprovince: string;
  country: string;
  postalcode: string;
  latitude: string;
  longitude: string;
  countydistrict: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  tags: Tags[];
  parentlocation: ParentLocation;
  childlocations: String[];
  retired: boolean;
  attributes: String[];
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
  links: Links[];
  resourceversion: string;
}

export interface ParentLocation {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Tags {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Provider {
  uuid: string;
  display: string;
  person: Person;
  identifier: string;
  attributes: Attributes[];
  retired: boolean;
  links: Links[];
  resourceversion: string;
}

export interface Patient {
  uuid: string;
  display: string;
  identifiers: Identifiers[];
  person: Person;
  voided: boolean;
  links: Links[];
  resourceversion: string;
}

export interface Person {
  uuid: string;
  display: string;
  gender: string;
  age: number;
  birthdate: string;
  birthdateestimated: boolean;
  dead: boolean;
  deathdate: string;
  causeofdeath: string;
  preferredName: PreferredName;
  preferredAddress: PreferredAddress;
  attributes: Attributes[];
  voided: boolean;
  birthtime: string;
  deathdateestimated: boolean;
  links: Links[];
  resourceversion: string;
}

export interface Attributes {
  uuid: string;
  display: string;
  links: Links[];
}

export interface PreferredAddress {
  uuid: string;
  display: string;
  links: Links[];
}

export interface PreferredName {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Identifiers {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Creator {
  uuid: string;
  display: string;
  username: string;
  systemid: string;
  userproperties: UserProperties;
  person: Person;
  privileges: Privileges[];
  roles: Roles[];
  retired: boolean;
  links: Links[];
  resourceversion: string;
}

export interface Roles {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Privileges {
  uuid: string;
  display: string;
  links: Links[];
}

export interface Person {
  uuid: string;
  display: string;
  links: Links[];
}

export interface UserProperties {
  loginattempts: string;
}

export interface Links {
  rel: string;
  uri: string;
  resourcealias: string;
}
