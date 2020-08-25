import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Log } from '../shared/helper/log.helper';
import { Router } from '@angular/router';
import { SnackbarService } from '../core/snackbar.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth.service';

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
  otp = Boolean(Number(localStorage.getItem('login_otp') || 1));
  firstStepForm = this.formBuilder.group({
    account: ['', [Validators.required]]
  });
  secondStepForm = this.formBuilder.group({
    pass: ['', [Validators.required]]
  });
  guid = '';
  tempId = '';
  account = '';

  ngOnInit(): void {
  }

  request(): void {
    const account = this.firstStepForm.controls.account as FormControl;
    Log.i('LoginComponent#request', account);
    if (account.invalid) {
      this.snackbarService.showMessage('ایمیل یا موبایل یا نام کاربری خود را وارد کنید');
      return;
    }
    this.account = account.value;
    this.authService.request(account.value, this.otp).subscribe({
      next: (response) => {
        Log.i('AuthService#request', response);
        if (response.success) {
          this.guid = response.data.guid;
          this.tempId = response.data.tempId;
          this.step = 2;
        } else {
          this.snackbarService.showMessage(response.message);
        }
      }
    });
  }

  verify(): void {
    const pass = this.secondStepForm.controls.pass as FormControl;
    Log.i('LoginComponent#verify', pass);
    if (pass.invalid) {
      this.snackbarService.showMessage((this.otp) ? 'کد وارد نشده است' : 'رمز عبور وارد نشده است');
      return;
    }
    this.authService.verify(this.guid, this.tempId, this.account, pass.value, this.otp).subscribe({
      next: (response) => {
        Log.i('AuthService#verify', response);
        if (response.success) {
          localStorage.setItem('jwt_token', response.data.token);
          if (!environment.production) {
            localStorage.setItem('b_jwt_token', response.data.token);
          }
          this.router.navigate(['home']);
        } else {
          this.snackbarService.showMessage(response.message);
        }
      }
    });
  }

  firstStep(): void {
    this.step = 1;
    this.secondStepForm.controls.pass.setValue('');
  }

  saveLoginOtp(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.otp = checkbox.checked;
    localStorage.setItem('login_otp', (this.otp) ? '1' : '0');
  }

}
