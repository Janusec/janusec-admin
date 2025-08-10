import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usermgmt } from './usermgmt';

describe('Usermgmt', () => {
  let component: Usermgmt;
  let fixture: ComponentFixture<Usermgmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usermgmt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Usermgmt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
