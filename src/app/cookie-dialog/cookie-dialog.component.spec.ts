import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieDialogComponent } from './cookie-dialog.component';

describe('CookieDialogComponent', () => {
  let component: CookieDialogComponent;
  let fixture: ComponentFixture<CookieDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
