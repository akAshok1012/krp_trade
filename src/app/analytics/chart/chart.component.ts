import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'app/core/service/inventory/inventory.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  myData = 
  [
    { "id": 51, "dd": 33, "type": "None" },
    { "id": 52, "dd": 31, "type": "Glazed" },
    { "id": 55, "dd": 35, "type": "Sugar" },
    { "id": 57, "dd": 33, "type": "Powdered" },
    { "id": 56, "dd": 38, "type": "Chocolate" },
    { "id": 54, "dd": 39, "type": "Maple" }
  ]

  // myData.map(d => d.Region),
  // orderDetails : any;
  orderChart: any;
  saleChart: any;
  dailyOrder:  Array<any> = [];
  dailyOrderLable:  Array<any> = [];
  weeklyOrder:  Array<any> = [];
  monthlyOrder:  Array<any> = [];
  dailysale:  Array<any> = [];
  weeklysale:  Array<any> = [];
  monthlysale:  Array<any> = [];
  // events

  constructor(
    private inventoryService: InventoryService,
    private spinner : NgxSpinnerService
  ) { }
	chartOptions: any;

  ngOnInit() {
    this.getData()

  }

  trigger(){
    this.chartOptions = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {
        labels:  this.myData.map(d => d.type),
        datasets: [{
          label: 'My First Dataset',
          data: this.myData.map(d => d.id),
          backgroundColor: [
            'rgb(255, 99, 132)',
          ],
          // hoverOffset: 4
        },
        {
          label: 'My Second Dataset',
          data: this.myData.map(d => d.dd),
          backgroundColor: [
            'rgb(54, 162, 235)',
          ],
          // hoverOffset: 4
        }]
      },
      options: {
        // indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getData(){
    

    // this.inventoryService.getDashboardCountDetails().subscribe((response: any) => {
    //   if (response) {
    //     this.trigger()
    //   }
    // })
  }

}