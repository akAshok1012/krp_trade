import { Component, OnInit } from "@angular/core";
import { AnalyticsService } from "app/core/service/analytics/analytics.service";
import { UserService } from "app/core/service/user.service";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

@Component({
  selector: "app-customer-chart",
  templateUrl: "./customer-chart.component.html",
  styleUrls: ["./customer-chart.component.scss"],
})
export class CustomerChartComponent implements OnInit {
  chart1Ratio: any = 4 / 2;
  chart2Ratio: any = 4 / 1.4;
  orderChart: any;
  saleChart: any;
  paymentChart: any;
  customerDetail: any;
  custId: any = '';
  customer: any = '';

  chartType: boolean = true;
  chartTypes =  [
    { key: 'Order & Sales', value: true },
    { key: 'Payment', value: false },
  ]

  constructor(
    private analyticsService: AnalyticsService,
    private userService: UserService,
  ) {}
  chart1: any;
  chart2: any;

  ngOnInit() {
    this.isMobileMenu();
    this.getData();
  }

  isMobileMenu() {
    if ($(window).width() > 768) {
      this.chart2Ratio = 4 / 1.4;
    } else {
      this.chart2Ratio = 1;
    }
  }

  customersChart() {
    this.chart2 = new Chart("customersChart", {
      type: "line", //this denotes tha type of chart

      data: {
        labels: this.customerDetail?.map((d) => d.clientName),
        datasets: [
          {
            type: "bar",
            label: "Orders",
            data: this.customerDetail?.map((d) => d.orderCount),
            backgroundColor: "#209d207d",
            borderColor: "green",
            borderWidth: 1,
            yAxisID: "y1",
            barPercentage: 0.9, // Adjust the width of the bars
            hidden: !this.chartType
          },
          {
            type: "bar",
            label: "Sales",
            data: this.customerDetail?.map((d) => d.salesCount),
            backgroundColor: "rgb(171 209 235 / 56%)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 1,
            yAxisID: "y1",
            barPercentage: 0.9, // Adjust the width of the bars
            hidden: !this.chartType
          },
          {
            label: "Total Amount",
            data: this.customerDetail?.map((d) => d.totalPaymentAmount),
            fill: false,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            yAxisID: "y",
            tension: 0.4,
            hidden: this.chartType
          },
          {
            label: "Amount Paid",
            data: this.customerDetail?.map((d) => d.totalPaidAmount),
            backgroundColor: "rgb(255,15,0)",
            borderColor: "rgb(255,15,0)",
            borderDash: [5, 5],
            fill: false,
            yAxisID: "y",
            tension: 0.4,
            hidden: this.chartType
          },
          {
            label: "Balance Amount",
            data: this.customerDetail?.map((d) => d.totalBalanceAmount),
            backgroundColor: "rgb(217 217 217 / 74%)",
            borderColor: "rgb(116 116 116)",
            borderWidth: 1,
            fill: true,
            yAxisID: "y",
            tension: 0.4,
            hidden: this.chartType
          },
        ],
      },
      options: {
        aspectRatio: this.chart2Ratio,
        plugins: {
          title: {
            display: true,
            text: "",
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 0,
            bottom: 10
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Customer",
            },
          },
          y: {
            display: true,
            position: this.chartType ? "right" : "left",
            title: {
              display: true,
              text: "Total Payment",
            },
          },
          y1: {
            display: true,
            position: this.chartType ? "left" : "right",
            title: {
              display: true,
              text: "Total Sales and Orders",
            },
          },
        },
      },
    });
  }

  onSelect(){
    this.chart2.destroy();
    this.customersChart();
  }

  onSelectCust(data){
    if(this.custId){
      this.chart1.destroy();
     } else {
       this.chart2.destroy();
   }
      this.custId = data ? data.id : ''
    this.loadData();
  }

  customerChart() {
    this.chart1 = new Chart("customerChart", {
      type: "pie", //this denotes tha type of chart
      data: {
        labels:  ["Total Amount",
        "Paid Amount",
        "Balance Amount",
        ],
        datasets: [
          {
            label: "Amount",
            data: [
              this.customerDetail[0]?.totalPaymentAmount,
              this.customerDetail[0]?.totalPaidAmount,
              this.customerDetail[0]?.totalBalanceAmount
            ],  
            backgroundColor: [
              "rgb(54, 162, 235)",
              "rgb(255, 99, 132)",
              "rgb(255,0,0)"
            ]
          },
        ],
      },
      options: {
        responsive: true,
        aspectRatio: this.chart1Ratio,
      },
    });
  }

  loadData(){
    this.analyticsService
    .customerSalesOrdersChartCount(this.custId)
    .subscribe((response: any) => {
      if (response) {
        this.customerDetail = response?.data;
        if(this.custId){
          this.customerChart();
        } else {
        this.customersChart();
      }
      }
    });
  }

  getData() {
    this.userService.getCustomer().subscribe((res) => {
      this.customer = res.data;
    });
    this.loadData();
  }
}
