import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendsidebarComponent } from './frontendsidebar.component';

describe('FrontendsidebarComponent', () => {
  let component: FrontendsidebarComponent;
  let fixture: ComponentFixture<FrontendsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontendsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
