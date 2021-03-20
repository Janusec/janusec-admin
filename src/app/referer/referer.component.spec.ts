import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefererComponent } from './referer.component';

describe('RefererComponent', () => {
  let component: RefererComponent;
  let fixture: ComponentFixture<RefererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
