import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCFirewall } from './cc-firewall';

describe('CCFirewall', () => {
  let component: CCFirewall;
  let fixture: ComponentFixture<CCFirewall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CCFirewall]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CCFirewall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
