import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { PurchaseOrderService } from '../../../OrderMgmt/purchase-order/purchase-order.service';
import { FileuploadService } from '../../../service/fileupload.service';
import { PoTaskService } from '../../../OrderMgmt/purchase-order-task/po-task.service';

@Component({
  selector: 'app-additional-terms',
  templateUrl: './additional-terms.component.html',
  providers: [PurchaseOrderService, AppGlobals, DialogService, SharedService, FileuploadService, PoTaskService]
})
export class AdditionalTermsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private purchaseOrderService: PurchaseOrderService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private fileuploadService: FileuploadService,
    private poTaskService: PoTaskService) { }


  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  //additionalTerms: any = false;

  PageTitle = "Additional Terms";
  add = true;
  edit = false;
  list = true;

  addTermsForm: FormGroup;
  isSubmitted = false;
  matSelectDuration = this._global.matSelectDurationTime;


  POEntityData = {
    "entityId": null, "purchaseOrderNo": null, "orderDate": null, "poMadeFrom": null,
    "rateContractId": null, "department": null, "accountName": null,
    "organisationId": null, "orderType": null, "modeOfPayment": null,
    "dispatchThrough": null, "currency": null, "deliveryTerm": null,
    "paymentMethod": null, "suppliersReference": null, "discountAmt": 0,
    "otherReference": null, "supplierName": null, "supplierDetails": null,
    "billFromState": null, "billFromGstNo": null, "buyerName": null,
    "invoiceToAddress": null, "billToAddress": null, "shipToAddress": null,
    "termsConditions": null, "isHistoricData": null, "uploadedTermsAnnexure": null,
    "additionalTerms": null, "includeTerms": null
  };

  uploadedTermsAnnexure: any = [];

  TaskData = { "poId": null, "poRcFlag": null, "remark": null, "workflowType": null, "workflowName": null };
  TaskEntityData = {
    "entityId": null, "poId": null, "uploadFile": null,
    "poRcFlag": null, "stageName": null, "workflowName": null,
    "assignToRole": null, "assignToUser": null, "approvalStatus": null,
    "remark": null
  };
  workflowDiv: boolean = false;
  taskId = null;
  rcId: any = null;

  cancel = function () {
    if (this.route.snapshot.params.task == null) {
      this.router.navigate(['/searchPurchaseOrder']);
    } else {
      this.router.navigate(['/searchTask']);
    }
  }

  updatePO = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addTermsForm.invalid) {
      return;
    }
    //this.POEntityData.orderDate = this.POEntityData.orderDate.getTime();
    //this.POEntityData.isHistoricData = this.isHistoricData;

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
    this.POEntityData.uploadedTermsAnnexure = this.fileuploadService.getFirstFilePath(this.uploadedTermsAnnexure);
    this.showLoading = true;
    this.purchaseOrderService.updatePO(this.POEntityData, headers, this.POEntityData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      //this.POEntityData.orderDate = (new Date(this.POEntityData.orderDate));
      this.successMessage = "PO updated successfully.";
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
    this.purchaseOrderService.getPOById(poId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.POEntityData = resp;
      /* this.POEntityData.orderDate = (new Date(this.POEntityData.orderDate));
      sessionStorage.setItem('currencyFlag', this.POEntityData.currency);
      sessionStorage.setItem('isHistoricData', this.POEntityData.isHistoricData);
      this.compareStateOfAddress(this.POEntityData.supplierDetails, this.POEntityData.billToAddress);
      if(this.POEntityData.billFromGstNo != null){
        if(this.POEntityData.billFromGstNo == "NA"){
          sessionStorage.setItem('applyGstFlag', "NO");
        } else {
          sessionStorage.setItem('applyGstFlag', "YES");
        }
      }
      this.checked = (this.POEntityData.isHistoricData == "YES") ? true : false; */
      if (this.POEntityData.uploadedTermsAnnexure != null) {
        this.uploadedTermsAnnexure = this.fileuploadService.getSingleFileArray(this.POEntityData.uploadedTermsAnnexure);
      }
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  openTask = function () {
    /* if($rootScope.poMadeFrom =="RC")
    {
      vm.task.poMadeFrom= $rootScope.poMadeFrom;
      vm.saveTask();
    }
    else
    {
      vm.task.poMadeFrom= "";
      vm.workflow();
      vm.openDiv=true;
    } */

    if (this.taskId == null) {
      if (this.rcId == null) {
        this.getAllWorkflowsByType();
        this.workflowDiv = true;
      } else {
        this.TaskData.workflowName = this._global.poRcWorkflow;
        this.workflowDiv = true;
        //this.saveTask();
      }
    } else {
      this.reSendTask();
    }
  }

  closeTask = function () {
    this.workflowDiv = false;
  }

  saveTask = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    const errStr = null;
    if (this.TaskData.workflowName == null || this.TaskData.workflowName == "") {
      this.dialogService.openConfirmDialog("Please select workflow.");
      return;
    }
    if (this.TaskData.remark == null || this.TaskData.remark == "") {
      this.dialogService.openConfirmDialog("Please enter remark.");
      return;
    }
    this.showLoading = true;
    this.TaskData.poId = this.route.snapshot.params.id;
    this.TaskData.poRcFlag = "PO";
    this.poTaskService.saveTask(this.TaskData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskData = {};
      this.successMessage = "Order sent for approval";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.addProductDetailsForm.reset();
          this.router.navigate(['searchPurchaseOrder']);
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
    this.poTaskService.getTaskById(taskId, headers, "PO").subscribe(resp => {
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
      this.successMessage = "PO re-sent for approval.";
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

  // getting workflow list
  WorkflowRequest = { "workflowType": null, "projectType": null, "organisation": null };
  workflowList: any = [];
  getAllWorkflowsByType = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    let orgName = sessionStorage.getItem("poOrgName");
    if (orgName == "Aurionpro Solutions Ltd") {
      this.WorkflowRequest.workflowType = "PO";
    } else {
      this.WorkflowRequest.workflowType = "BRAVO PO";
      this.WorkflowRequest.projectType = sessionStorage.getItem("poProjectType");
      this.WorkflowRequest.organisation = sessionStorage.getItem("poOrgId");
    }
    this.showLoading = true;
    this.sharedService.getAllWorkflowsByType(this.WorkflowRequest, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.workflowList = resp;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit() {
    this.addTermsForm = this.formBuilder.group({
      uploadedTermsAnnexure: [null],
      additionalTerms: [null, Validators.required],
      workflowName: [null],
      remark: [null]
    });

    //sessionStorage.setItem("tabFlag", "PO");

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Additional Terms";
      this.editon(this.route.snapshot.params.id);
      //this.disabledField();
    }

    if (this.route.snapshot.params.task != null) {
      this.taskId = this.route.snapshot.params.task;
      this.getTaskById(this.taskId);
    }

    //this.additionalTerms = sessionStorage.getItem("additionalTerms");
    this.rcId = sessionStorage.getItem("rcId");
  }

  get formControls() {
    return this.addTermsForm.controls;
  }
}