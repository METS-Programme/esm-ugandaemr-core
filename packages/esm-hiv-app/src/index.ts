import { getAsyncLifecycle, defineConfigSchema, provide, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import formsRegistry from './forms/forms-registry';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import {
  hivDashboardMeta,
  preventionDashboardtMeta,
  screeningDashboardMeta,
  treatmentCareDashboardtMeta,
} from './dashboard.meta';
import { moduleName } from './constants'; 

const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-hiv-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema); 
  addToBaseFormsRegistry(formsRegistry);
}

export const hivDashboardGroup = getSyncLifecycle(createDashboardGroup(hivDashboardMeta), options);

//  screening dashboard
export const screeningDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...screeningDashboardMeta,
    moduleName,
  }),
  options,
);

export const preventionDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...preventionDashboardtMeta,
    moduleName,
  }),
  options,
);

export const treatmentCareDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...treatmentCareDashboardtMeta,
    moduleName,
  }),
  options,
);
