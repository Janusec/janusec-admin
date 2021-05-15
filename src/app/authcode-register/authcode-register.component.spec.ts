import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthcodeRegisterComponent } from './authcode-register.component';

describe('AuthcodeRegisterComponent', () => {
  let component: AuthcodeRegisterComponent;
  let fixture: ComponentFixture<AuthcodeRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthcodeRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthcodeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
