import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermgmtComponent } from './usermgmt.component';

describe('UsermgmtComponent', () => {
  let component: UsermgmtComponent;
  let fixture: ComponentFixture<UsermgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
