// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  title: 'Concept-Bed Boilerplate',
  apiUrl: 'https://localhost:44305/api/v1',
  apiScopes: ["api://bf2f676b-dee2-41cf-b2f6-517045f608b8/user_impersonation"],
  graphUrl: 'https://graph.microsoft.com/v1.0',
  graphScopes: ['user.read'],
  appInsights: {
    instrumentationKey: 'd84f131f-2595-416f-b0af-b51d4769c915'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
