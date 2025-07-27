import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Certificates } from './certificates';

describe('Certificates', () => {
  let component: Certificates;
  let fixture: ComponentFixture<Certificates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Certificates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Certificates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
