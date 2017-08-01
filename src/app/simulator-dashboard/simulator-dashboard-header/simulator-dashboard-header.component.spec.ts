import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorDashboardHeaderComponent } from './simulator-dashboard-header.component';

describe('SimulatorDashboardHeaderComponent', () => {
  let component: SimulatorDashboardHeaderComponent;
  let fixture: ComponentFixture<SimulatorDashboardHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorDashboardHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorDashboardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
