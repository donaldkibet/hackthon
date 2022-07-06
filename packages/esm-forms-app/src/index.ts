import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { dashboardMeta } from './dashboard.meta';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';

const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const backendDependencies = {
  'webservices.rest': '^2.2.0',
};

function setupOpenMRS() {
  const moduleName = '@kenyaemr/esm-form-app';

  const options = {
    featureName: 'kenyaemr-form',
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);

  return {
    pages: [],
    extensions: [
      {
        name: 'kenyaemr-form',
        slot: 'patient-chart-summary-dashboard-slot',
        load: getAsyncLifecycle(() => import('./root.component'), options),
        online: true,
        offline: false,
        order: 0,
        meta: {
          columnSpan: 4,
        },
      },
      {
        name: 'kenyaemr-form-workspace',
        load: getAsyncLifecycle(() => import('./form-entry/form-entry.component'), options),
      },
      {
        name: 'kenya-emr-forms-summary-dashboard',
        slot: 'patient-chart-dashboard-slot',
        order: 13,
        load: getSyncLifecycle(createDashboardLink(dashboardMeta), options),
        meta: dashboardMeta,
        online: true,
        offline: true,
      },
      {
        name: 'patient-form-dashboard',
        order: 0,
        slot: dashboardMeta.slot,
        load: getAsyncLifecycle(() => import('./root.component'), options),
        online: {
          isOffline: false,
        },
        offline: {
          isOffline: true,
        },
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
