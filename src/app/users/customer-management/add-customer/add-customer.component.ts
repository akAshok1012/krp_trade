import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  Validators,
  FormGroup,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.scss"],
})
export class AddCustomerComponent implements OnInit {
  addCustomer: FormGroup;
  userId: number;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  customerType=['TEMPORARY','PERMANENT'];


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
  ) {
    this.userId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {
    this.addCustomer = this.fb.group({
      id: [],
      name: ["", [Validators.required]],
      email: ["", [Validators.email, Validators.minLength(5)]],
      phoneNumber: ["", [Validators.required]],
      organization: ["", [Validators.required]],
      address: ['', [Validators.required]],
      customerType: ['', [Validators.required]],
      followUpDays: ['', [Validators.required]],
      gstNo: ["", [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"), Validators.maxLength(15)]],
      panNo: ["", [Validators.pattern("^([A-Z]){5}([0-9]){4}([A-Z]){1}$")]],
      updatedBy: [this.currentUser],
    });
    if (this.userId) {
      this.dialogTitle = "Edit";
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      let data;
      this.userService.getCustomerById(this.userId).subscribe((res) => {
        data = res.data;
        this.addCustomer.controls["id"].setValue(data.id);
        this.addCustomer.controls["name"].setValue(data.name);
        this.addCustomer.controls["email"].setValue(data.email);
        this.addCustomer.controls["customerType"].setValue(data.customerType);
        this.addCustomer.controls["followUpDays"].setValue(data.followUpDays);
        this.addCustomer.controls["phoneNumber"].setValue(data.phoneNumber);
        this.addCustomer.controls["organization"].setValue(data.organization);
        this.addCustomer.controls["address"].setValue(data.address);
        this.addCustomer.controls["gstNo"].setValue(data.gstNo);
        this.addCustomer.controls["panNo"].setValue(data.panNo);
      });
    } else {
      this.dialogTitle = "New Customer";
      this.buttonTitle = "Save";
      this.cancelButton = "Reset"
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onNoClick() {
    if (this.userId) {
      this.router.navigate(["/user/manage-customer"]);
    }
  }

  onRegister() {
    if (this.userId) {
      this.userService
        .editCustomer(this.userId, this.addCustomer.value)
        .subscribe((data: any) => {
            let message;
            if (data.status === "OK") {
            this.addCustomer.reset();
            this.notification.showNotification(
              'top',
              'right',
              message = {
                "message": data.message,
                "status": "info"
              },
            );
            if (data.status === "OK") {
              this.router.navigate(["/user/manage-customer"]);
            }
          }
          else {
            this.addCustomer.reset();
            this.notification.showNotification(
              'top',
              'right',
              message = {
                "message": data.message,
                "status": "warning"
              },
            );
          }
        });
    } else {
      this.userService
        .postCustomer(this.addCustomer.value)
        .subscribe((data: any) => {
            let message;
            if (data.status === "OK") {
            this.addCustomer.reset();
            this.notification.showNotification(
              'top',
              'right',
              message = {
                "message": data.message,
                "status": "success"
              },
            );
            this.router.navigate(["/user/manage-customer"]);
          }
          else {
            this.addCustomer.reset();
            this.notification.showNotification(
              'top',
              'right',
              message = {
                "message": data.message,
                "status": "warning"
              },
            );
          }
        });
    }
  }
}
