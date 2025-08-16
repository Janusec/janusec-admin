import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WAFLogs } from './waf-logs';

describe('WafLogs', () => {
  let component: WAFLogs;
  let fixture: ComponentFixture<WAFLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WAFLogs]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WAFLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
