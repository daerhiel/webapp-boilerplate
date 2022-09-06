import { Injectable } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleResolverService implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Promise<string> | string {
    const title = new TitleCasePipe();
    return of(route.url.map(x => title.transform(x.path)).join(' '));
  }
}
