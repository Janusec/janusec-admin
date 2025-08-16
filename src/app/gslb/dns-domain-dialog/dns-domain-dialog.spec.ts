import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DNSDomainDialog } from './dns-domain-dialog';

describe('DnsDomainDialog', () => {
  let component: DNSDomainDialog;
  let fixture: ComponentFixture<DNSDomainDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DNSDomainDialog]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DNSDomainDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
