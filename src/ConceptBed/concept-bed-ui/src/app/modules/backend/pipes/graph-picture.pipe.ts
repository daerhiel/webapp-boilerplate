import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AccountInfo } from '@azure/msal-browser';
import { map, Observable, of, shareReplay } from 'rxjs';

import { GraphClientService } from '../graph-client.service';
import { cacheMap, CacheInstance } from '@modules/services/services.module';

@Pipe({
  name: 'graph'
})
export class GraphPicturePipe implements PipeTransform {
  private static cache: CacheInstance<SafeUrl> = {};

  constructor(private graph: GraphClientService, private sanitizer: DomSanitizer) {
  }

  transform(account: AccountInfo | null): Observable<SafeUrl> {
    const id = account?.localAccountId ?? '#unknown';
    return of(id).pipe(cacheMap(GraphPicturePipe.cache, x =>
      this.graph.getPhoto(x).pipe(map(x => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(x))), shareReplay(1))
    ));
  }
}
