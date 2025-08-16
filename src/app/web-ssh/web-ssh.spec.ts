import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSSH } from './web-ssh';

describe('WebSsh', () => {
  let component: WebSSH;
  let fixture: ComponentFixture<WebSSH>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebSSH]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WebSSH);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
