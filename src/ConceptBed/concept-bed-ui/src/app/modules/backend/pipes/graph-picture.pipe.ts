import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AccountInfo } from '@azure/msal-browser';
import { map, Observable, of, shareReplay } from 'rxjs';

import { GraphClientService } from '../graph-client.service';
import { cacheMap, CacheInstance, fromCache } from '@modules/services/services.module';

@Pipe({
  name: 'graph'
})
export class GraphPicturePipe implements PipeTransform {
  private static readonly _unknownId: string = '#unknown';
  private static readonly _cache: CacheInstance<SafeUrl | undefined> = {};

  constructor(private graph: GraphClientService, private sanitizer: DomSanitizer) {
  }

  transform(account: AccountInfo | null | undefined): Observable<SafeUrl | undefined> {
    const id = account?.localAccountId ?? GraphPicturePipe._unknownId;
    return of(id).pipe(cacheMap(GraphPicturePipe._cache, x => x !== GraphPicturePipe._unknownId ?
      this.graph.getPhoto(x).pipe(map(x =>
        this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(x))), shareReplay(1)) :
      of(undefined)
    ));
  }

  static get(account: AccountInfo | null | undefined): Observable<SafeUrl | undefined> {
    const id = account?.localAccountId ?? this._unknownId;
    return fromCache(id, GraphPicturePipe._cache) ?? of();
  }
}
