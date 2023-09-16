import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgModel, UntypedFormBuilder, Validators } from '@angular/forms';
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
  userDetail: any;
  detectChange: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private userService : UserService,
    private authService : AuthService,
    private notification: NotificationsComponent,
  ) { 
    this.userId = authService.currentUserValue.userId
  }

  ngOnInit() {
    this.getData();
    this.updateProfile = this.fb.group({
      user: [this.userId],
      name: ["", [Validators.required]],
      email: ["", [Validators.email, Validators.minLength(5)]],
      phoneNumber: ["", [Validators.required]],
      organization: ["", [Validators.required]],
      address: ['', [Validators.required]],
      userName: ['', [Validators.required]],
    });
  }

  getData(){
    this.userService.getUserByCustonerUserId(this.userId).subscribe((res)=>{
      (res)
      let data = res.data;
      this.userDetail = data;
      this.updateProfile.controls["user"].setValue(data.user);
      this.updateProfile.controls["name"].setValue(data.name);
      this.updateProfile.controls["email"].setValue(data.email);
      this.updateProfile.controls["phoneNumber"].setValue(data.phoneNumber);
      this.updateProfile.controls["organization"].setValue(data.organization);
      this.updateProfile.controls["address"].setValue(data.address);
      this.updateProfile.controls["userName"].setValue(data.phoneNumber);
    })

  }

  ngAfterViewInit(){
    this.updateProfile.valueChanges.subscribe(()=> {
      this.detectChange = true;
     });
  }

  update(){
    
    this.userService
      .updateCustomer(this.userId, this.updateProfile.value)
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
