import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.scss"],
})
export class AddEmployeeComponent implements OnInit {
  addEmployee: FormGroup;
  departmentControl = new FormControl("");
  filteredDepartmentOptions: Observable<any[]>;
  userId: number;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  Departments: any;
  esiNumbers = '';
  today = new Date();

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
    this.userId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    this.userService.getEmployeeDepartments().subscribe((response: any) => {
      this.Departments = response.data;
      this.filteredDepartmentOptions = this.departmentControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter(name as string) : this.Departments.slice();
        })
      );
    });

    this.addEmployee = this.fb.group({
      id: [],
      name: ["", [Validators.required, Validators.pattern("[a-zA-Z& ]+")]],
      dateOfBirth: ["", [Validators.required]],
      dateOfJoining: ["", [Validators.required]],
      employeeDepartment: ["", [Validators.required]],
      pfNumber: [
        "",
        [
          Validators.pattern(
            "^[A-Z]{2}[A-Z]{3}[0-9]{7}[0-9]{3}[0-9]{7}$"
          ),
        ],
      ],
      esiNumber: ["",
      [
        Validators.pattern(
          "[0-9]{17}"
        ),
      ],],
      panNumber: [
        "",
        [
          Validators.pattern("^([A-Z]){5}([0-9]){4}([A-Z]){1}$"),
        ],
      ],
      uanNumber: ["", [ Validators.pattern("[0-9]{12}")]],
      aadhaarNumber: ["", [Validators.required, Validators.pattern("[0-9]{12}")]],
      email: [
        "",
        [Validators.email, Validators.minLength(5)],
      ],
      phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      address: ['', [Validators.required]],
      // address2: ['', [Validators.required]],
      // district: ['', [Validators.required]],
      // state: ['', [Validators.required]],
      // pincode: ['', [Validators.required]],
      // country: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.userId) {
      
      this.dialogTitle = "Edit Employee";
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getEmployeeById(this.userId).subscribe((res) => {
        let data = res.data;
        if (res.status === "OK") {
          this.addEmployee.controls["id"].setValue(data.id);
          this.addEmployee.controls["name"].setValue(data.name);
          this.addEmployee.controls["dateOfBirth"].setValue(data.dateOfBirth);
          this.addEmployee.controls["employeeDepartment"].setValue(
            data.employeeDepartment
          );
          this.addEmployee.controls["dateOfJoining"].setValue(
            data.dateOfJoining
          );
          this.addEmployee.controls["uanNumber"].setValue(data.uanNumber);
          this.addEmployee.controls["esiNumber"].setValue(data.esiNumber);
          this.addEmployee.controls["pfNumber"].setValue(data.pfNumber);
          this.addEmployee.controls["panNumber"].setValue(data.panNumber);
          this.addEmployee.controls["aadhaarNumber"].setValue(data.aadhaarNumber);
          this.departmentControl.setValue(data.employeeDepartment);
          this.addEmployee.controls["phoneNumber"].setValue(data.phoneNumber);
          this.addEmployee.controls["email"].setValue(data.email);
          this.addEmployee.controls["address"].setValue(data.address);
        }
        let d = data.dateOfJoining;     
      });
    } else {
      this.dialogTitle = "New Employee";
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }

  onPanInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;
  
    const newValue = inputElement.value.toUpperCase();
  
    this.addEmployee.patchValue({ panNumber: newValue }, { emitEvent: false });
  
    // Restore the cursor position
    inputElement.setSelectionRange(cursorStart, cursorEnd);
  }

  onPfInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;
  
    const newValue = inputElement.value.toUpperCase();
  
    this.addEmployee.patchValue({ pfNumber: newValue }, { emitEvent: false });
  
    // Restore the cursor position
    inputElement.setSelectionRange(cursorStart, cursorEnd);
  }
  
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.Departments.filter((option) =>
      option.departmentName.toLowerCase().includes(filterValue)
    );
  }

  regexTest(){  
    const regex = /^\d{0,17}$/;
   if(regex.test(this.addEmployee.value.esiNumber)){
    this.esiNumbers = this.addEmployee.value.esiNumber;
   }
   this.addEmployee.controls["esiNumber"].setValue(this.esiNumbers);

  }

  onNoClick() {
    if (this.userId) {
      this.router.navigate(["/employee/manage-employee"]);
    } else {
    }
  }

  onSelect(event: any) {
    let data = event.option.value
    this.addEmployee.controls["employeeDepartment"].setValue(data);
  }

  public displayPropertyDepartment(value) {
    if (value) {
      return value.departmentName;
    }
  }

  onRegister() {
    if (this.userId) {
      
      this.userService.editEmployee(this.userId, this.addEmployee.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addEmployee.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/employee/manage-employee']);
          
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
          
        }

      })
    } else {
      this.userService.postEmployee(this.addEmployee.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addEmployee.reset();
          this.departmentControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/employee/manage-employee']);
          
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
          
        }
      })
    }
  }
}
