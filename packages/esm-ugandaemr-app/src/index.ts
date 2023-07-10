import { OHRIHome } from '@ohri/openmrs-esm-ohri-commons-lib';
import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, provide } from '@openmrs/esm-framework';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import { DashboardWrapper } from './db/ug-emr-db-wrapper.component';
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
        id: 'emr-db-wrapper',
        slot: 'homepage-widgets-slot',
        load: getSyncLifecycle(DashboardWrapper, {
          featureName: 'db-wrapper',
          moduleName,
        }),
      },
      {
        id: 'home-db-ext',
        slot: 'ug-emr-db-wrapper',
        load: getSyncLifecycle(OHRIHome, {
          featureName: 'landing-page',
          moduleName,
        }),
        meta: {
          title: 'Home DB',
          slot: 'home-db-slot',
          config: {
            programme: 'general-homne',
          },
        },
      },
      {
        id: 'general-home-header',
        slot: 'landing-page-home-header-slot',
        load: getAsyncLifecycle(() => import('./views/home/header/ugemr-home-header.component'), {
          featureName: 'general-home-header',
          moduleName,
        }),
      },
      {
        id: 'tiles-ext',
        slot: 'landing-page-home-tiles-slot',
        load: getAsyncLifecycle(() => import('./views/home/home-metrics/home-metrics.component'), {
          featureName: 'tiles',
          moduleName,
        }),
      },
      {
        id: 'tabs-ext',
        slot: 'landing-page-home-tabs-slot',
        load: getAsyncLifecycle(() => import('./views/home/visit-tabs/home-visit-tabs.component'), {
          featureName: 'tabs',
          moduleName,
        }),
      },
      {
        id: 'active-queue-patient-workspace',
        slot: 'action-menu-non-chart-items-slot',
        load: getAsyncLifecycle(() => import('../src/workspace/active-queue-patients-wsp-button.component'), {
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
        id: 'set-facility-identifier',
        load: getAsyncLifecycle(() => import('./views/facilities/set-identifer-dialog.component'), {
          featureName: 'set facility identifier dialog',
          moduleName,
        }),
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
