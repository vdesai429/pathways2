import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocdialogComponent } from './docdialog.component';

describe('DocdialogComponent', () => {
  let component: DocdialogComponent;
  let fixture: ComponentFixture<DocdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
