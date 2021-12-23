import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpPolicyComponent } from './ip-policy.component';

describe('IpPolicyComponent', () => {
  let component: IpPolicyComponent;
  let fixture: ComponentFixture<IpPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
