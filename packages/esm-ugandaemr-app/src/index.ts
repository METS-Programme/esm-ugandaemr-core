import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { facilityHomeDashboardMeta, hieHomeDashboardMeta } from './dashboard.meta';

import formBuilderAppMenu from './menu-app-items/form-builder-app-item/form-builder-app-item.component';
import systemInfoAppMenu from './menu-app-items/system-info-app-item/system-info-app-item.component';
import legacyAdminAppMenu from './menu-app-items/legacy-admin-item/legacy-admin-item.component';
import cohortBuilderAppMenu from './menu-app-items/cohort-builder-item/cohort-builder-item.component';
import formRenderTestAppMenu from './menu-app-items/form-render-test-item/form-render-test-item.component';
import dispensingAppMenu from './menu-app-items/despensing-app-menu-item/dispensing-app-menu-item.component';

import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { createHomeDashboardLink } from './create-dashboard-link';
import ClinicalPatientSummary from './pages/clinical-patient-summary/clinical-patient-summary.component';
import ClinicalPatientSummaryTabs from './pages/clinical-patient-summary/clinical-patient-summary-tabs/clinical-patient-summary-tabs.component';
import SubjectiveFindingsComponent from './pages/clinical-patient-summary/clinical-patient-summary-tabs/subjective-findings.component';
import ObjectiveFindingsComponent from './pages/clinical-patient-summary/clinical-patient-summary-tabs/objective-findings.component';
import TreatmentPlanComponent from './pages/clinical-patient-summary/clinical-patient-summary-tabs/treatment-plan.component';
import AssessmentComponent from './pages/clinical-patient-summary/clinical-patient-summary-tabs/assessment.component';
import { CalcMonthsOnART } from './custom-expressions';
import { registerControl, registerExpressionHelper } from '@openmrs/openmrs-form-engine-lib';

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
  registerExpressionHelper('CustomMonthsOnARTCalc', CalcMonthsOnART);
}

// pages
export const facilityDashboard = getAsyncLifecycle(() => import('./views/facility/facility-root.component'), options);
export const hieDashboard = getAsyncLifecycle(() => import('./views/hie/hie-root.component'), options);

// extensions
export const facilityHomeDashboardLink = getSyncLifecycle(createHomeDashboardLink(facilityHomeDashboardMeta), options);
export const facilityHomeDashboardExt = getAsyncLifecycle(() => import('./views/facility/facility-home.component'), {
  featureName: 'facility dashboard',
  moduleName,
});

export const hieHomeDashboardLink = getSyncLifecycle(createHomeDashboardLink(hieHomeDashboardMeta), options);
export const hieHomeDashboardExt = getAsyncLifecycle(() => import('./views/hie/hie-home.component'), options);

export const systemInfoMenuLink = getAsyncLifecycle(() => import('./pages/system-info/system-info-link.component'), {
  featureName: 'system info link',
  moduleName,
});

export const systemInfoPage = getAsyncLifecycle(() => import('./pages/system-info/system-info.component'), {
  featureName: 'system info page',
  moduleName,
});

export const retrieveFacilityCodeModal = getAsyncLifecycle(
  () => import('./pages/system-info/facility-modal.component'),
  {
    featureName: 'retrieve facility code modal',
    moduleName,
  },
);

export const updateFacilityCodeAlert = getAsyncLifecycle(
  () => import('./pages/system-info/update-facility-code-alert'),
  {
    featureName: 'update facility code alert',
    moduleName,
  },
);

export const dispensingDashboardLink = getSyncLifecycle(
  createHomeDashboardLink({
    name: 'dispensing',
    slot: 'dispensing-dashboard-slot',
    title: 'Pharmacy',
    customSpaBasePath: `${window.spaBase}`,
  }),
  options,
);

export const clinicalPatientDashboardLink = getSyncLifecycle(
  createDashboardLink({
    path: 'clinical-patient-dashboard',
    title: 'Clinical Patient Dashboard',
    moduleName,
  }),
  options,
);

export const clinicalPatientSummary = getSyncLifecycle(ClinicalPatientSummary, options);

export const clincialPatientSummaryTabs = getSyncLifecycle(ClinicalPatientSummaryTabs, options);

export const subjectiveFindingsSection = getSyncLifecycle(SubjectiveFindingsComponent, options);

export const objectiveFindingsSection = getSyncLifecycle(ObjectiveFindingsComponent, options);

export const treatmentPlanSection = getSyncLifecycle(TreatmentPlanComponent, options);

export const assessmentSection = getSyncLifecycle(AssessmentComponent, options);
