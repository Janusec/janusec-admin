import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortForwardingDialog } from './port-forwarding-dialog';

describe('PortForwardingDialog', () => {
  let component: PortForwardingDialog;
  let fixture: ComponentFixture<PortForwardingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortForwardingDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortForwardingDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
