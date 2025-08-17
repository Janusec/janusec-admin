import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCLogDialog } from './cc-log-dialog';

describe('CCLogDialog', () => {
  let component: CCLogDialog;
  let fixture: ComponentFixture<CCLogDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CCLogDialog]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CCLogDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
