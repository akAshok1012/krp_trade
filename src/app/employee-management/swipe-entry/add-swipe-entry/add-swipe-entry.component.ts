import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import * as moment from 'moment';

export class list {
  swipeDate: string = "";
  swipeTime: any;
  remarks: string;
  swipeType: any;
}
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
  swipeType = [
    { key: 'IN', value: "IN" },
    { key: 'OUT', value: "OUT" }
  ];
  today = new Date();
  swipeList: Array<list> = [];
  subscription: Subscription;
  data: any;
  empId: number;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
  ) {
    this.swipeEntryId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {

    this.addSwipeEntry = this.fb.group({
      id: [],
      employee: ['', [Validators.required]],
      swipeDate: ['', [Validators.required]],
      employeeSwipeEntryDetails: [[]],
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
        this.addSwipeEntry.controls['swipeDate'].setValue(data.swipeDate);
        this.addSwipeEntry.controls['employeeSwipeEntryDetails'].setValue(data.employeeSwipeEntryDetails);
        this.swipeList = data.employeeSwipeEntryDetails;
        this.addSwipeEntry.controls["updatedBy"].setValue(data.updatedBy);
      })
    } else {
      this.dialogTitle = 'New Entry';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }

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
    });
  }

  ngAfterViewInit() {
    this.addSwipeEntry.valueChanges.subscribe(() => {
      if (this.addSwipeEntry.valid) {
        this.userService.getSwipeList(this.addSwipeEntry.value.employee.id, this.convert(this.addSwipeEntry.value.swipeDate)).subscribe((response) => {
          let data = response.data[0];
          this.swipeEntryId = data?.id;
          this.swipeList = data ? data.employeeSwipeEntryDetails : [];
        });
      }
    });
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  addToList() {
    // this.userService.getSwipeList(this.empId, this.addSwipeEntry.value.swipeDate ? this.convert(this.addSwipeEntry.value.swipeDate) : "").subscribe((response) => {
    //   this.data = response.data;
    // console.log(this.addSwipeEntry.value);

    let itemObj = new list();
    itemObj.swipeDate = this.convert(this.addSwipeEntry.value.swipeDate);
    let t = new Date().getTime();
    itemObj.swipeTime = t;
    itemObj.remarks = '';
    itemObj.swipeType = this.swipeList.length % 2 != 0 ? 'OUT' : 'IN';
    this.swipeList.push(itemObj);
    // this.conditionalReset();
    // });
  }
  //   clickList(){
  //   this.userService.getSwipeList(this.empId,this.addSwipeEntry.value.swipeDate ? this.convert(this.addSwipeEntry.value.swipeDate) : "").subscribe((response) => {
  //     this.data = response.data;
  //     this.addSwipeEntry.controls['swipeDate'].setValue('employeeSwipeEntryDetails.swipeDate');
  //     this.addSwipeEntry.controls['swipeTime'].setValue('employeeSwipeEntryDetails.swipeTime');
  //     this.addSwipeEntry.controls['swipeType'].setValue('employeeSwipeEntryDetails.swipeType');
  //     this.addSwipeEntry.controls['remark'].setValue('employeeSwipeEntryDetails.remark');
  //   });
  // }
  // conditionalReset() {
  //   this.addSwipeEntry.controls['swipeType'].reset();
  // }

  removeObject(row: any) {
    const index: number = this.swipeList.indexOf(row);
    if (index !== -1) {
      if (row.swipeType != 'IN') {
        this.swipeList.splice(index, -2);
      } else {
        this.swipeList.splice(index, 2);
      }
    }
  }

  editList(time, remark, index) {
    console.log(time);
    console.log(remark);

    if (time) {
      this.swipeList[index].swipeTime = time;
    } else {
      this.swipeList[index].remarks = remark;
    }
    console.log(this.swipeList);
  }

  convertTo12HourFormat(inputTime): string { 
    console.log(inputTime);
  const timeParts = inputTime.split(":"); 
  const hours = parseInt(timeParts[0], 10); 
  const minutes = parseInt(timeParts[1], 10); 
  const period = hours >= 12 ? "PM" : "AM"; 
  const hours12hr = (hours % 12 || 12).toString(); 
  return `${hours12hr}:${minutes < 10 ? '0' : ''}${minutes} ${period}`; 
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
      this.employeeControl.reset();
      this.swipeList = []
    }
  }

  onSelect(event) {
    let data = event.option.value;
    this.empId = data.id;
    console.log(this.empId);
    this.addSwipeEntry.controls["employee"].setValue(data);
  }

  onRegister() {
    this.addSwipeEntry.controls['employeeSwipeEntryDetails'].setValue(this.swipeList);
    if (this.swipeEntryId) {
      this.userService.editSwipeEntry(this.swipeEntryId, this.addSwipeEntry.value).subscribe((data: any) => {
        let messages;
        if (data.status === "OK") {
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
      this.addSwipeEntry.controls["employeeSwipeEntryDetails"].setValue(this.swipeList)
      this.userService.postSwipeEntry(this.addSwipeEntry.value).subscribe((data: any) => {
        let message;
        if (data.status === "OK") {
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
