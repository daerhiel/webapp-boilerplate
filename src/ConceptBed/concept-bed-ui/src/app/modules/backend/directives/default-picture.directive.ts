import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[defaultPicture]'
})
export class DefaultPictureDirective {
  @Input() defaultPicture: string | undefined

  constructor(private ref: ElementRef<HTMLImageElement>) {
  }

  @HostListener('error', ['$event'])
  onError(event: Event): void {
    const element = this.ref.nativeElement;
    if (!!element && !element.nonce) {
      element.src = this.defaultPicture || 'assets/images/default-profile.jpg';
      element.nonce = Math.random().toFixed(20);
    }
  }
}
