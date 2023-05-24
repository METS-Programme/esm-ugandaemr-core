import { getAsyncLifecycle, defineConfigSchema, provide, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';
import ugandaEmrConfig from './ugandaemr-config';
import formsRegistry from './forms/forms-registry';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { moduleName } from './constants';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { clinicalAssessmentDashboardMeta, opdDashboardMeta } from './dashboard.meta';

const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const backendDependencies = {
  fhir2: '^1.2.0',
  'webservices.rest': '^2.2.0',
};

function setupOpenMRS() {
  const options = {
    featureName: 'esm-ugandaemr-app',
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  provide(ugandaEmrConfig);
  addToBaseFormsRegistry(formsRegistry);
  return {
    pages: [],
    extensions: [
      {
        id: 'cervical-cancer-summary-ext',
        slot: 'cacx-visits-slot',
        load: getAsyncLifecycle(() => import('./pages/cervical-cancer/cacx-visits/cacx-visits.component'), {
          featureName: 'cervical-cancer-summary-extension',
          moduleName,
        }),
      },
      {
        id: 'clinical-assessment-dashboard',
        slot: 'patient-chart-dashboard-slot',
        load: getSyncLifecycle(createDashboardLink(clinicalAssessmentDashboardMeta), options),
        meta: clinicalAssessmentDashboardMeta,
      },
      {
        id: 'clinical-assessment-dashboard-ext',
        slot: 'clinical-assessment-dashboard-slot',
        load: getAsyncLifecycle(() => import('./pages/hiv/clinical-assessment.component'), {
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
