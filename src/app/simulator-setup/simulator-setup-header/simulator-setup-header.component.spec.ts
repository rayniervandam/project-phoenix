import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorSetupHeaderComponent } from './simulator-setup-header.component';

describe('SimulatorSetupHeaderComponent', () => {
  let component: SimulatorSetupHeaderComponent;
  let fixture: ComponentFixture<SimulatorSetupHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorSetupHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorSetupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
