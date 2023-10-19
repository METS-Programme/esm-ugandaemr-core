import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  nhfrGlobalPropertyValueName: {
    _type: Type.String,
    _default: 'ugandaemrsync.nhfr.facility.url',
    _description: 'Whether to use a casual greeting (or a formal one).',
  },
  nhcrUrl: {
    _type: Type.String,
    _default: '',
    _description: 'Whether to use a casual greeting (or a formal one).',
  },
};

export type Config = {
  nhfrGlobalPropertyValueName: String;
  nhcrUrl: String;
};
