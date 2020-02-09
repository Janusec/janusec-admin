import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsshComponent } from './webssh.component';

describe('WebsshComponent', () => {
  let component: WebsshComponent;
  let fixture: ComponentFixture<WebsshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
