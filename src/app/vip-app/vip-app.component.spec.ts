import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VipAppComponent } from './vip-app.component';

describe('VipAppComponent', () => {
  let component: VipAppComponent;
  let fixture: ComponentFixture<VipAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VipAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VipAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
