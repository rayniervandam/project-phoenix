import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulator-dashboard-Main',
  templateUrl: './simulator-dashboard-Main.component.html',
  styleUrls: ['./simulator-dashboard-Main.component.css']
})
export class SimulatorDashboardMainComponent implements OnInit {

  public data = [];

  constructor() { }

  ngOnInit() {
      for (let y = 0; y < 100; y++) {
          this.data[y] = { id: y,input: [], output: []};
        for (let x = 0; x < 5; x++) {
          this.data[y].input[x] = { value: Math.random() };
        }
        for (let x = 0; x < 5; x++) {
          this.data[y].output[x] = { value: Math.random() };
        }
      }

  }



}
