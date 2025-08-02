import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDialog } from './application-dialog';

describe('ApplicationDialog', () => {
  let component: ApplicationDialog;
  let fixture: ComponentFixture<ApplicationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
