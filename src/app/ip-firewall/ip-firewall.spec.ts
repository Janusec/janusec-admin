import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IPFirewall } from './ip-firewall';

describe('IpFirewall', () => {
  let component: IPFirewall;
  let fixture: ComponentFixture<IPFirewall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IPFirewall]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IPFirewall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
