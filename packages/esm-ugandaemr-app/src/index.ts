import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
//import { createDashboardLink } from './createDashboardLink';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import {
  facilityDashboardMeta,
  hieDashboardMeta,
  medicationsDashboardMeta,
  patientChartSupportServicesDivider_dashboardMeta,
} from './dashboard.meta';
import formsRegistry from './forms/forms-registry';
import ugandaEmrConfig from './ugandaemr-config';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';
import {
  createOHRIPatientChartSideNavLink,
  patientChartDivider_dashboardMeta,
} from '@ohri/openmrs-esm-ohri-commons-lib';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'esm-ugandaemr-app',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  provide(ugandaEmrConfig);
  addToBaseFormsRegistry(formsRegistry);
}

// pages

// extensions
// cervical cancer
export const cervicalCancerSummaryExt = getAsyncLifecycle(
  () => import('./pages/cervical-cancer/cacx-visits/cacx-visits.component'),
  {
    featureName: 'cervical-cancer-summary-extension',
    moduleName,
  },
);

// facility dashboard
export const facilityDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...facilityDashboardMeta, moduleName }),
  options,
);
export const facilityDashboardExt = getAsyncLifecycle(() => import('./views/facility/facility-home.component'), {
  featureName: 'facility-dashboard',
  moduleName,
});

// medications
export const medicationsDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...medicationsDashboardMeta, moduleName }),
  options,
);
export const medicationsDashboardExt = getAsyncLifecycle(
  () => import('./views/medications/medications-home.component'),
  options,
);

// hie
export const hieDashboardLink = getSyncLifecycle(createDashboardLink({ ...hieDashboardMeta, moduleName }), options);
export const hieDashboardExt = getAsyncLifecycle(() => import('./views/hie/hie-home.component'), options);

// // clinical views divider
export const clinicalViewsDivider = getSyncLifecycle(
  createOHRIPatientChartSideNavLink(patientChartDivider_dashboardMeta),
  options,
);

// support views divider
// export const supportViewsDivider = getSyncLifecycle(
//   createOHRIPatientChartSideNavLink(patientChartSupportServicesDivider_dashboardMeta),
//   options,
// );

// workspace
export const activeQueuePatientWorkspace = getAsyncLifecycle(
  () => import('./workspace/queue-patients-action-button.component'),
  {
    featureName: 'active patients workspace',
    moduleName,
  },
);

export const activeQueuePatients = getAsyncLifecycle(
  () => import('../../esm-patient-queues-app/src/active-visits/active-visits-table.component'),
  {
    featureName: 'active patients workspace',
    moduleName,
  },
);

export const queuePatientsWorkspace = getAsyncLifecycle(
  () => import('./workspace/queue-patients-workspace.component'),
  {
    featureName: 'active patients workspace',
    moduleName,
  },
);
