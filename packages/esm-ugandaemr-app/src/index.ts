import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { createDashboardLink } from './createDashboardLink';
import { facilityListMeta } from './dashboard.meta';
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
        id: 'facility-list-dashboard-link',
        slot: 'homepage-dashboard-slot',
        load: getSyncLifecycle(createDashboardLink(facilityListMeta), options),
        meta: facilityListMeta,
        online: true,
        offline: true,
      },
      {
        id: 'facility-list-dashboard-ext',
        slot: 'facility-home-dashboard-slot',
        load: getAsyncLifecycle(() => import('./views/facilities/facility-list-home.component'), {
          featureName: 'facility landing page',
          moduleName,
        }),
      },

      {
        id: 'facility-home-header',
        slot: 'facility-landing-page-home-header-slot',
        load: getAsyncLifecycle(() => import('./views/home/header/ugemr-home-header.component'), {
          featureName: 'general-home-header',
          moduleName,
        }),
      },
      {
        id: 'facility-tiles-ext',
        slot: 'facility-landing-page-home-tiles-slot',
        load: getAsyncLifecycle(() => import('./views/home/home-metrics/home-metrics.component'), {
          featureName: 'tiles',
          moduleName,
        }),
      },
      {
        id: 'facility-tabs-ext',
        slot: 'facility-landing-page-home-tabs-slot',
        load: getAsyncLifecycle(() => import('./views/home/visit-tabs/home-visit-tabs.component'), {
          featureName: 'tabs',
          moduleName,
        }),
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
      // {
      //   id: 'set-facility-identifier',
      //   load: getAsyncLifecycle(
      //     () => import('./views/facilities/facility-dashboard/tabs/HIE/set-identifer-dialog.component'),
      //     {
      //       featureName: 'set facility identifier dialog',
      //       moduleName,
      //     },
      //   ),
      // },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
