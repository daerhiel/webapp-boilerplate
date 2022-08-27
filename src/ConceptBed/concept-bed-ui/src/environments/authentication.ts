import { Configuration, InteractionType, LogLevel } from "@azure/msal-browser";
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from "@azure/msal-angular";

import { environment } from "./environment";

function logEvent(logLevel: LogLevel, message: string, piiEnabled: boolean) {
  if (logLevel < LogLevel.Info) {
    console.log(message, LogLevel[logLevel]);
  }
}

function getBaseUrl(): string {
  let url = document.getElementsByTagName('base')[0].href;
  if (url && url.slice(-1) === '/') {
    url = url.slice(0, -1);
  }
  return url;
}

export const configuration: Configuration = {
  auth: {
    authority: 'https://login.microsoftonline.com/e0225ff9-4f8e-4edf-9abf-89c4dc7fb590',
    clientId: 'a5355185-a5e1-44f6-9ae1-4106b39bd3c8',
    redirectUri: getBaseUrl(),
    postLogoutRedirectUri: getBaseUrl()
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: /MSIE|Trident/i.test(window.navigator.userAgent)
  },
  system: {
    loggerOptions: {
      loggerCallback: logEvent,
      correlationId: 'AAD',
      logLevel: LogLevel.Error,
      piiLoggingEnabled: false
    }
  }
}

export const guards: MsalGuardConfiguration = {
  interactionType: InteractionType.Redirect,
  authRequest: {
    scopes: environment.graphScopes
  }
}

export const interceptors: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,
  protectedResourceMap: new Map([
    [environment.graphUrl, environment.graphScopes],
    [environment.apiUrl, environment.apiScopes]
  ])
}
