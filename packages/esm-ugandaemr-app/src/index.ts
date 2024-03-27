import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';

import formBuilderAppMenu from './menu-app-items/form-builder-app-item/form-builder-app-item.component';
import systemInfoAppMenu from './menu-app-items/system-info-app-item/system-info-app-item.component';
import legacyAdminAppMenu from './menu-app-items/legacy-admin-item/legacy-admin-item.component';
import cohortBuilderAppMenu from './menu-app-items/cohort-builder-item/cohort-builder-item.component';
import formRenderTestAppMenu from './menu-app-items/form-render-test-item/form-render-test-item.component';
import dispensingAppMenu from './menu-app-items/despensing-app-menu-item/dispensing-app-menu-item.component';

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
}

// system info lin
export const systemInfoMenuLink = getAsyncLifecycle(() => import('./pages/system-info/system-info-link.component'), {
  featureName: 'system info link',
  moduleName,
});

export const systemInfoPage = getAsyncLifecycle(() => import('./pages/system-info/system-info.component'), {
  featureName: 'system info page',
  moduleName,
});
