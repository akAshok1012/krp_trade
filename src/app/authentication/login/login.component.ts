import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { Role } from 'app/core/models/role';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService]
})
export class LoginComponent implements OnInit {

  authForm: UntypedFormGroup;
  toogle: boolean = true;
  error = '';
  date : Date = new Date();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private jwtHelper: JwtHelperService
  ) {
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  decodeToken(data:string){
    return this.jwtHelper.decodeToken(data);
  }

  onSubmit() {
    this.authService.logout();
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      
      this.authService
        .login(this.authForm.value.username, this.authForm.value.password).subscribe((response:any) => {
            if (response) {
                setTimeout(() => {
                  const role = this.authService.currentUserValue?.role;
                  if (role === Role.SuperAdmin) {
                    this.router.navigate(['/admin/dashboard/super/dashboard']);
                  } else if (role === Role.Admin) {
                    this.router.navigate(['/admin/dashboard']);
                  } else if (role === Role.Employee) {
                    this.router.navigate(['/employee/dashboard']);
                  } else if (role === Role.Customer) {
                    this.router.navigate(['/user/dashboard']);
                  } else {
                    this.router.navigate(['/authentication/login']);
                  }
                }, 1000);
            } else {
              this.error = 'Invalid credentials';
            }
          },
          (error) => {
            this.error = 'Bad Network !';
          }
        );
    }
  }

}
