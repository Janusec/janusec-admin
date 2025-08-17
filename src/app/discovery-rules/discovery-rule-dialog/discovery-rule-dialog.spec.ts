import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryRuleDialog } from './discovery-rule-dialog';

describe('DiscoveryRuleDialog', () => {
  let component: DiscoveryRuleDialog;
  let fixture: ComponentFixture<DiscoveryRuleDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoveryRuleDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoveryRuleDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
