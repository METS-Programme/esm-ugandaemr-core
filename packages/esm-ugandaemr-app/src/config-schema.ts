import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  nhfrUrl: {
    _type: Type.String,
    _default: 'https://nhfr-staging-api.planetsystems.co/NHFRSearch?',
    _description: 'Whether to use a casual greeting (or a formal one).',
  },
  nhcrUrl: {
    _type: Type.String,
    _default: '',
    _description: 'Whether to use a casual greeting (or a formal one).',
  },
};

export type Config = {
  nhfrUrl: String;
  nhcrUrl: String;
};
