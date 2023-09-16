import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
// import { ChartComponent } from './chart/chart.component';
import { CustomerChartComponent } from './customer-chart/customer-chart.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { CrmChartComponent } from './crm-chart/crm-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    // ChartComponent,
    CustomerChartComponent,
    SalesChartComponent,
    CrmChartComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class AnalyticsModule { }
