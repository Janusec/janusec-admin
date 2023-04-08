import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiInterfaceComponent } from './api-interface.component';

describe('ApiInterfaceComponent', () => {
  let component: ApiInterfaceComponent;
  let fixture: ComponentFixture<ApiInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
