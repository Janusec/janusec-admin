import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieRefsComponent } from './cookie-refs.component';

describe('CookieRefsComponent', () => {
  let component: CookieRefsComponent;
  let fixture: ComponentFixture<CookieRefsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieRefsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieRefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
