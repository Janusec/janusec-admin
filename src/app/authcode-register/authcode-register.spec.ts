import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthcodeRegister } from './authcode-register';

describe('AuthcodeRegister', () => {
  let component: AuthcodeRegister;
  let fixture: ComponentFixture<AuthcodeRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthcodeRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthcodeRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
