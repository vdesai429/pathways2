import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolsfrontendComponent } from './protocolsfrontend.component';

describe('ProtocolsfrontendComponent', () => {
  let component: ProtocolsfrontendComponent;
  let fixture: ComponentFixture<ProtocolsfrontendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolsfrontendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolsfrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
