import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { fromEvent, take } from 'rxjs';

@Directive({
  selector: '[escape]'
})
export class EscapeDirective implements OnInit {
  @Output() public escape: EventEmitter<Event> = new EventEmitter();

  public captured: boolean = false;

  public constructor(private element: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  public onClick(event: Event): void {
    if (!this.element.nativeElement.contains(event?.target) && this.captured) {
      this.escape.emit(event);
    }
  }

  public ngOnInit(): void {
    fromEvent(document, 'click', { capture: true })
      .pipe(take(1))
      .subscribe(() => this.captured = true);
  }
}
