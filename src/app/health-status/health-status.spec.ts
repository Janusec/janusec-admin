import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthStatus } from './health-status';

describe('HealthStatus', () => {
  let component: HealthStatus;
  let fixture: ComponentFixture<HealthStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
