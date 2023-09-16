import { Component, OnInit, ElementRef } from "@angular/core";
import {
  Location,
} from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";
import { ROUTES } from "../sidebar/sidebarItems";
import { OrdersService } from "app/core/service/orders/orders.service";
import { interval, switchMap } from "rxjs";
import { SharedService } from "app/shared/shared.service";
import { ApproveOrderComponent } from "app/orders-and-cart/approve-order/approve-order.component";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
  providers:[ApproveOrderComponent]
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  currentUser: any;
  currentUserRole: string;
  notification:any = [];
  dataSubscription:any;

  constructor(
    location: Location,
    private router: Router,
    private shared: SharedService,
    public authService: AuthService,
    public orderService: OrdersService,
    public ac: ApproveOrderComponent,
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    this.currentUser =  this.authService.currentUserValue;
    this.currentUserRole = this.authService.currentUserValue.role;
    this.router.events.subscribe((event) => {
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
    if ($(window).width() > 768) {
      this.getData();
      this.dataSubscription = interval(10000) // Repeat every 10 seconds 
          .pipe( 
              switchMap(async () => this.getData()) // Switch to new observable on every interval 
          ) 
          .subscribe(data => { 
              // Do something with the data here 
          }); 
    }
  }

  ngOnDestroy() { 
    if ($(window).width() > 768) {
    this.dataSubscription.unsubscribe(); // Unsubscribe when the component is destroyed 
    }
}

showDetails(data:any){
  if (this.currentUserRole === "EMPLOYEE") {
    this.shared.leaveDetail = data;
    this.router.navigate([`/admin/leave-history`]);
    if(this.getTitle() ==='leave history'){
     this.renderCall();
    }
  } else if(this.currentUserRole === "CUSTOMER") {
    this.shared.orderStatus = data;
    this.router.navigate([`/order&cart/my-orders`]);
    if(this.getTitle() ==='my orders'){
     this.renderCall();
    }
  } else {
  this.shared.orderDetail = data;
    this.router.navigate([`/order&cart/approve-orders`]);
    if(this.getTitle() ==='approve orders'){
     this.renderCall();
    }
  }
  };

  renderCall(){
    setTimeout(()=>{
      window.location.reload();
    }, 500);
  }

  getData() {
    if (this.currentUserRole === "EMPLOYEE") {
      this.orderService.getApprovalStatus_Notification(this.currentUser.userId).subscribe((response)=>{
        this.notification = response.data
      })
    } else if(this.currentUserRole === "CUSTOMER") {
      this.orderService.getOrderIdByCustomerId_Notification(this.currentUser.userId).subscribe((response)=>{
        this.notification = response.data
      })
    } else {
      this.orderService.getOrderId_Notification().subscribe((response)=>{
        this.notification = response.data
      })
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
   if(titlee){
    if (titlee.charAt(0) === "#") {
      var index = titlee.lastIndexOf( "/" );
      titlee = titlee.slice(index + 1).replace("-"," ");
    }
    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      } else {
        return titlee;
      }
    }
   }
  }

  logout() {
    this.authService.logout();
  }
}
