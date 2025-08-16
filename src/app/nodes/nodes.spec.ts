import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nodes } from './nodes';

describe('Nodes', () => {
  let component: Nodes;
  let fixture: ComponentFixture<Nodes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nodes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nodes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
