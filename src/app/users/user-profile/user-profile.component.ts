import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgModel, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    public dialog: MatDialog,
  ) { 
    this.userId = authService.currentUserValue.userId
  }

  ngOnInit() {
    this.getData();
    this.updateProfile = this.fb.group({
      user: [this.userId],
      changeUserName:[""],
      name: ["", [Validators.required]],
      email: ["", [Validators.email, Validators.minLength(5)]],
      phoneNumber: ["", [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
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
      // this.updateProfile.controls["changeUserName"].setValue(data.changeUserNamename);
      this.updateProfile.controls["email"].setValue(data.email);
      this.updateProfile.controls["phoneNumber"].setValue(data.phoneNumber);
      this.updateProfile.controls["organization"].setValue(data.organization);
      this.updateProfile.controls["address"].setValue(data.address);
      this.updateProfile.controls["userName"].setValue(data.phoneNumber);
      this.detectChange = false;
    })

  }

  ngAfterViewInit(){
    this.updateProfile.valueChanges.subscribe(()=> {
      this.detectChange = true;
     });
  }

  checkValue(data){
    if(!data){
           this.updateProfile.controls["phoneNumber"].setValue(this.updateProfile.value.userName);
         }
   }

   updateCall() {
    if(this.updateProfile.value.changeUserName){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message : "After updating user name you should login again",
          id: ""
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.update();
          } else {
            this.getData();
          }
        })
    } else {
      this.update();
    }
  }

  update(){
    this.userService
      .updateCustomer(this.userId, this.updateProfile.value)
      .subscribe((res: any) => {
        this.userDetail = res.data;
          let message;
          if (res.status === "OK") {
            if(this.updateProfile.value.changeUserName){
              this.authService.logout();
            } else {
              this.notification.showNotification(
                'top',
                'center',
                message = {
                  "message": res.message,
                  "status": "success"
                },
              )
              this.detectChange = false;
              this.getData();
            }
  }  else {
    this.notification.showNotification(
      'top',
      'center',
      message = {
        "message": res.message,
        "status": "warning"
      },
    )
    this.detectChange = false;
  }
      })
    }
        
}
