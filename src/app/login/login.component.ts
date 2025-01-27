import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { PoTaskService } from '../OrderMgmt/purchase-order-task/po-task.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../global/app.global';
import { DialogService } from '../service/dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [LoginService, AppGlobals, PoTaskService, DialogService]
})
export class LoginComponent implements OnInit {

  logindata: any;
  tokenTime: number;

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private loginService: LoginService, private _global: AppGlobals, private poTaskService: PoTaskService,private dialogService: DialogService) { }
  data = { username: "", password: "" };
  showLoading: boolean = false;
  errorHandle: boolean = false;
  loginForm: FormGroup;
  isSubmitted = false;
  errorMessage = "";
  // Login function
  Login = function () {
    
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.showLoading = true;
    sessionStorage.clear();
    this.loginService.LoginUser(this.data).subscribe(res => {
      //debugger;
      this.showLoading = false;
      this.logindata = res;
      var token = 'Bearer ' + res.jwt;
      var username = res.firstName;
      var UserRights = res.userrights;
      var UserDistricts = res.userdistrict;
      
      this.tokenTime = new Date().getTime();
      
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('UserRights', UserRights);
      sessionStorage.setItem('UserDistricts', JSON.stringify(UserDistricts));
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('tokenTime', this.tokenTime);
   
      if(this.route.params.value.flag == "PO" || this.route.params.value.flag == "RC"){
        sessionStorage.setItem('taskId', this.route.params.value.id);
        sessionStorage.setItem('status', this.route.params.value.status);
        this.goToEntityByTaskId(this.route.params.value.id, this.route.params.value.flag);
        //this.router.navigate(['/UpdatePoTask',this.route.params.value.id,"edit",this.route.params.value.flag]);
      } else {
        this.router.navigate(['/Dashboard']);
      }
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error.error.errorDetail[0];
      this.errorMessage = errStr;
    });
  }

  TaskEntityData:any = null;
  goToEntityByTaskId = function(taskId, poRcFlag) {
    //debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.poTaskService.getTaskById(taskId, headers, poRcFlag).subscribe(resp => {
      //debugger;
      this.showLoading = false;
      this.TaskEntityData = resp;
      if(this.TaskEntityData!=null){
        if(poRcFlag=="PO" || poRcFlag=="AMEND"){
          this.router.navigate(['/ViewPoById', this.TaskEntityData.poId, 'POTASK']);
        } else if(poRcFlag=="RC"){
          this.router.navigate(['/ViewRcById', this.TaskEntityData.poId, 'RCTASK']);
        }
      }
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error.error.errorDetail[0];
      this.errorMessage = errStr;
    });
  }
  unlockUser = function (username, token) {
    this.isSubmitted = true;
    // const headers = { "Authorization": sessionStorage.getItem("token") };  
    this.showLoading = true;
    this.loginService.unlockUser(username, token).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Your account has been unlocked successfully";
      this.dialogService.openConfirmDialog(this.successMessage);
    //this.router.navigate(['/']);
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if ((this.route.snapshot.params.username != null) && (this.route.snapshot.params.token != null) )
    {
      this.unlockUser(this.route.snapshot.params.username, this.route.snapshot.params.token);
    }
  }
  get formControls() { return this.loginForm.controls; }
}
