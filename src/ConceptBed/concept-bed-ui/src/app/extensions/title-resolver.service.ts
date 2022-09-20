import { Injectable } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { getPath } from '@modules/services/services.module';

@Injectable({
  providedIn: 'root'
})
export class TitleResolverService implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Promise<string> | string {
    const title = new TitleCasePipe();
    return of(getPath(route.pathFromRoot).map(x => title.transform(x.path)).join(' '));
  }
}
