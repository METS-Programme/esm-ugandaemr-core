import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { opdDashboardMeta } from './dashboard.meta';
import formsRegistry from './forms/forms-registry';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';

const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const backendDependencies = {
  fhir2: '^1.2.0',
  'webservices.rest': '^2.2.0',
};

function setupOpenMRS() {
  const options = {
    featureName: '@ugandaemr/esm-outpatient-app',
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  addToBaseFormsRegistry(formsRegistry);
  return {
    pages: [],
    extensions: [
      {
        id: 'opd-dashboard',
        slot: 'patient-chart-dashboard-slot',
        load: getSyncLifecycle(createDashboardLink(opdDashboardMeta), options),
        meta: opdDashboardMeta,
      },
      {
        id: 'opd-dashboard-ext',
        slot: 'opd-dashboard-slot',
        load: getAsyncLifecycle(() => import('./pages/opd/outpatient.component'), {
          featureName: 'opd-dashboard-summary',
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
