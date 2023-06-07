import { getAsyncLifecycle, defineConfigSchema, provide, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';
import formsRegistry from './forms/forms-registry';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import {hivDashboardMeta} from './dashboard.meta';
import { moduleName } from './constants';

const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const backendDependencies = {
  fhir2: '^1.2.0',
  'webservices.rest': '^2.2.0',
};

function setupOpenMRS() {
  const options = {
    featureName: '@ugandaemr/esm-hiv-app',
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  addToBaseFormsRegistry(formsRegistry);
  return {
    pages: [],
    extensions: [
      {
        id: 'hiv-dashboard',
        slot: 'patient-chart-dashboard-slot',
        load: getSyncLifecycle(createDashboardLink(hivDashboardMeta), options),
        meta: hivDashboardMeta,
      },
      {
        id: 'clinical-assessment-dashboard-ext',
        slot: 'hiv-dashboard-slot',
        load: getAsyncLifecycle(() => import('./pages/hiv/hiv.component'), {
          featureName: 'clinical-assessment-dashboard-summary',
          moduleName,
        }),
        meta: {
          columnSpan: 4,
        },
      },

    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
