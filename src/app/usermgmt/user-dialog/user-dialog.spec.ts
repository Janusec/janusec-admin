import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDialog } from './user-dialog';

describe('UserDialog', () => {
  let component: UserDialog;
  let fixture: ComponentFixture<UserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
