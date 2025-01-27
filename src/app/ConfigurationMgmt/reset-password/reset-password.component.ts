import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResetPasswordService } from './Reset-password.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { SharedService } from 'src/app/service/shared.service';
import { DialogService } from 'src/app/service/dialog.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  providers: [ResetPasswordService, AppGlobals, DialogService, SharedService]
})
export class ResetPasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private resetPasswordService: ResetPasswordService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService
  ) { }

  resetPasswordData = {
    "username": null, "newPassword": null, "token": null
  };
  resetpasswordForm: FormGroup;
  isSubmitted = false;
  errorMessage = "";
  showLoading: boolean = false;
  errorHandle: boolean = false;
  back() {
    this.router.navigate(['/forgotpassword'])
  }

  resetpass = function () {  
      this.isSubmitted = true;
      if (this.resetpasswordForm.invalid) {
        return;
      }
      const headers = { "Authorization": sessionStorage.getItem("token") };  
      this.showLoading = true;
      this.resetPasswordService.resetpassword(this.resetPasswordData, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.successMessage = "Password reset successfully.";
        this.dialogService.openConfirmDialog(this.successMessage);
        this.router.navigate(['/']);
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  

    
  ngOnInit(): void {
    //Fromgroup collection
    this.resetpasswordForm = this.formBuilder.group({
      username: ['', Validators.required],
      newPassword: ['', Validators.required],
      token: ['', Validators.required]
    });
  }
  get formControls() { return this.resetpasswordForm.controls; }
}
