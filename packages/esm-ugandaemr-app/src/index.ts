import { getAsyncLifecycle, defineConfigSchema, provide, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';
import ugandaEmrConfig from './ugandaemr-config';
import formsRegistry from './forms/forms-registry';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { moduleName } from './constants';
import { OHRIHome, OHRIWelcomeSection, PatientListTable } from '@ohri/openmrs-esm-ohri-commons-lib';
import { DashboardWrapper } from './db/ug-emr-db-wrapper.component';
import { facilityListMeta } from './dashboard.meta';
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
        id: 'general-homne-header',
        slot: 'landing-page-home-header-slot',
        load: getAsyncLifecycle(() => import('./views/home/header/ugemr-home-header.component'), {
          featureName: 'general-home-header',
          moduleName,
        }),
      },
      {
        id: 'tiles-ext',
        slot: 'landing-page-home-tiles-slot',
        load: getAsyncLifecycle(() => import('./views/home/summary-tiles/ugemr-home-summary-tiles.component'), {
          featureName: 'tiles',
          moduleName,
        }),
      },
      {
        id: 'tabs-ext',
        slot: 'landing-page-home-tabs-slot',
        load: getAsyncLifecycle(() => import('./views/home/patient-tabs/ugemr-home-patient-tabs.component'), {
          featureName: 'tabs',
          moduleName,
        }),
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
