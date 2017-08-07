import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorSetupComponent } from './simulator-setup.component';

describe('SimulatorSetupComponent', () => {
  let component: SimulatorSetupComponent;
  let fixture: ComponentFixture<SimulatorSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
