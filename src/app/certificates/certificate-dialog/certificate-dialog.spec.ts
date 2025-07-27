import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateDialog } from './certificate-dialog';

describe('CertificateDialog', () => {
  let component: CertificateDialog;
  let fixture: ComponentFixture<CertificateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
