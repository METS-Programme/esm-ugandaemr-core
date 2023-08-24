import { getAsyncLifecycle, defineConfigSchema, provide, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import formsRegistry from './forms/forms-registry';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import {
  clinicalVisitsDashboardMeta,
  generalCounsellingDashboardMeta,
  hivDashboardMeta,
  hivPatientSummaryDashboardMeta,
  htsSummaryDashboardMeta,
  partnerNotificationServicesDashboardMeta,
  preventionDashboardtMeta,
  programManagementDashboardMeta, 
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
export const preventionDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...preventionDashboardtMeta,
    moduleName,
  }),
  options,
);
export const hivPreventionDashboardExt = getAsyncLifecycle(
  () => import('./pages/hiv/prevention/prevention.component'),
  {
    featureName: 'hiv-prevention',
    moduleName,
  },
);
 

export const hivTreatmentDashboardExt = getAsyncLifecycle(
  () => import('./pages/hiv/care-treatment/care-treatment.component'),
  {
    featureName: 'care-and-treatment',
    moduleName,
  },
);

export const hivPatientSummaryDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...hivPatientSummaryDashboardMeta, moduleName }),
  options,
);

export const htsServiceSummaryList = getAsyncLifecycle(
  () => import('./pages/hiv/service-summary/encounter-list/service-summary-encounter-list.component'),
  {
    featureName: 'hts-service-summary-list',
    moduleName,
  },
);

export const programManagementDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...programManagementDashboardMeta, moduleName }),
  options,
);
export const programManagementDashboard = getAsyncLifecycle(
  () => import('./pages/hiv/care-treatment/care-treatment.component'),
  {
    featureName: 'program-management-summary',
    moduleName,
  },
);
export const clinicalVisitsDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...clinicalVisitsDashboardMeta, moduleName }),
  options,
);
export const clinicalVisitsDashboard = getAsyncLifecycle(() => import('./pages/hiv/visits/visits-summary.component'), {
  featureName: 'visits-summary',
  moduleName,
});
export const generalCounsellingDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...generalCounsellingDashboardMeta, moduleName }),
  options,
);
export const generalCounsellingDashboard = getAsyncLifecycle(
  () => import('./pages/hiv/general-counselling/general-counselling-summary.component'),
  {
    featureName: 'general-counselling-summary',
    moduleName,
  },
);

export const partnerNotificationServicesDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...partnerNotificationServicesDashboardMeta, moduleName }),
  options,
);
export const partnerNotificationServicesDashboard = getAsyncLifecycle(
  () => import('./pages/hiv/partner-notification-services/partner-notification-services.component'),
  {
    featureName: 'partner-notification-services',
    moduleName,
  },
);

export { moduleName };
