import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { BillingService } from 'app/core/service/billing/billing.service';
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { sort } from "app/core/models/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MatTableExporterDirective, ExportType } from "mat-table-exporter";
import { ConfirmationDialogComponent } from "app/additional-components/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";


@Component({
  selector: 'app-manage-payment-type',
  templateUrl: './manage-payment-type.component.html',
  styleUrls: ['./manage-payment-type.component.scss']
})
export class ManagePaymentTypeComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  public focus;
  displayedColumns = [
   // "index",
"paymentType",
"description",
"actions",
  ];

  dataSource: any;
  data: any;
  searchTerm: string = "";
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  deleteItem = {
    id:0,
    key : ''
  };

  constructor(
    public router: Router,
    public billingService :BillingService ,
    private notification: NotificationsComponent,
    public dialog:MatDialog,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
    public datepipe:DatePipe

  ) {}

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

    editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/billing/edit-paymentType`]);
  }

  deleteCall(row: any) {
    let name = row.paymentType
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message : "Delete",
        id: name
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if (result) {
        this.deleteRow(row.id);
      } 
    });
  }

  cancel(){
    this.deleteItem.id = 0;
    this.deleteItem.key ='';
  }

  deleteRow(id){
    
    this.billingService.deletePaymentType(id).subscribe((res)=>{
      this.loadData();
      let message;
      this.notification.showNotification(
        'top',
        'right',
         message={
          "message": res.message,
          "status": "danger"
         },
         );
    })
    
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Payment_Type_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Payment Type Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [

          { header: "Payment Type", dataKey: "paymentType" },
          { header: "Description ", dataKey: "description" },         
          
        ],
      }
    );
    doc.save("KPR_Payment_Type_Details_" + this.currentDateTime);
  }

  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear = true;
    this.paginator.firstPage();
this.loadData();
  }

  getPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadData();
  }

  search(){
    this.paginator.firstPage();
    this.loadData();
  }

  public loadData() {
    this.billingService
      .getPaymentType(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.direction.toUpperCase(),
        this.sortEvent.active,
        this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
      
  }
}




