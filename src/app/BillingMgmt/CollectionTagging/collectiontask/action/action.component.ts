import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../../global/app.global';
import { DialogService } from '../../../../service/dialog.service';
import { CollectionTaskService } from '../collectiontask.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  providers: [CollectionTaskService, AppGlobals, DialogService]
})
export class CollectionActionComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, 
    private _global: AppGlobals, private dialogService: DialogService, private taskService: CollectionTaskService,
    public dialogRef: MatDialogRef<CollectionActionComponent>,
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

  addAssetForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.dialogRef.close(false);
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
        this.successMessage = "Collection " + action + " successfully.";
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
      remark: [null, Validators.required],
     
    });

   
    this.editTask(this.data.id);  
    
  }
  get formControls() {
    return this.addAssetForm.controls;
  }

}

