import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DnsDialogComponent } from './dns-dialog.component';

describe('DnsDialogComponent', () => {
  let component: DnsDialogComponent;
  let fixture: ComponentFixture<DnsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DnsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DnsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
