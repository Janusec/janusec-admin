import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DNSRecordDialog } from './dns-record-dialog';

describe('DnsRecordDialog', () => {
  let component: DNSRecordDialog;
  let fixture: ComponentFixture<DNSRecordDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DNSRecordDialog]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DNSRecordDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
