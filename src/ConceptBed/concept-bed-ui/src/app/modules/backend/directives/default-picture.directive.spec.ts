import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DefaultPictureDirective } from './default-picture.directive';

@Component({
  template: `<img src="https://test/unknown" defaultPicture />`
})
class TestComponent { }

describe('DefaultPictureDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: DefaultPictureDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        DefaultPictureDirective
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.directive(DefaultPictureDirective));
    directive = element.injector.get(DefaultPictureDirective);
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should set default picture url', async () => {
    const fixture = TestBed.createComponent(TestComponent);

    const img = fixture.debugElement.query(By.css('img[defaultPicture]'));
    expect(img).not.toBeNull();

    img.triggerEventHandler('error');
    expect(img.nativeElement.src).toMatch(/assets\/images\/default-profile.jpg$/i);
  });
});
