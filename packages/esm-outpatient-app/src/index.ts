import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import {
  PalliativeDashboardtMeta,
  assessmentDashboardtMeta,
  opdDashboardMeta,
  treatmentDashboardtMeta,
} from './dashboard.meta';
import formsRegistry from './forms/forms-registry';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-outpatient-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  // TODO: these forms need to be deleted and moved to the backend
  addToBaseFormsRegistry(formsRegistry);
}

export const opdDashboardGroup = getSyncLifecycle(createDashboardGroup(opdDashboardMeta), options);

//  Clinical Assessment dashboard
export const opdAssessmentDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...assessmentDashboardtMeta,
    moduleName,
  }),
  options,
);

export const opdAssessmentDashboardLinkExt = getAsyncLifecycle(
  () => import('./pages/opd/clinical-assessment.component'),
  {
    featureName: 'assessment-dashboard-ext',
    moduleName,
  },
);

//  treatment dashboard
export const opdTreatmentDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...treatmentDashboardtMeta,
    moduleName,
  }),
  options,
);

export const opdTestingDashboardLinkExt = getAsyncLifecycle(
  () => import('./pages/opd/linkagae-and-referral.component'),
  {
    featureName: 'opd-dashboard-ext',
    moduleName,
  },
);

//  Palliative dashboard
export const opdPalliativeDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...PalliativeDashboardtMeta,
    moduleName,
  }),
  options,
);

export const opdPalliativeDashboardLinkExt = getAsyncLifecycle(() => import('./pages/opd/palliative-care.component'), {
  featureName: 'opd-dashboard-ext',
  moduleName,
});
