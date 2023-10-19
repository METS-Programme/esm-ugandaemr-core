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

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}
