import { Type } from '@openmrs/esm-framework';

export interface CarePanelConfig {
  regimenObs: {
    encounterProviderRoleUuid: string;
  };
  artStartDateUuid: string;
  currentRegimenUuid: string;
  whoClinicalStageUuid: string;
}

export const configSchema = {
  regimenObs: {
    encounterProviderRoleUuid: {
      _type: Type.UUID,
      _default: 'a0b03050-c99b-11e0-9572-0800200c9a66',
      _description: "The provider role to use for the regimen encounter. Default is 'Unkown'.",
    },
    artStartDateUuid: {
      _type: Type.ConceptUuid,
      _default: 'ab505422-26d9-41f1-a079-c3d222000440',
    },
    currentRegimenUuid: {
      _type: Type.ConceptUuid,
      _default: 'dd2b0b4d-30ab-102d-86b0-7a5022ba4115',
    },
    whoClinicalStageUuid: {
      _type: Type.ConceptUuid,
      _default: 'dcdff274-30ab-102d-86b0-7a5022ba4115',
    },
    baselineRegimenUuid: {
      _type: Type.ConceptUuid,
      _default: 'c3332e8d-2548-4ad6-931d-6855692694a3',
    },
    dateConfirmedHivPositiveUuid: {
      _type: Type.ConceptUuid,
      _default: 'dce12b4f-30ab-102d-86b0-7a5022ba4115',
    },
    baselineCd4Uuid: {
      _type: Type.ConceptUuid,
      _default: 'c17bd9df-23e6-4e65-ba42-eb6d9250ca3f',
    },
    hivViralLoadDateUuid: {
      _type: Type.ConceptUuid,
      _default: '0b434cfa-b11c-4d14-aaa2-9aed6ca2da88',
    },
    hivViralLoadQualitativeUuid: {
      _type: Type.ConceptUuid,
      _default: 'dca12261-30ab-102d-86b0-7a5022ba4115',
    },
    hivViralLoadUuid: {
      _type: Type.ConceptUuid,
      _default: 'dc8d83e3-30ab-102d-86b0-7a5022ba4115',
    },
    lastEncounterDateUuid: {
      _type: Type.ConceptUuid,
      _default: 'dc8d83e3-30ab-102d-86b0-7a5022ba4115',
    },
  },
};
