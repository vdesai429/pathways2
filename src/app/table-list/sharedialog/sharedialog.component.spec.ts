import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedialogComponent } from './sharedialog.component';

describe('SharedialogComponent', () => {
  let component: SharedialogComponent;
  let fixture: ComponentFixture<SharedialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
