import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../../global/app.global';
import { DialogService } from '../../../../service/dialog.service';
import { PrsTaskService } from '../prstask.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prsaction',
  templateUrl: './prsaction.component.html',
  providers: [PrsTaskService, AppGlobals, DialogService]
})
export class PrsActionComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, 
    private _global: AppGlobals, private dialogService: DialogService, private taskService: PrsTaskService,
    public dialogRef: MatDialogRef<PrsActionComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }


  showLoading: boolean = false;
  disable = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  flag= '';

  PageTitle = "Action";
  
  ActionData = {
    "approvalStatus": null, "remark": null, 
  };
  taskHistoryList:any=[];
  addAssetForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.dialogRef.close(false);
  }
  getHistoryDataById = function (entityId) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.getHistoryDataById(entityId, headers).subscribe(resp => {
      debugger;
      this.taskHistoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  processTask = function (action) {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addAssetForm.invalid) {
      return;
    }
    this.showLoading = true;
   
      this.taskService.processTask(this.ActionData, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.successMessage = "PRS " + action.toLowerCase() + " successfully.";
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(res => {
           // this.addAssetForm.reset();
                 this.dialogRef.close(false);
            
          })
  
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
   
  }
  
  editTask = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.taskById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ActionData = resp;
    this.getHistoryDataById(this.ActionData.prsId);
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

 
  ngOnInit(): void {
   debugger;
    this.addAssetForm = this.formBuilder.group({
      approvalStatus: [null, Validators.required],
      remark: [null],
     
    });

   
    this.editTask(this.data.id);  
    
  }
  get formControls() {
    return this.addAssetForm.controls;
  }

}

