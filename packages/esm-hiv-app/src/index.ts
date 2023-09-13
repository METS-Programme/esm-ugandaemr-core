import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { createDashboardGroup, createDashboardLink } from '@openmrs/esm-patient-common-lib';
import {
  clinicalVisitsDashboardMeta,
  generalCounsellingDashboardMeta,
  hivCacxDashboardMeta,
  hivDashboardMeta,
  hivPatientSummaryDashboardMeta,
  hivTestingDashboardtMeta,
  htsSummaryDashboardMeta,
  partnerNotificationServicesDashboardMeta,
  programManagementDashboardMeta,
} from './dashboard.meta';
import { moduleName } from './constants';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: '@ugandaemr/esm-hiv-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const hivDashboardGroup = getSyncLifecycle(createDashboardGroup(hivDashboardMeta), options);

//  screening dashboard
export const hivTestingDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...hivTestingDashboardtMeta,
    moduleName,
  }),
  options,
);
export const hivTestingDashboardExt = getAsyncLifecycle(() => import('./pages/hiv/prevention/prevention.component'), {
  featureName: 'hiv-testing-services',
  moduleName,
});

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
export const clinicalVisitsDashboard = getAsyncLifecycle(
  () => import('./pages/hiv/visits/tabs/clinical-visit-tab.component'),
  {
    featureName: 'visits-summary',
    moduleName,
  },
);
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

export const hivCacxDashboardMetaLink = getSyncLifecycle(
  createDashboardLink({ ...hivCacxDashboardMeta, moduleName }),
  options,
);
export const hivCacxDashboardMetaExt = getAsyncLifecycle(
  () => import('./pages/hiv/cervical-cancer/cacx-screening-treatment.component'),
  {
    featureName: 'hiv-cacx-screening',
    moduleName,
  },
);

export { moduleName };
