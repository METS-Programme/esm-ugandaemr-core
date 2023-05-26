import { getAsyncLifecycle, defineConfigSchema, provide, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import ugandaEmrOverrides from './ugandaemr-configuration-overrrides.json';
import ugandaEmrConfig from './ugandaemr-config';
import formsRegistry from './forms/forms-registry';
import { addToBaseFormsRegistry } from '@openmrs/openmrs-form-engine-lib';
import { moduleName } from './constants';
import { OHRIHome } from '@ohri/openmrs-esm-ohri-commons-lib';
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
        id: 'home-db-ext',
        slot: 'homepage-widgets-slot',
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
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
