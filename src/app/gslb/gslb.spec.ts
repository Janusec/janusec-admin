import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSLB } from './gslb';

describe('Gslb', () => {
  let component: GSLB;
  let fixture: ComponentFixture<GSLB>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GSLB]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GSLB);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
