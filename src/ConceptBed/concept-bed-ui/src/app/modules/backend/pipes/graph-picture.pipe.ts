import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';
import { AccountInfo } from '@azure/msal-browser';

import { GraphClientService } from '../graph-client.service';

@Pipe({
  name: 'graphPicture'
})
export class GraphPicturePipe implements PipeTransform {
  private static cache: { [id: string]: Blob | string | SafeValue } = {};

  public constructor(private graph: GraphClientService, private sanitazer: DomSanitizer) {
  }

  public transform(account: AccountInfo | null, source?: 'my'): any {
    const id = account?.username ?? '#unknown';
    if (!!id && !GraphPicturePipe.cache.hasOwnProperty(id)) {
      GraphPicturePipe.cache[id] = '';
      const request = id === 'my' ? this.graph.getPhoto(id) : this.graph.getMyPhoto();
      request.subscribe(blob => GraphPicturePipe.cache[id] = this.sanitazer.bypassSecurityTrustUrl(URL.createObjectURL(blob)));
    }
    return GraphPicturePipe.cache[id];
  }
}
