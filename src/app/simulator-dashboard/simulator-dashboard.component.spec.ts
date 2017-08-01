import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorDashboardComponent } from './simulator-dashboard.component';

describe('SimulatorDashboardComponent', () => {
  let component: SimulatorDashboardComponent;
  let fixture: ComponentFixture<SimulatorDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
