import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { CrmService } from 'app/core/service/crm/crm.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-lead-followup',
  templateUrl: './add-lead-followup.component.html',
  styleUrls: ['./add-lead-followup.component.scss']
})
export class AddLeadFollowupComponent implements OnInit {

  addLeadFollowup: FormGroup;
  leadGenerationControl = new FormControl("");
  filteredLeadGenerationOptions: Observable<any[]>;
  leadGeneration: any;
  hide = true;
  agree = false;
  LeadFollowupId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  today=new Date();
  currentUser: any;
  name: any;
  status = ["Replied","Opportunity","Quotation","LostQuotation","Interested","Converted","DoNotContact"];


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private crmService: CrmService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.LeadFollowupId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {

    
    this.crmService.getLeadGeneration().subscribe((response: any) => {
      this.name = response.data;
      this.filteredLeadGenerationOptions = this.leadGenerationControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : this.name.slice();
        })
      );
      
    })


    this.addLeadFollowup = this.fb.group({
      id: [],
      leadGeneration: ['', [Validators.required]],
      followUpDate: ['', [Validators.required]],
      notes: [''],
      status: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.LeadFollowupId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = 'Cancel'
      this.crmService.getLeadFollowupById(this.LeadFollowupId).subscribe((res) => {
        let data = res.data
        this.addLeadFollowup.controls["id"].setValue(data.id);
        this.addLeadFollowup.controls["leadGeneration"].setValue(data.leadGeneration);
        this.leadGenerationControl.setValue(data.leadGeneration),
          this.addLeadFollowup.controls["followUpDate"].setValue(data.followUpDate);
        this.addLeadFollowup.controls["notes"].setValue(data.notes);
        this.addLeadFollowup.controls["status"].setValue(data.status);
        this.addLeadFollowup.controls["updatedBy"].setValue(data.updatedBy);
      })
    } else {
      this.dialogTitle = 'New Lead FollowUps';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.name.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }

  onSelect(event: any) {
    let data = event.option.value
    this.addLeadFollowup.controls["leadGeneration"].setValue(data);
  }

  onCancel() {
    if (this.LeadFollowupId) {
      this.router.navigate(['/crm/manage-lead-followup']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.LeadFollowupId) {
      this.router.navigate(['/crm/manage-lead-followup']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onRegister() {
    if (this.LeadFollowupId) {
      
      this.crmService.editLeadFollowup(this.LeadFollowupId, this.addLeadFollowup.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addLeadFollowup.reset();
          this.leadGenerationControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );

          
          this.router.navigate(['/crm/manage-lead-followup']);
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
      this.crmService.postLeadFollowup(this.addLeadFollowup.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addLeadFollowup.reset();
          this.leadGenerationControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          
          this.router.navigate(['/crm/manage-lead-followup']);
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


