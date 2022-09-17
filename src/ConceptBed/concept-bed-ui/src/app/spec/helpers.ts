import { MsalService } from "@azure/msal-angular";
import { PublicClientApplication } from "@azure/msal-browser";

import * as uuid from 'uuid';

export const tenant = 'domain.onmicrosoft.com';
export const tenantId = uuid.v4();
export const username = 'user.name@microsoft.com';
export const localAccountId = uuid.v4();

export const account = {
  homeAccountId: `${uuid.v4()}.${uuid.v4()}`,
  environment: 'login.windows.net', tenantId, username, localAccountId, name: 'User Name'
};

export function getEqualityTester<T extends { [name: string]: any }>(type: new (...args: any[]) => T) {
  return (x: T, y: { [name: string]: any }) => {
    if (x instanceof type && typeof y === 'object') {
      for (const name in y) {
        if (x[name] !== y[name]) {
          return false;
        }
      }
      return true;
    }
    return undefined;
  }
}

export const msalServiceMock = jasmine.createSpyObj<MsalService>('MsalServiceMock', ['logoutRedirect'], {
  instance: jasmine.createSpyObj<PublicClientApplication>('ClientApplication', { getAllAccounts: [account] })
});

export const picture = buildPicture();

function buildPicture(): Blob {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = canvas.height = 120;
  const context = canvas.getContext('2d')!;
  const gradient = context.createLinearGradient(0, 0, 120, 120);
  gradient.addColorStop(0, '#ff8f00');
  gradient.addColorStop(0.5, '#ffa000');
  gradient.addColorStop(1.0, '#ffb300');
  context.arc(60, 60, 50, 0, 2 * Math.PI);
  context.strokeStyle = gradient;
  context.lineWidth = 10;
  context.stroke();
  const [_, type, data] = /data:(\w+\/\w+);base64,([\w\/+=]+)/i.exec(canvas.toDataURL()) as string[];
  return new Blob([new Uint8Array(window.atob(data).split('').map(x => x.charCodeAt(0)))], { type: type })
}

