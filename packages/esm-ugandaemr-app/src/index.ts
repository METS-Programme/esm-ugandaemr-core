import { defineConfigSchema, getAsyncLifecycle, provide } from '@openmrs/esm-framework';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import formsRegistry from './forms/forms-registry';
import ugandaEmrConfig from './ugandaemr-config';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';

const options = {
  featureName: 'esm-ugandaemr-app',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export const cervicalCancerSummaryExtension = getAsyncLifecycle(
  () => import('./pages/cervical-cancer/cacx-visits/cacx-visits.component'),
  options,
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  provide(ugandaEmrConfig);
  addToBaseFormsRegistry(formsRegistry);
}
