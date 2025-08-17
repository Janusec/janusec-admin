import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WAFLogDialog } from './waf-log-dialog';

describe('WAFLogDialog', () => {
  let component: WAFLogDialog;
  let fixture: ComponentFixture<WAFLogDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WAFLogDialog]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WAFLogDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
