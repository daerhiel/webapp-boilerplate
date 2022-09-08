import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';
import { AccountInfo } from '@azure/msal-browser';
import { map, Observable, share } from 'rxjs';

import { GraphClientService } from '../graph-client.service';

@Pipe({
  name: 'graph'
})
export class GraphPicturePipe implements PipeTransform {
  private static cache: { [id: string]: Observable<Blob | string | SafeValue> } = {};

  constructor(private graph: GraphClientService, private sanitizer: DomSanitizer) {
  }

  transform(account: AccountInfo | null): Observable<Blob | string | SafeValue> {
    const id = account?.localAccountId ?? '#unknown';
    if (!GraphPicturePipe.cache.hasOwnProperty(id)) {
      GraphPicturePipe.cache[id] = this.graph.getPhoto(id).pipe(map(x => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(x))), share());
    }
    return GraphPicturePipe.cache[id];
  }
}
