import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './createDashboardLink';
import { facilityHomeDashboardMeta, hieHomeDashboardMeta } from './dashboard.meta';

import formBuilderAppMenu from './menu-app-items/form-builder-app-item/form-builder-app-item.component';
import systemInfoAppMenu from './menu-app-items/system-info-app-item/system-info-app-item.component';
import legacyAdminAppMenu from './menu-app-items/legacy-admin-item/legacy-admin-item.component';
import cohortBuilderAppMenu from './menu-app-items/cohort-builder-item/cohort-builder-item.component';
import formRenderTestAppMenu from './menu-app-items/form-render-test-item/form-render-test-item.component';
import dispensingAppMenu from './menu-app-items/despensing-app-menu-item/dispensing-app-menu-item.component';
import {
  registerWorkspace,
  createDashboardLink as createPatientChartDashboardLink,
} from '@openmrs/esm-patient-common-lib';
import laboratoryReferralWorkspaceComponent from './laboratory/patient-chart/laboratory-workspaces/laboratory-referral.workspace.component';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'esm-ugandaemr-app',
  moduleName,
};

// Menu App Items
export const formBuilderAppMenuItem = getSyncLifecycle(formBuilderAppMenu, options);
export const systemInfoAppMenuItem = getSyncLifecycle(systemInfoAppMenu, options);
export const legacyAdminAppMenuItem = getSyncLifecycle(legacyAdminAppMenu, options);
export const cohortBuilderAppMenuItem = getSyncLifecycle(cohortBuilderAppMenu, options);
export const formRenderTestAppMenuItem = getSyncLifecycle(formRenderTestAppMenu, options);
export const dispensingAppMenuItem = getSyncLifecycle(dispensingAppMenu, options);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  registerWorkspace({
    name: 'patient-laboratory-referral-workspace',
    title: 'Laboratory Referral Form',
    load: getSyncLifecycle(laboratoryReferralWorkspaceComponent, options),
  });
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
/*export const clinicalViewsDivider = getSyncLifecycle(
  createOHRIPatientChartSideNavLink(patientChartDivider_dashboardMeta),
  options,
);*/

// system info lin
export const systemInfoMenuLink = getAsyncLifecycle(() => import('./pages/system-info/system-info-link.component'), {
  featureName: 'system info link',
  moduleName,
});

export const systemInfoPage = getAsyncLifecycle(() => import('./pages/system-info/system-info.component'), {
  featureName: 'system info page',
  moduleName,
});

// export const retrieveFacilityCodeModal = getAsyncLifecycle(
//   () => import('./pages/system-info/facility-modal.component'),
//   {
//     featureName: 'retrieve facility code modal',
//     moduleName,
//   },
// );

// export const updateFacilityCodeAlert = getAsyncLifecycle(
//   () => import('./pages/system-info/update-facility-code-alert'),
//   {
//     featureName: 'update facility code alert',
//     moduleName,
//   },
// );

///////////////////////////////
// Laboratory components
///////////////////////////////
export const pickupLabRequestAction = getAsyncLifecycle(
  () => import('./laboratory/actions/pick-lab-request-menu.component'),
  {
    featureName: 'pickup lab request action',
    moduleName,
  },
);

export const labRequestModal = getAsyncLifecycle(
  () => import('./laboratory/dialogs/add-to-worklist-dialog.component'),
  {
    featureName: 'pickup lab request modal',
    moduleName,
  },
);

export const reviewItemModal = getAsyncLifecycle(
  () => import('./laboratory/tabs/review-list/dialog/review-item.component'),
  {
    featureName: 'review item modal',
    moduleName,
  },
);

export const reviewList = getAsyncLifecycle(() => import('./laboratory/tabs/review-list/review-tab.component'), {
  featureName: 'review list',
  moduleName,
});

export const completedOrdersList = getAsyncLifecycle(
  () => import('./laboratory/tabs/completed/completed-tab.component'),
  {
    featureName: 'completed list',
    moduleName,
  },
);

export const rejectedOrdersList = getAsyncLifecycle(() => import('./laboratory/tabs/rejected/rejected-tab.component'), {
  featureName: 'rejected list',
  moduleName,
});

export const referredOrdersList = getAsyncLifecycle(() => import('./laboratory/tabs/referred/referred-tab.component'), {
  featureName: 'referred list',
  moduleName,
});

export const referredTile = getAsyncLifecycle(() => import('./laboratory/tiles/referred-tile.component'), {
  featureName: 'referred tile',
  moduleName,
});

export const rejectedTile = getAsyncLifecycle(() => import('./laboratory/tiles/rejected-tile.component'), {
  featureName: 'rejected tile',
  moduleName,
});

// Patient Chart

export const laboratoryOrderDashboardLink = getSyncLifecycle(
  createPatientChartDashboardLink({
    path: 'laboratory-orders',
    title: 'Investigative Results',
    moduleName,
  }),
  options,
);

export const laboratoryOrderComponent = getAsyncLifecycle(
  () => import('./laboratory/patient-chart/patient-laboratory-order-results.component'),
  options,
);
