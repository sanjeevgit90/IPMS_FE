import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangePasswordService } from './change-password.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { SharedService } from 'src/app/service/shared.service';
import { DialogService } from 'src/app/service/dialog.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  providers: [ChangePasswordService, AppGlobals, DialogService, SharedService]
})
export class ChangePasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private changePasswordService: ChangePasswordService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService
  ) { }

  chngPasswordData = {
   "newPassword": null, "oldPassword": null
  };
  changepasswordForm: FormGroup;
  isSubmitted = false;
  errorMessage = "";
  showLoading: boolean = false;
  errorHandle: boolean = false;
  back() {
    this.router.navigate(['/profile'])
  }

  chngpassword = function () {  
      this.isSubmitted = true;
      if (this.changepasswordForm.invalid) {
        return;
      }
      const headers = { "Authorization": sessionStorage.getItem("token") };  
      this.showLoading = true;
      this.changePasswordService.changepassword(this.chngPasswordData, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.successMessage = "Password change successfully.";
        this.dialogService.openConfirmDialog(this.successMessage)  
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  

    
  ngOnInit(): void {
    //Fromgroup collection
    this.changepasswordForm = this.formBuilder.group({
     // username: ['', Validators.required],
      newPassword: ['', Validators.required],
      oldPassword: ['', Validators.required]
    });
  }
  get formControls() { return this.changepasswordForm.controls; }
}
