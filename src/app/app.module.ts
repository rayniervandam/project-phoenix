import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

// Angular cdk
import { CdkTableModule } from '@angular/cdk'

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdTableModule } from '@angular/material';
import { MdSortModule } from '@angular/material';
import { MdPaginatorModule } from '@angular/material';
import { MdToolbarModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { MdRadioModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdIconModule } from '@angular/material';
import { MdMenuModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdProgressBarModule } from '@angular/material';
import { MdProgressSpinnerModule } from '@angular/material';
import 'hammerjs';

// Components
import { AppComponent } from './app.component';
import { SimulatorDashboardComponent } from './simulator-dashboard/simulator-dashboard.component';
import { SimulatorDashboardHeaderComponent } from './simulator-dashboard/simulator-dashboard-header/simulator-dashboard-header.component';
import { SimulatorDashboardMainComponent } from './simulator-dashboard/simulator-dashboard-main/simulator-dashboard-main.component';
import { SimulatorDashboardSettingsComponent } from './simulator-dashboard/simulator-dashboard-settings/simulator-dashboard-settings.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: SimulatorDashboardComponent,
    data: { title: 'Dashboard' },
    children: [
       { path: '', redirectTo: 'main', pathMatch: 'full' },
       { path: 'main', component: SimulatorDashboardMainComponent },
       { path: 'settings', component: SimulatorDashboardSettingsComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SimulatorDashboardComponent,
    SimulatorDashboardHeaderComponent,
    SimulatorDashboardMainComponent,
    SimulatorDashboardSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    // Routing
    RouterModule.forRoot(appRoutes),
    // Angular cdk
    CdkTableModule,
    // Angular Material
    BrowserAnimationsModule,
    MdTableModule,
    MdSortModule,
    MdPaginatorModule,
    MdToolbarModule,
    MdCardModule,
    MdRadioModule,
    MdButtonModule,
    MdIconModule,
    MdMenuModule,
    MdInputModule,
    MdProgressBarModule,
    MdProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
