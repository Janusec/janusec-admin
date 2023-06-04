import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DnsDomainsComponent } from './dns-domains.component';

describe('DnsDomainsComponent', () => {
  let component: DnsDomainsComponent;
  let fixture: ComponentFixture<DnsDomainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DnsDomainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DnsDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
