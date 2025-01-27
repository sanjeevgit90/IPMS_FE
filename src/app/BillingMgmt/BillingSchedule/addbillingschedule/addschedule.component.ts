import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { BillingScheduleService } from '../billingschedule.service';
import { SharedService } from '../../../service/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-addschedule',
  templateUrl: './addschedule.component.html',
  providers: [BillingScheduleService, AppGlobals, DialogService, SharedService]
})
export class AddScheduleComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private scheduleService: BillingScheduleService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddScheduleComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }


  showLoading: boolean = false;
  disable = false;

  milestoneno: String;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Add Billing Schedule";
  add = true;
  edit = false;
  list = true;

  
  ScheduleData = {
    "id": {}, "dateofbilling": null, "amountofbilling": null, "remark": null
  };

  addScheduleForm: FormGroup;
  isSubmitted = false;
  
  back = function () {
    this.dialogRef.close(false);
  }
  
  addSchedule = function (flag) {
    debugger;
    this.isSubmitted = true;
    this.ScheduleData.dateofbilling = this.ScheduleData.dateofbilling.getTime();
    
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addScheduleForm.invalid) {
      return;
    }
    this.id={};
    this.id.projectid = this.data.id.projectid;
    this.id.milestoneno = this.milestoneno;
    this.ScheduleData.id = this.id;
    this.showLoading = true;
    this.scheduleService.saveSchedule(this.ScheduleData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Billing Schedule " + flag + "d successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.dialogRef.close(false);
          
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.ScheduleData.dateofbilling = (new Date(this.ScheduleData.dateofbilling));
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
 
  // Edit

  editon = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.scheduleService.scheduleById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ScheduleData = resp;
      if (this.ScheduleData.dateofbilling > 0) {
        this.ScheduleData.dateofbilling = (new Date(this.ScheduleData.dateofbilling));
      }
      else {
        this.ScheduleData.dateofbilling = null;
      }
     
      this.milestoneno = this.ScheduleData.id.milestoneno;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
   
    this.addScheduleForm = this.formBuilder.group({
      dateofbilling: [null, Validators.required],
      amountofbilling: [null, Validators.required],
      milestoneno: [null, Validators.required],      
      remark:[null]
    });
 
debugger;
     if (this.data.flag == 'edit') {
      this.PageTitle = "Update Billing Schedule";
      this.editon(this.data.id);
    }
  }
  get formControls() {
    return this.addScheduleForm.controls;
  }

}

