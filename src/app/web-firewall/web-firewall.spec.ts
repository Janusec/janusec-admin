import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebFirewall } from './web-firewall';

describe('WebFirewall', () => {
  let component: WebFirewall;
  let fixture: ComponentFixture<WebFirewall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFirewall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebFirewall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
