import { defineConfigSchema, getAsyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-tb-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}


export const root = getAsyncLifecycle(
  () => import("./pages/td/tb.component"),
  options
);