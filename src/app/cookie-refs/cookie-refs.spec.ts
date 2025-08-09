import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieRefs } from './cookie-refs';

describe('CookieRefs', () => {
  let component: CookieRefs;
  let fixture: ComponentFixture<CookieRefs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieRefs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieRefs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
