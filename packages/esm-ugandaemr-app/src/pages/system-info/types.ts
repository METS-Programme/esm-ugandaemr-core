export interface PropertyResponse {
  results: Result[];
}

export interface Result {
  uuid: string;
  property: string;
  value: string;
  description: string;
  display: string;
  datatypeClassname: any;
  datatypeConfig: any;
  preferredHandlerClassname: any;
  handlerConfig: any;
  links: Link[];
  resourceVersion: string;
}

export interface SystemSettingResponse {
  entry: FacilityEntry[];
}

export interface FacilityEntry {
  resource: Resource;
}

export interface Resource {
  resourceType: string;
  name: string;
  extension: Extension[];
}

export interface Extension {
  url: string;
  valueCode: string;
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}
