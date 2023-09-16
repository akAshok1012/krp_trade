import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-swipe-entry',
  templateUrl: './add-swipe-entry.component.html',
  styleUrls: ['./add-swipe-entry.component.scss']
})
export class AddSwipeEntryComponent implements OnInit {

  addSwipeEntry: FormGroup;
  employeeControl = new FormControl("");
  filteredEmployeeOptions: Observable<any[]>;
  swipeEntryId: number
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  formValue: any;
  employeeData: any;
  swipeType = ["IN", "OUT"];
  today=new Date();

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.swipeEntryId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    
    this.userService.getEmployee().subscribe((response: any) => {
      this.employeeData = response.data;
      this.filteredEmployeeOptions = this.employeeControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : this.employeeData.slice();
        })
      );
      
    })


    this.addSwipeEntry = this.fb.group({
      id: [],
      employee: ['', [Validators.required]],
      swipeDate: ['', [Validators.required]],
      swipeType: ['', [Validators.required]],
      remarks:  ['', [Validators.required]],
      // swipeTime: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.swipeEntryId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getSwipeEntryById(this.swipeEntryId).subscribe((res) => {
        let data = res.data;
    
          this.addSwipeEntry.controls["id"].setValue(data.id);
          this.addSwipeEntry.controls["employee"].setValue(data.employee);
          this.employeeControl.setValue(data.employee);
          this.addSwipeEntry.controls["swipeDate"].setValue(data.swipeDate);
          this.addSwipeEntry.controls["remarks"].setValue(data.remarks);
          this.addSwipeEntry.controls["swipeType"].setValue(data.swipeType);
          this.addSwipeEntry.controls["updatedBy"].setValue(data.updatedBy);  
      })
    } else {
      this.dialogTitle = 'New Entry';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.employeeData.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  } 

  onNoClick() {
    if (this.swipeEntryId) {
      this.router.navigate(['/employee/manage-swipe-entry']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  } 

  onSelect(event: any) {
    let data = event.option.value;
    this.addSwipeEntry.controls["employee"].setValue(data);
  }


  onRegister() {

    if (this.swipeEntryId) {
      
      this.userService.editSwipeEntry(this.swipeEntryId, this.addSwipeEntry.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let messages;
          this.notification.showNotification(
            'top',
            'right',
            messages = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/employee/manage-swipe-entry']);
          
        }
        else {
          let messages;
          this.notification.showNotification(
            'top',
            'right',
            messages = {
              "message": data.message,
              "status": "warning"
            },
          );
          
          this.router.navigate(['/employee/manage-swipe-entry']);
        }
      })
    } else {
      this.userService.postSwipeEntry(this.addSwipeEntry.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addSwipeEntry.reset();
          this.employeeControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          
          this.router.navigate(['/employee/manage-swipe-entry']);
        }
        else {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "warning"
            },
          );
          
          this.router.navigate(['/employee/manage-swipe-entry']);
        }
      })
    }
  }
}
