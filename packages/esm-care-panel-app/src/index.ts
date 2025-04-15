import { getAsyncLifecycle, defineConfigSchema, registerBreadcrumbs, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { dashboardMeta } from './dashboard.meta';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';

const moduleName = '@ugandaemr/esm-care-panel-app';

const options = {
  featureName: 'patient-care-panels',
  moduleName,
};
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export const patientProgramSummary = getAsyncLifecycle(() => import('./care-panel/care-panel.hiv.component'), options);

export const ViralLoadList = getAsyncLifecycle(() => import('./vl-history/vl-history.component'), options);

export const carePanelPatientSummary = getAsyncLifecycle(
  () => import('./patient-summary/patient-summary.component'),
  options,
);

// t('carePanel', 'Care panel')
export const carePanelSummaryDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...dashboardMeta, moduleName }),
  options,
);

export function startupApp() {
  registerBreadcrumbs([]);
  defineConfigSchema(moduleName, configSchema);
}

export const patientCareProgram = getAsyncLifecycle(() => import('./care-panel/care-panel.hiv.component'), {
  moduleName: 'patient-care-programs-hiv',
  featureName: 'care-programs',
});

export const patientCareProgramTB = getAsyncLifecycle(() => import('./care-panel/care-panel.tb.component'), {
  moduleName: 'patient-care-programs-tb',
  featureName: 'care-programs',
});

export const patientCareProgramMCH = getAsyncLifecycle(() => import('./care-panel/care-panel.mch.component'), {
  moduleName: 'patient-care-programs-mch',
  featureName: 'care-programs',
});
