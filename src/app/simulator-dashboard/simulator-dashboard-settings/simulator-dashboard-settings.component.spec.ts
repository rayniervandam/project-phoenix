import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorDashboardSettingsComponent } from './simulator-dashboard-settings.component';

describe('SimulatorDashboardSettingsComponent', () => {
  let component: SimulatorDashboardSettingsComponent;
  let fixture: ComponentFixture<SimulatorDashboardSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorDashboardSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorDashboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
