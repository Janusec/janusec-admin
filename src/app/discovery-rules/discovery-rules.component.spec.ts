import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryRulesComponent } from './discovery-rules.component';

describe('DiscoveryRulesComponent', () => {
  let component: DiscoveryRulesComponent;
  let fixture: ComponentFixture<DiscoveryRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoveryRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoveryRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
