import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortForwardings } from './port-forwardings';

describe('PortForwardings', () => {
  let component: PortForwardings;
  let fixture: ComponentFixture<PortForwardings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortForwardings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortForwardings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
