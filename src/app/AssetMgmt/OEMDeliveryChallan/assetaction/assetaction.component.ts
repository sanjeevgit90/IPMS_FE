import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { OEMDeliveryChallanService } from '../oemdc.service';
import { SharedService } from '../../../service/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateDCAssetComponent } from './../../DeliveryChallan/addasset/updateasset.component';

@Component({
  selector: 'app-assetaction',
  templateUrl: './assetaction.component.html',
  providers: [OEMDeliveryChallanService, AppGlobals, DialogService, SharedService]
})
export class OEMActionComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private _global: AppGlobals,
    private dialogService: DialogService, private sharedService: SharedService, private oemService: OEMDeliveryChallanService, private dialog1: MatDialog,
    public dialogRef: MatDialogRef<OEMActionComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }


  showLoading: boolean = false;
  disable: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Action";
  add = true;
  edit = false;
  list = true;

  ActionData = {
    "approvalStatus": null, "remark": null
  };

  addAssetForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.dialogRef.close(false);
  }
  processDC = function (action) {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addAssetForm.invalid) {
      return;
    }
    this.showLoading = true;

    this.oemService.processDC(this.ActionData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Delivery Challan " + action + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();

          this.dialogRef.close(false);

        })

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  receiveAssetByOEM = function (action) {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addAssetForm.invalid) {
      return;
    }
    this.showLoading = true;
    if (this.ActionData.approvalStatus == 'REPLACED') {
      debugger;
      this.asset = {};
      this.asset.id = this.data.id;
      this.asset.flag = "OEMREPLACED"
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      dialogConfig.data = this.asset;
      this.dialogRef.close(false);
      this.dialog1.open(UpdateDCAssetComponent, dialogConfig).afterClosed().subscribe(res => {
        debugger;

      })
    }
    else {
      this.oemService.receiveAssetByOEM(this.ActionData.approvalStatus, this.data.id, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.successMessage = "Asset is " + action + " successfully.";
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(res => {
            // this.addAssetForm.reset();

            this.dialogRef.close(false);

          })

      }, (error: any) => {
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }

  }

  editon = function (id, flag) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.oemService.taskById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ActionData = resp;

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  ngOnInit(): void {

    this.addAssetForm = this.formBuilder.group({
      approvalStatus: [null, Validators.required],
      remark: [null],
    });
    debugger;
    if (this.data.flag == 'search') {
      this.disable = true;
      this.editon(this.data.id, 'edit');
    }
    else {
      this.disable = false;
    }


  }
  get formControls() {
    return this.addAssetForm.controls;
  }

}

