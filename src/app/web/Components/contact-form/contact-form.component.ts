import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrmService } from 'app/core/service/crm/crm.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder,
    private crmService: CrmService,
    ) {}

  ngOnInit(): void {
  this.contactForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.minLength(5)]],
    phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    location: ['', [Validators.required]],
    notes: [''],
    referralSourceType: ['Website'],
    status: ['Interested'],
    updatedBy: ["Website"]
  });
}
  // isControlInvalid(controlName: string): boolean {
  //   const control = this.contactForm.get(controlName);
  //   return !!control && control.invalid;
  // }
  
  // isControlTouched(controlName: string): boolean {
  //   const control = this.contactForm.get(controlName);
  //   return !!control && control.touched;
  // }
  
  // isControlError(controlName: string, errorType: string): boolean {
  //   const control = this.contactForm.get(controlName);
  //   return !!control?.errors && control.errors[errorType];
  // }
  
  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.crmService.postLeadGeneration(this.contactForm.value).subscribe((data: any) => {
        if (data.status === "OK") {}
        this.contactForm.reset();
      })
      // You can perform further actions here, like sending the form data to a server
    }
  }
}
