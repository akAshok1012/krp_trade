import { Component, OnInit, Renderer2 } from "@angular/core";
import { Role } from "app/core/models/role";
import { ROUTES } from "./sidebarItems";
import { Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";
import { OrdersService } from "app/core/service/orders/orders.service";
import { interval, switchMap } from "rxjs";
import { SharedService } from "app/shared/shared.service";
import { Location } from "@angular/common";

declare const $: any;

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  public sidebarItems: any[];
  userType: string;
  userRole: string;
  routeRole: string;
  notification: any = [];
  dataSubscription: any;
  activeRoute:string;

  constructor(
    private router: Router,
    private shared: SharedService,
    public authService: AuthService,
    public location: Location,
    public orderService: OrdersService
  ) {
  }

  ngOnInit() {
    this.userRole = this.authService.currentUserValue.role;
    this.blockActive();
    this.router.events.subscribe((event:any) => {
    this.blockActive();
    });

    this.sidebarItems = ROUTES.filter(
      (x) =>
        x.role.indexOf(this.userRole) !== -1 || x.role.indexOf("All") !== -1
    );
    if (this.userRole === Role.SuperAdmin) {
      this.userType = Role.Admin;
      this.routeRole = "/admin/dashboard/super/dashboard";
    } else if (this.userRole === Role.Admin) {
      this.userType = Role.Admin;
      this.routeRole = "/admin/dashboard";
    }  else if (this.userRole === Role.Employee) {
      this.userType = Role.Employee;
      this.routeRole = "/employee/dashboard";
    } else if (this.userRole === Role.Customer) {
      this.userType = Role.Customer;
      this.routeRole = "/user/dashboard";
    } else {
      this.userType = Role.Admin;
    }

    if ($(window).width() < 768) {
      this.getData();
      this.dataSubscription = interval(10000) // Repeat every 10 seconds
        .pipe(
          switchMap(async () => this.getData()) // Switch to new observable on every interval
        )
        .subscribe((data) => {
          // Do something with the data here
        });
    }
  }

  blockActive(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee){
      if (titlee.charAt(0) === "#") {
       var index = titlee.lastIndexOf( "/" );
       titlee = titlee.slice(index + 1);
     if(titlee.slice(0,4) === 'edit' || titlee.slice(0,4) === 'add-' || titlee.slice(0,4) === 'crea'){
     } else {
      this.activeRoute = this.router.url;
     }
  }
  }
}

  getData() {
    if (this.userRole === "EMPLOYEE") {
      
    } else if(this.userRole === "CUSTOMER") {
      // let userId =  this.authService.currentUserValue.userId;
      // this.orderService.getOrderIdByCustomerId_Notification(userId).subscribe((response)=>{
      //   this.notification = response.data
      // })
    } else {
      this.orderService.getOrderId_Notification().subscribe((response)=>{
        this.notification = response.data
      })
    }
  }

  ngOnDestroy() {
    if ($(window).width() < 768) {
      this.dataSubscription.unsubscribe(); // Unsubscribe when the component is destroyed
    }
  }

  showDetails(data: any) {
    this.shared.toEdit = data.orderId;
    this.router.navigate([`/order&cart/approve-orders`]);
  }

  isMobileMenu() {
    if ($(window).width() > 768) {
      return false;
    }
    return true;
  }

  logout() {
    this.authService.logout();
  }
}
