import { Type } from '@openmrs/esm-framework';
import _default from 'react-hook-form/dist/utils/createSubject';

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
  hivProgramUuid: {
    _type: Type.ConceptUuid,
    _default: '18c6d4aa-0a36-11e7-8dbb-507b9dc4c741',
  },
  tbProgramUuid: {
    _type: Type.ConceptUuid,
    _default: '9dc21a72-0971-11e7-8037-507b9dc4c741',
  },
  dateStartedTBFirstRegimenUuid: {
    _type: Type.ConceptUuid,
    _default: '7326297e-0ccd-4355-9b86-dde1c056e2c2',
  },
  dsTbRegmimenUuid: {
    _type: Type.ConceptUuid,
    _default: '159958AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  },
  tbDiseaseClassificationUuid: {
    _type: Type.ConceptUuid,
    _default: 'd45871ee-62d6-4d4d-b905-f7b75a3fd3bb',
  },
  tbPatientTypeUuid: {
    _type: Type.ConceptUuid,
    _default: 'e077f196-c19a-417f-adc6-b175a3343bfd',
  },
  fbimUuid: {
    _type: Type.ConceptUuid,
    _default: '733144c0-c321-11e8-a355-529269fb1459',
  },
  fbgUuid: {
    _type: Type.ConceptUuid,
    _default: '73313c96-c321-11e8-a355-529269fb1459',
  },
  ftdrUuid: {
    _type: Type.ConceptUuid,
    _default: '73313f20-c321-11e8-a355-529269fb1459',
  },
  ccladUuid: {
    _type: Type.ConceptUuid,
    _default: '733139e4-c321-11e8-a355-529269fb1459',
  },
  cddpUuid: {
    _type: Type.ConceptUuid,
    _default: '73313728-c321-11e8-a355-529269fb1459',
  },
  currentARVDurationUuid: {
    _type: Type.ConceptUuid,
    _default: '171de3f4-a500-46f6-8098-8097561dfffb',
  },
  tptStatusUuid: {
    _type: Type.ConceptUuid,
    _default: '37d4ac43-b3b4-4445-b63b-e3acf47c8910',
  },
  tptStartDateUuid: {
    _type: Type.ConceptUuid,
    _default: '483939c7-79ba-4ca4-8c3e-346488c97fc7',
  },
  tptCompletionDateUuid: {
    _type: Type.ConceptUuid,
    _default: '813e21e7-4ccb-4fe9-aaab-3c0e40b6e356',
  },
};
