import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryRules } from './discovery-rules';

describe('DiscoveryRules', () => {
  let component: DiscoveryRules;
  let fixture: ComponentFixture<DiscoveryRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoveryRules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoveryRules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
