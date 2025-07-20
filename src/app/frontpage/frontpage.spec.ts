import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Frontpage } from './frontpage';

describe('Frontpage', () => {
  let component: Frontpage;
  let fixture: ComponentFixture<Frontpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Frontpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Frontpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
