import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnsRecords } from './dns-records';

describe('DnsRecords', () => {
  let component: DnsRecords;
  let fixture: ComponentFixture<DnsRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnsRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DnsRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
