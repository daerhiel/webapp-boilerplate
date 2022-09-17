import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By, Title } from '@angular/platform-browser';

import { HelpComponent } from './help.component';

const appTitle = 'App Title';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async () => {
    document.body.classList.add('mat-typography');

    await TestBed.configureTestingModule({
      declarations: [
        HelpComponent
      ]
    }).compileComponents();
  });

  beforeEach(inject([Title], (title: Title) => {
    title.setTitle(appTitle);

    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', inject([Title], (title: Title) => {
    const header = fixture.debugElement.query(By.css('div.content > div.card > span'));

    expect(header.nativeElement).toBeTruthy();
    expect(header.nativeElement.innerHTML).toEqual(`${title.getTitle()} app is running!`);
  }));
});
