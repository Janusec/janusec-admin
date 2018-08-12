import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CclogDetailComponent } from './cclog-detail.component';

describe('CclogDetailComponent', () => {
  let component: CclogDetailComponent;
  let fixture: ComponentFixture<CclogDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CclogDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CclogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
