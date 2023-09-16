import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Chart, registerables } from "chart.js";
import { AnalyticsService } from "app/core/service/analytics/analytics.service";
Chart.register(...registerables);

@Component({
  selector: "app-super-dashboard",
  templateUrl: "./super-dashboard.component.html",
  styleUrls: ["./super-dashboard.component.scss"],
})
export class SuperDashboardComponent implements OnInit {
  @ViewChild('filter', { static: true }) filter: ElementRef;
  public chart: any;
  chartData: any;
  data: any;
  dashTableData = [];
  dashData: any;
  dashPaymentData: any;
  searchTerm: string = "";
  pageIndex: number = 0;

  constructor(
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // chart config
  donetChart() {
    this.chart = new Chart("MyChart", {
      type: "doughnut", //this denotes the type of chart
      data: {
        labels: ["Total Amount", "Paid Amount", "Balance Amount"],
        datasets: [
          {
            label: "Rs. ",
            data: [
              this.chartData?.totalPaymentAmount,
              this.chartData?.totalPaidAmount,
              this.chartData?.totalBalanceAmount,
            ],
            backgroundColor: [
              "rgb(54, 162, 235)",
              "#1f8933",
              "#ff4141",
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: 20,
        plugins: {
          legend: {
              // display: false,
              position: 'left',
            align: 'center',
            labels : {
              boxWidth :15,
              padding:5
            }
           } 
          }
      },
    });
  }

  // get page event
  getPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.loadData();
  }

  // loading data
  loadData() {
    this.analyticsService              // order and sales count data call
      .getDashboardCountDetails()
      .subscribe((response: any) => {
        if (response) {
          this.dashData = response.data;
        }
      });

    this.analyticsService              // chart data call
      .getDashboardPaymentDetails()
      .subscribe((response: any) => {
        if (response) {
          this.dashPaymentData = response.data[0];
          this.chartData = (this.dashPaymentData ? this.dashPaymentData : []);
          this.donetChart();
        }
      });

    this.analyticsService             // table data call
      .customerSalesOrdersCount(this.pageIndex, this.searchTerm)
      .subscribe((response: any) => {
        if (response) {
          this.data = response.data;
          this.dashTableData = this.data?.content;
        }
      });
  }
}
