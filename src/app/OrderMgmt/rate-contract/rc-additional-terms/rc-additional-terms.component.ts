import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { RateContractService } from '../../../OrderMgmt/rate-contract/rate-contract.service';
import { FileuploadService } from '../../../service/fileupload.service';

@Component({
  selector: 'app-rc-additional-terms',
  templateUrl: './rc-additional-terms.component.html',
  providers: [RateContractService, AppGlobals, DialogService, SharedService, FileuploadService]
})
export class RcAdditionalTermsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private rateContractService: RateContractService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private fileuploadService: FileuploadService) { }


  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Additional Terms";
  add = true;
  edit = false;
  list = true;

  addTermsForm: FormGroup;
  isSubmitted = false;

  RCEntityData = {
    "entityId": null, "rateContractNo": null, "contractDate": null, "validTill": null,
    "department": null, "accountName": null, "organisationId": null,
    "contractType": null, "modeOfPayment": null, "dispatchThrough": null,
    "currency": null, "deliveryTerm": null, "suppliersReference": null,
    "maxLimit": 0, "otherReference": null, "supplierName": null, "supplierDetails": null,
    "billFromState": null, "billFromGstNo": null, "buyerName": null,
    "invoiceToAddress": null, "billToAddress": null, "shipToAddress": null,
    "termsConditions": null, "isHistoricData": null, "uploadedTermsAnnexure": null,
    "additionalTerms": null, "includeTerms": null
  };

  uploadedTermsAnnexure: any = [];

  TaskData = { "rcId": null, "poRcFlag": null, "remark": null, "workflowType": null };
  TaskEntityData = {
    "entityId": null, "rcId": null, "uploadFile": null,
    "poRcFlag": null, "stageName": null, "workflowName": null,
    "assignToRole": null, "assignToUser": null, "approvalStatus": null,
    "remark": null
  };
  taskId = null;
  additionalTerms: any = false;

  cancel = function () {
    if (this.route.snapshot.params.task == null) {
      this.router.navigate(['/searchRateContract']);
    } else {
      this.router.navigate(['/searchTask']);
    }
  }

  updateRC = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addTermsForm.invalid) {
      return;
    }
    //this.RCEntityData.contractDate = this.RCEntityData.contractDate.getTime();
    //this.RCEntityData.validTill = this.RCEntityData.validTill.getTime();
    //this.RCEntityData.isHistoricData = this.isHistoricData;

    //If mandatory then check for atleast one fileuploaded
    if (!this.fileuploadService.hasfile(this.uploadedTermsAnnexure)) {
      this.dialogService.openConfirmDialog("Please uplaod annexure.")
      return;
    }
    //Check if all files are uploaded Successfully
    if (!this.fileuploadService.allFilesUploaded(this.uploadedTermsAnnexure)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.RCEntityData.uploadedTermsAnnexure = this.fileuploadService.allUploadedFiles(this.uploadedTermsAnnexure);
    this.showLoading = true;
    this.rateContractService.updateRC(this.RCEntityData, headers, this.RCEntityData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      //this.RCEntityData.contractDate = (new Date(this.RCEntityData.contractDate));
      //this.RCEntityData.validTill = (new Date(this.RCEntityData.validTill));
      this.successMessage = "RC updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage);
      // .afterClosed().subscribe(res => {
      //   this.addTermsForm.reset();
      // })
    }, (error: any) => {
      this.showLoading = false;
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
    var poId = id;
    this.rateContractService.getRCById(poId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.RCEntityData = resp;
      /* this.RCEntityData.contractDate = (new Date(this.RCEntityData.contractDate));
      this.RCEntityData.validTill = (new Date(this.RCEntityData.validTill));
      sessionStorage.setItem('currencyFlag', this.RCEntityData.currency);
      sessionStorage.setItem('isHistoricData', this.RCEntityData.isHistoricData);
      this.compareStateOfAddress(this.RCEntityData.supplierDetails, this.RCEntityData.billToAddress);
      if(this.RCEntityData.billFromGstNo != null){
        if(this.RCEntityData.billFromGstNo == "NA"){
          sessionStorage.setItem('applyGstFlag', "NO");
        } else {
          sessionStorage.setItem('applyGstFlag', "YES");
        }
      } */
      if (this.RCEntityData.uploadedTermsAnnexure != null) {
        this.uploadedTermsAnnexure = this.fileuploadService.getSingleFileArray(this.RCEntityData.uploadedTermsAnnexure);
      }
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  saveTask = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    const errStr = null;
    this.showLoading = true;
    this.TaskData.rcId = this.route.snapshot.params.id;
    this.TaskData.poRcFlag = "RC";
    this.poTaskService.saveRcTask(this.TaskData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskData = {};
      this.successMessage = "Rate contract sent for approval";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.addProductDetailsForm.reset();
          this.router.navigate(['searchRateContract']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get task for resending
  getTaskById = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var taskId = id;
    this.poTaskService.getTaskById(taskId, headers, "RC").subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskEntityData = resp;
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  //re-send task for approval
  reSendTask = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    //this.TaskEntityData.poRcFlag = this.route.snapshot.params.poRcFlag;
    this.TaskEntityData.approvalStatus = "APPROVED";
    this.poTaskService.processTask(this.TaskEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "RC re-sent for approval.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.addPoTaskForm.reset();
          this.router.navigate(['/searchTask']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit() {
    this.addTermsForm = this.formBuilder.group({
      uploadedTermsAnnexure: [null, Validators.required],
      additionalTerms: [null, Validators.required]
    });

    //sessionStorage.setItem("tabFlag", "PO");

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Additional Terms";
      this.editon(this.route.snapshot.params.id);
      //this.disabledField();
    }

    this.additionalTerms = sessionStorage.getItem("additionalTerms");
  }

  get formControls() {
    return this.addTermsForm.controls;
  }
}