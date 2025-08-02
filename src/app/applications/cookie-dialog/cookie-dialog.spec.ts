import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieDialog } from './cookie-dialog';

describe('CookieDialog', () => {
  let component: CookieDialog;
  let fixture: ComponentFixture<CookieDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
