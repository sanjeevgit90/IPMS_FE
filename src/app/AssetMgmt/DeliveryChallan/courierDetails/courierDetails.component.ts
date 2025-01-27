import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { DeliveryChallanService } from '../dc.service';
import { SharedService } from '../../../service/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InterDistrictDCService } from '../../InterDistrictDeliveryChallan/interDC.service';
import { OEMDeliveryChallanService } from '../../OEMDeliveryChallan/oemdc.service';

@Component({
  selector: 'app-courier',
  templateUrl: './courierDetails.component.html',
  providers: [DeliveryChallanService, AppGlobals, DialogService, SharedService, InterDistrictDCService, OEMDeliveryChallanService]
})
export class CourierDetailsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private dcService: DeliveryChallanService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private iddcService: InterDistrictDCService, private oemdcService: OEMDeliveryChallanService,
    public dialogRef: MatDialogRef<CourierDetailsComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }


  showLoading: boolean = false;
  disable = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  flag = '';

  PageTitle = "Courier Details";
  dc = true;
  project = false;
  invoice = false;

  Courier = {
    "courierdate": null, "courierno": null, "courierDetails": null
  };

  addCourierForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.dialogRef.close(false);
  }

  add = function()
  {
    var flag = this.data.flag;
    if (flag =="DC")
  {
    this.addCourierDetails();
  }
  else if (flag =="IDDC")
  {
    this.addIDDCCourierDetails();
  }
  else if (flag =="OEMDC")
  {
    this.addOEMDCCourierDetails();
  }
  }

  addCourierDetails = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addCourierForm.invalid) {
      return;
    }
    this.showLoading = true;
    this.Courier.courierdate = this.Courier.courierdate.getTime();

    this.dcService.addCourierDetails(this.data.id,this.Courier, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Courier details saved successfully.";
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

  addIDDCCourierDetails = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addCourierForm.invalid) {
      return;
    }
    this.showLoading = true;
    this.Courier.courierdate = this.Courier.courierdate.getTime();

    this.iddcService.addCourierDetails(this.data.id,this.Courier, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Courier details saved successfully.";
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

  addOEMDCCourierDetails = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addCourierForm.invalid) {
      return;
    }
    this.showLoading = true;
    this.Courier.courierdate = this.Courier.courierdate.getTime();

    this.oemdcService.addCourierDetails(this.data.id,this.Courier, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Courier details saved successfully.";
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

view = function(id, flag)
{
  if (flag =="DC")
  {
    this.editCourierdetails(id);
  }
  else if (flag =="IDDC")
  {
    this.editIDDCCourierdetails(id);
  }
  else if (flag =="OEMDC")
  {
    this.editOEMDCCourierdetails(id);
  }
}

  editCourierdetails = function (id) {
    debugger;
   
    this.dc = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dcService.courierDetails(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.Courier = resp;
      if (this.Courier.courierdate > 0) {
        this.Courier.courierdate = (new Date(this.Courier.courierdate));  
      }
      else {
        this.Courier.courierdate = null;
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  editIDDCCourierdetails = function (id) {
    debugger;
   
    this.dc = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.iddcService.courierDetails(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.Courier = resp;
      if (this.Courier.courierdate > 0) {
        this.Courier.courierdate = (new Date(this.Courier.courierdate));  
      }
      else {
        this.Courier.courierdate = null;
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  editOEMDCCourierdetails = function (id) {
    debugger;
   
    this.dc = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.oemdcService.courierDetails(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.Courier = resp;
      if (this.Courier.courierdate > 0) {
        this.Courier.courierdate = (new Date(this.Courier.courierdate));  
      }
      else {
        this.Courier.courierdate = null;
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  
  ngOnInit(): void {
    debugger;
    this.addCourierForm = this.formBuilder.group({
      courierno: [null, Validators.required],
      courierdate: [null, Validators.required],
      courierDetails: [null]
    });

    
      this.view(this.data.id, this.data.flag);
  }
  get formControls() {
    return this.addCourierForm.controls;
  }

}

