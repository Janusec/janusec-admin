import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieRefDialogComponent } from './cookie-ref-dialog.component';

describe('CookieRefDialogComponent', () => {
  let component: CookieRefDialogComponent;
  let fixture: ComponentFixture<CookieRefDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieRefDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieRefDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
