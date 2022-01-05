import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[defaultPicture]'
})
export class DefaultPictureDirective {
  @Input() public defaultPicture: string | undefined

  public constructor(private ref: ElementRef) {
  }

  @HostListener('error', ['$event'])
  public onError(event: Event): void {
    const element = this.ref.nativeElement as HTMLImageElement;
    if (!!element && !element.nonce) {
      element.src = this.defaultPicture || 'assets/images/default-profile.jpg';
      element.nonce = Math.random().toFixed(20);
    }
  }
}
