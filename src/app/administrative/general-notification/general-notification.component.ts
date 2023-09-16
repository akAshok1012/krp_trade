import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BillingService } from "app/core/service/billing/billing.service";
import { CrmService } from "app/core/service/crm/crm.service";
import { MachineryService } from "app/core/service/machinery/machinery.service";
import { SharedService } from "app/shared/shared.service";

@Component({
  selector: "app-general-notification",
  templateUrl: "./general-notification.component.html",
  styleUrls: ["./general-notification.component.scss"],
})
export class GeneralNotificationComponent implements OnInit {
  spareNotification = [];
  paymentNotification = [];
  leadNotification = [];

  constructor(
    private machineryService: MachineryService,
    private router: Router,
    private billingService: BillingService,
    private crmService: CrmService,
    private shared: SharedService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  action(data, type) {
    this.shared.generalNotification = data;
    if (type === "spare") {
      this.router.navigate(['/machinery/edit-spares']);
    } else if (type === "lead") {
    } else {
    }
  }

  loadData() {
    this.machineryService.getSpare_Notification().subscribe((response) => {
      this.spareNotification = response.data;
    });
    this.billingService.getCredit_Notification().subscribe((response) => {
      this.paymentNotification = response.data;
    });
    this.crmService.getLeadFollowUp_Notification().subscribe((response) => {
      this.leadNotification = response.data;
    });
  }
}
