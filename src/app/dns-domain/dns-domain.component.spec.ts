import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DnsDomainComponent } from './dns-domain.component';

describe('DnsDomainComponent', () => {
  let component: DnsDomainComponent;
  let fixture: ComponentFixture<DnsDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DnsDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DnsDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
