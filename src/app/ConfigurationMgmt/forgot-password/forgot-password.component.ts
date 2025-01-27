import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ForgotPasswordService } from './forgot-password.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { SharedService } from 'src/app/service/shared.service';
import { DialogService } from 'src/app/service/dialog.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  providers: [ForgotPasswordService, AppGlobals, DialogService, SharedService]

})
export class ForgotPasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private forgotPasswordService: ForgotPasswordService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService
  ) { }

  forgotPasswordData = {
    "username": null
  };
  forgotpasswordForm: FormGroup;
  isSubmitted = false;
  errorMessage = "";
  showLoading: boolean = false;
  errorHandle: boolean = false;
  back() {
    this.router.navigate(['/'])
  }

  forgotpassword = function () {
    this.isSubmitted = true;
    if (this.forgotpasswordForm.invalid) {
      return;
    }
    // const headers = { "Authorization": sessionStorage.getItem("token") };  
    this.showLoading = true;
    this.forgotPasswordService.forgotpassword(this.forgotPasswordData).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Password has been sent to your registered email ";
      this.dialogService.openConfirmDialog(this.successMessage);
      this.router.navigate(['/resetpassword']);
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  ngOnInit(): void {
    //Fromgroup collection
    this.forgotpasswordForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }
  get formControls() { return this.forgotpasswordForm.controls; }
}
