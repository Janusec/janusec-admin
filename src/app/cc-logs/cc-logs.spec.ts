import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCLogs } from './cc-logs';

describe('CcLogs', () => {
  let component: CCLogs;
  let fixture: ComponentFixture<CCLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CCLogs]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CCLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
