import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VipAppsComponent } from './vip-apps.component';

describe('VipAppsComponent', () => {
  let component: VipAppsComponent;
  let fixture: ComponentFixture<VipAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VipAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VipAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
