import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { fromEvent, take } from 'rxjs';

@Directive({
  selector: '[escape]'
})
export class EscapeDirective implements OnInit {
  @Output() escape: EventEmitter<Event> = new EventEmitter();

  captured: boolean = false;

  constructor(private element: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.element.nativeElement.contains(event?.target) && this.captured) {
      this.escape.emit(event);
    }
  }

  ngOnInit(): void {
    fromEvent(document, 'click', { capture: true })
      .pipe(take(1))
      .subscribe(() => this.captured = true);
  }
}
