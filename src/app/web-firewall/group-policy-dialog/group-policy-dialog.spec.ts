import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPolicyDialog } from './group-policy-dialog';

describe('GroupPolicyDialog', () => {
  let component: GroupPolicyDialog;
  let fixture: ComponentFixture<GroupPolicyDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPolicyDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupPolicyDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
