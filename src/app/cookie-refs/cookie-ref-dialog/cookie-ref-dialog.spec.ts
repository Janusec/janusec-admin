import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieRefDialog } from './cookie-ref-dialog';

describe('CookieRefDialog', () => {
  let component: CookieRefDialog;
  let fixture: ComponentFixture<CookieRefDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieRefDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieRefDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
