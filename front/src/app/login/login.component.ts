import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Log } from '../shared/helper/log.helper';
import { Router } from '@angular/router';
import { SnackbarService } from '../core/snackbar.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth.service';
import { MDCDialog } from "@material/dialog";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
  }

  step = 1;
  countryCode = localStorage.getItem('country_code') || '98';
  numericOnly = (control) => /^[0-9]+$/g.test(control.value) ? null : {field: 'must be numeric'};
  requestOtpForm = this.formBuilder.group({
    mobile: ['', [Validators.required, Validators.minLength(10), this.numericOnly]]
  });
  verifyOtpForm = this.formBuilder.group({
    otp: ['', [Validators.required, Validators.minLength(6), this.numericOnly]]
  });
  countryCodeForm = this.formBuilder.group({
    code: [`${this.countryCode}`, [Validators.required, Validators.minLength(1), Validators.maxLength(3), this.numericOnly]]
  });
  guid = '';
  tempId = '';
  mobile = '';
  //
  dialog: any;
  @ViewChild('dialogElement', {static: true})
  set dialogElement(value: ElementRef) {
    this.dialog = new MDCDialog(value.nativeElement);
  }

  ngOnInit(): void {
  }

  requestOtp(): void {
    const mobile = this.requestOtpForm.controls.mobile as FormControl;
    Log.i('LoginComponent#requestOtp', mobile);
    if (mobile.invalid) {
      this.snackbarService.showMessage('شماره موبایل باید شامل 10 رقم باشد');
      return;
    }
    this.mobile = `+${this.countryCode}${mobile.value}`;
    this.authService.requestOtp(this.mobile).subscribe({
      next: (response) => {
        Log.i('AuthService#requestOtp', response);
        if (response.success) {
          this.guid = response.data.guid;
          this.tempId = response.data.tempId;
          this.step = 2;
        }
      }
    });
  }

  verifyOtp(): void {
    const otp = this.verifyOtpForm.controls.otp as FormControl;
    Log.i('LoginComponent#verifyOtp', otp);
    if (otp.invalid) {
      this.snackbarService.showMessage('کد باید شامل 6 رقم باشد');
      return;
    }
    this.authService.verifyOtp(this.guid, this.tempId, this.mobile, otp.value).subscribe({
      next: (response) => {
        Log.i('AuthService#verifyOtp', response);
        if (response.success) {
          localStorage.setItem('jwt_token', response.data.token);
          if (!environment.production) {
            localStorage.setItem('b_jwt_token', response.data.token);
          }
          this.router.navigate(['home']);
        }
      }
    });
  }

  firstStep(): void {
    this.step = 1;
  }

  openDialog(): void {
    const code = this.countryCodeForm.controls.code as FormControl;
    code.setValue(`${this.countryCode}`);
    this.dialog.open();
  }

  closeDialog(): void {
    this.dialog.close();
  }

  saveCountryCode(): void {
    const code = this.countryCodeForm.controls.code as FormControl;
    Log.i('LoginComponent#saveCountyCode', code);
    if (code.invalid) {
      this.snackbarService.showMessage('پیش شماره معتبر نیست');
      return;
    }
    this.countryCode = code.value;
    localStorage.setItem('country_code', this.countryCode);
    this.closeDialog();
  }

}
