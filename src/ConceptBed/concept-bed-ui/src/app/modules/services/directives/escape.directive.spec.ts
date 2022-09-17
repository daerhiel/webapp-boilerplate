import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';

import { EscapeDirective } from './escape.directive';

@Component({
  template: `<div id="parent">
    <div id="element" (escape)="onEscape()">
      <span id="child">Component</span>
    </div>
    <div id="neighbor"></div>
  </div>`
})
class TestComponent {
  escaped: boolean = false;

  onEscape(): void {
    this.escaped = true;
  }
}

describe('EscapeDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: EscapeDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        EscapeDirective
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.directive(EscapeDirective));
    directive = element.injector.get(EscapeDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should escape on parent click', () => {
    const parent = fixture.debugElement.query(By.css('div#parent'));
    parent.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.escaped).toBeTrue();
  });

  it('should not escape on element click', () => {
    const parent = fixture.debugElement.query(By.css('div#element'));
    parent.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.escaped).toBeFalse();
  });

  it('should not escape on child click', () => {
    const child = fixture.debugElement.query(By.css('div#element > span#child'));
    child.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.escaped).toBeFalse();
  });

  it('should escape on neighbor click', () => {
    const child = fixture.debugElement.query(By.css('div#neighbor'));
    child.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.escaped).toBeTrue();
  });
});
