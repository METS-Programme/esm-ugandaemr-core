import {
  createOHRIPatientChartSideNavLink,
  patientChartDivider_dashboardMeta,
} from '@ohri/openmrs-esm-ohri-commons-lib';
import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './createDashboardLink';
import { HieDashboardMeta, MedicationsMeta, facilityMeta } from './dashboard.meta';
import formsRegistry from './forms/forms-registry';
import ugandaEmrConfig from './ugandaemr-config';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';
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
        id: 'facility-dashboard-link',
        slot: 'homepage-dashboard-slot',
        load: getSyncLifecycle(createDashboardLink(facilityMeta), options),
        meta: facilityMeta,
        online: true,
        offline: true,
        order: 2,
      },
      {
        id: 'facility-dashboard-ext',
        slot: 'facility-dashboard-slot',
        load: getAsyncLifecycle(() => import('./views/facility/facility-home.component'), {
          featureName: 'facility dashboard',
          moduleName,
        }),
      },
      {
        id: 'medications-dashboard-link',
        slot: 'homepage-dashboard-slot',
        load: getSyncLifecycle(createDashboardLink(MedicationsMeta), options),
        meta: MedicationsMeta,
        online: true,
        offline: true,
        order: 4,
      },
      {
        id: 'medications-dashboard-ext',
        slot: 'medications-dashboard-slot',
        load: getAsyncLifecycle(() => import('./views/medications/medications-home.component'), options),
      },

      {
        id: 'hie-dashboard-link',
        slot: 'homepage-dashboard-slot',
        load: getSyncLifecycle(createDashboardLink(HieDashboardMeta), options),
        meta: HieDashboardMeta,
        online: true,
        offline: true,
        order: 5,
      },
      {
        id: 'hie-dashboard-ext',
        slot: 'hie-dashboard-slot',
        load: getAsyncLifecycle(() => import('./views/hie/hie-home.component'), options),
      },
      {
        id: 'clinical-views-divider',
        slot: 'patient-chart-dashboard-slot',
        order: 15,
        load: getSyncLifecycle(createOHRIPatientChartSideNavLink(patientChartDivider_dashboardMeta), options),
      },
      {
        id: 'active-queue-patient-workspace',
        slot: 'action-menu-non-chart-items-slot',
        load: getAsyncLifecycle(() => import('./workspace/queue-patients-action-button.component'), {
          featureName: 'active patients workspace',
          moduleName,
        }),
      },

      {
        id: 'active-queue-patients',
        load: getAsyncLifecycle(
          () => import('../../esm-patient-queues-app/src/active-visits/active-visits-table.component'),
          {
            featureName: 'active patients workspace',
            moduleName,
          },
        ),
      },
      {
        id: 'queue-patients-workspace',
        load: getAsyncLifecycle(() => import('./workspace/queue-patients-workspace.component'), {
          featureName: 'active patients workspace',
          moduleName,
        }),
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
