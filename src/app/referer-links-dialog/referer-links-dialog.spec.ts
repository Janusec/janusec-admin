import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefererLinksDialog } from './referer-links-dialog';

describe('RefererLinksDialog', () => {
  let component: RefererLinksDialog;
  let fixture: ComponentFixture<RefererLinksDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefererLinksDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefererLinksDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
