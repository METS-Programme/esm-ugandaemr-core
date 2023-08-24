import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './createDashboardLink';
import { facilityHomeDashboardMeta, hieHomeDashboardMeta } from './dashboard.meta';
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
}

// pages
export const facilityDashboard = getAsyncLifecycle(() => import('./views/facility/facility-root.component'), options);
export const hieDashboard = getAsyncLifecycle(() => import('./views/hie/hie-root.component'), options);

// extensions
export const facilityHomeDashboardLink = getSyncLifecycle(createDashboardLink(facilityHomeDashboardMeta), options);
export const facilityHomeDashboardExt = getAsyncLifecycle(() => import('./views/facility/facility-home.component'), {
  featureName: 'facility dashboard',
  moduleName,
});

export const hieHomeDashboardLink = getSyncLifecycle(createDashboardLink(hieHomeDashboardMeta), options);
export const hieHomeDashboardExt = getAsyncLifecycle(() => import('./views/hie/hie-home.component'), options);

// cervical cancer
export const cervicalCancerSummaryExt = getAsyncLifecycle(
  () => import('./views/cervical-cancer/cacx-visits/cacx-visits.component'),
  {
    featureName: 'cervical-cancer-summary-extension',
    moduleName,
  },
);

// clinical views divider
export const clinicalViewsDivider = getSyncLifecycle(
  createOHRIPatientChartSideNavLink(patientChartDivider_dashboardMeta),
  options,
);
