import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorDashboardMainComponent } from './simulator-dashboard-main.component';

describe('SimulatorDashboardMainComponent', () => {
  let component: SimulatorDashboardMainComponent;
  let fixture: ComponentFixture<SimulatorDashboardMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorDashboardMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorDashboardMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
