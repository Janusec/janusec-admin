import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CclogsComponent } from './cclogs.component';

describe('CclogsComponent', () => {
  let component: CclogsComponent;
  let fixture: ComponentFixture<CclogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CclogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CclogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
