import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


  updateProfile: FormGroup;
  userId: number;
  userRole: string;
  userDetail: any;
  detectChange: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private userService : UserService,
    private authService : AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.userId = authService.currentUserValue.userId
    this.userRole = authService.currentUserValue.role
  }

  ngOnInit() {
    this.getData();
    this.updateProfile = this.fb.group({
      user: [this.userId],
      name: ["", [Validators.required]],
      email: ["", [Validators.email, Validators.minLength(5)]],
      phoneNumber: ["", [Validators.required]],
      dateOfBirth: ["", [Validators.required]],
      aadhaarNumber: ["", [Validators.required]],
      esiNumber: ["", [Validators.pattern(
        "[0-9]{17}"
      )]],
      panNumber: [""],
      pfNumber: [""],
      uanNumber: [""],
      address: ['', [Validators.required]],
      userName: ['', [Validators.required]],
    });
  }

  getData() {
    this.userService.getUserByEmployeeUserId(this.userId).subscribe((res) => {
      let data = res.data;
      this.userDetail = data;
      this.updateProfile.controls["user"].setValue(data.user);
      this.updateProfile.controls["name"].setValue(data.name);
      this.updateProfile.controls["email"].setValue(data.email);
      this.updateProfile.controls["phoneNumber"].setValue(data.phoneNumber);
      this.updateProfile.controls["dateOfBirth"].setValue(data.dateOfBirth);
      this.updateProfile.controls["aadhaarNumber"].setValue(data.aadhaarNumber);
      this.updateProfile.controls["panNumber"].setValue(data.panNumber);
      this.updateProfile.controls["pfNumber"].setValue(data.pfNumber);
      this.updateProfile.controls["esiNumber"].setValue(data.esiNumber);
      this.updateProfile.controls["uanNumber"].setValue(data.uanNumber);
      this.updateProfile.controls["address"].setValue(data.address);
      this.updateProfile.controls["userName"].setValue(data.phoneNumber);
    })

  }

  ngAfterViewInit() {
    this.updateProfile.valueChanges.subscribe(() => {
      this.detectChange = true;
    });
  }
  esiNumbers = ''
  regexTest() {
    const regex = /^\d{0,17}$/;
    if (regex.test(this.updateProfile.value.esiNumber)) {
      this.esiNumbers = this.updateProfile.value.esiNumber;
    }
    this.updateProfile.controls["esiNumber"].setValue(this.esiNumbers);

  }


  update() {

    this.userService
      .updateEmployee(this.userId, this.updateProfile.value)
      .subscribe((res: any) => {
        this.userDetail = res.data;
        if (res.status === "OK") {
          let message;
          this.notification.showNotification(
            'top',
            'center',
            message = {
              "message": res.message,
              "status": "success"
            },
          )
          this.detectChange = false;

        }
      })
  }
}
