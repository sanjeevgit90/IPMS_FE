import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { GrnMasterService } from '../grn-master.service';
import { FileuploadService } from '../../../service/fileupload.service';
import { MatTableDataSource } from '@angular/material/table';
import { GrnTaskService } from '../../../OrderMgmt/grn-task/grn-task.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-grn',
  templateUrl: './add-grn.component.html',
  providers: [GrnMasterService, AppGlobals, DialogService, SharedService, FileuploadService, GrnTaskService]
})
export class AddGrnComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private grnMasterService: GrnMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private fileuploadService: FileuploadService, private grnTaskService: GrnTaskService, private cdr: ChangeDetectorRef) { }

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

  displayedColumns: string[] = ['productName', 'quantity', 'receivedQuantity', 'acceptedQuantity', 'rejectedQuantity'];
  //productDetails: MatTableDataSource<any>;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;



  PageTitle = "Add GRN";
  add = true;
  edit = false;
  list = true;
  view = false;

  addGrnForm: FormGroup;
  isSubmitted = false;

  GrnData = {
    "grnNumber": null, "grnDate": null, "deliveryDate": null, "deliveryChallanNo": null, "deliveryChallanDate": null,
    "invoiceNo": null, "invoiceDate": null, "description": null, "vehicleNo": null, "transporterName": null,
    "dcCopyUpload": null, "lrCopyUpload": null, "poNo": null, "approvalStatus": null, "entityId": null, "prodDetails": null,
    "prodList": null
  };

  TaskEntityData = {
    "entityId": null, "grnId": null, "stageName": null, "workflowName": null,
    "assignToRole": null, "assignToUser": null, "approvalStatus": null,
    "remark": null
  };

  poList: any = [];
  dcCopyUpload: any = [];
  lrCopyUpload: any = [];
  taskId = null;
  filteredPoList: any = [];

  compareObjects(o1: any, o2: any): boolean {
    //return o1.name === o2.name && o1.id === o2.id;
    return o1 == o2;
  }

  cancel = function () {
    if (this.route.snapshot.params.task === undefined || this.route.snapshot.params.task == null) {
      this.router.navigate(['/grnMasterSearch']);
    } else {
      this.router.navigate(['/grnTaskSearch']);
    }
  }

  saveGrn = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addGrnForm.invalid) {
      return;
    }
    var error = "";
    if (this.GrnData.grnNumber == null) {
      error += "GRN no. is required.\n";
    }
    if (this.GrnData.grnDate == null) {
      error += "GRN date is required.\n";
    }
    if (this.GrnData.deliveryDate == null) {
      error += "Delivery date is required.\n";
    }
    if (this.GrnData.poNo == null) {
      error += "Purchase order is required.\n";
    }
    if (this.GrnData.poNo != null) {
      if (this.productDetails.length != this.prodDetails.length) {
        error += "Please fill all the accepted quantities of products.\n";
      } else {
        this.GrnData.prodDetails = this.prodDetails;
      }
    }
    if (error != "") {
      this.dialogService.openConfirmDialog(error);
      return;
    }
    //Check if files are uploaded Successfully
    if (this.dcCopyUpload.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.dcCopyUpload)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.GrnData.dcCopyUpload = this.fileuploadService.getFirstFilePath(this.dcCopyUpload);
    }
    //Check if files are uploaded Successfully
    if (this.lrCopyUpload.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.lrCopyUpload)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.GrnData.lrCopyUpload = this.fileuploadService.getFirstFilePath(this.lrCopyUpload);
    }

    this.GrnData.grnDate = this.GrnData.grnDate.getTime();
    this.GrnData.deliveryDate = this.GrnData.deliveryDate.getTime();
    if (this.GrnData.deliveryChallanDate != null) {
      this.GrnData.deliveryChallanDate = this.GrnData.deliveryChallanDate.getTime();
    }
    if (this.GrnData.invoiceDate != null) {
      this.GrnData.invoiceDate = this.GrnData.invoiceDate.getTime();
    }

    //this.GrnData.prodDetails = this.productDetails;
    //return;

    this.showLoading = true;
    this.grnMasterService.saveGrn(this.GrnData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "GRN created successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addGrnForm.reset();
          this.dcCopyUpload = [];
          this.lrCopyUpload = [];
          this.prodDetails = [];
          this.productDetails = {};
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.GrnData.grnDate = (new Date(this.GrnData.grnDate));
      this.GrnData.deliveryDate = (new Date(this.GrnData.deliveryDate));
      if (this.GrnData.deliveryChallanDate != null) {
        this.GrnData.deliveryChallanDate = (new Date(this.GrnData.deliveryChallanDate));
      }
      if (this.GrnData.invoiceDate != null) {
        this.GrnData.invoiceDate = (new Date(this.GrnData.invoiceDate));
      }
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  updateGrn = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addGrnForm.invalid) {
      return;
    }
    var error = "";
    if (this.GrnData.grnNumber == null) {
      error += "GRN no. is required.\n";
    }
    if (this.GrnData.grnDate == null) {
      error += "GRN date is required.\n";
    }
    if (this.GrnData.deliveryDate == null) {
      error += "Delivery date is required.\n";
    }
    if (this.GrnData.poNo == null) {
      error += "Purchase order is required.\n";
    }
    for (var i = 0; i < this.productDetails.length; i++) {
      if (this.productDetails[i].acceptedQuantity === undefined) {
        error += "Accepted quantity can not be NULL or can not exceed the total quantity.\n";
      }
      if (this.productDetails[i].acceptedQuantity == null) {
        error += "Accepted quantity can not be NULL.\n";
      }
    }
    if (error != "") {
      this.dialogService.openConfirmDialog(error);
      return;
    }
    //Check if files are uploaded Successfully
    if (this.dcCopyUpload.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.dcCopyUpload)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.GrnData.dcCopyUpload = this.fileuploadService.getFirstFilePath(this.dcCopyUpload);
    }
    //Check if files are uploaded Successfully
    if (this.lrCopyUpload.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.lrCopyUpload)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.GrnData.lrCopyUpload = this.fileuploadService.getFirstFilePath(this.lrCopyUpload);
    }

    this.GrnData.prodDetails = this.productDetails;

    this.GrnData.grnDate = this.GrnData.grnDate.getTime();
    this.GrnData.deliveryDate = this.GrnData.deliveryDate.getTime();
    if (this.GrnData.deliveryChallanDate != null) {
      this.GrnData.deliveryChallanDate = this.GrnData.deliveryChallanDate.getTime();
    }
    if (this.GrnData.invoiceDate != null) {
      this.GrnData.invoiceDate = this.GrnData.invoiceDate.getTime();
    }

    this.showLoading = true;
    this.grnMasterService.updateGrn(this.GrnData, headers, this.GrnData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "GRN updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addGrnForm.reset();
          this.dcCopyUpload = [];
          this.lrCopyUpload = [];
          this.prodDetails = [];
          this.productDetails = {};
          if (this.route.snapshot.params.task === undefined || this.route.snapshot.params.task == null) {
            this.router.navigate(['/grnMasterSearch']);
          } else {
            this.router.navigate(['/grnTaskSearch']);
          }
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.GrnData.grnDate = (new Date(this.GrnData.grnDate));
      this.GrnData.deliveryDate = (new Date(this.GrnData.deliveryDate));
      if (this.GrnData.deliveryChallanDate != null) {
        this.GrnData.deliveryChallanDate = (new Date(this.GrnData.deliveryChallanDate));
      }
      if (this.GrnData.invoiceDate != null) {
        this.GrnData.invoiceDate = (new Date(this.GrnData.invoiceDate));
      }
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Edit
  editon = function (id) {
    //debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.grnMasterService.getGrnById(id, headers).subscribe(resp => {
      //debugger;
      this.showLoading = false;
      this.GrnData = resp;
      this.GrnData.poNo = this.GrnData.poNo.toString();
      console.log(resp);
      console.log(this.GrnData.poNo);
      this.GrnData.grnDate = (new Date(this.GrnData.grnDate));
      this.GrnData.deliveryDate = (new Date(this.GrnData.deliveryDate));
      if (this.GrnData.deliveryChallanDate != null) {
        this.GrnData.deliveryChallanDate = (new Date(this.GrnData.deliveryChallanDate));
      }
      if (this.GrnData.invoiceDate != null) {
        this.GrnData.invoiceDate = (new Date(this.GrnData.invoiceDate));
      }
      if (this.GrnData.dcCopyUpload != null) {
        this.dcCopyUpload = this.fileuploadService.getSingleFileArray(this.GrnData.dcCopyUpload);
      }
      if (this.GrnData.lrCopyUpload != null) {
        this.lrCopyUpload = this.fileuploadService.getSingleFileArray(this.GrnData.lrCopyUpload);
      }
      //this.productDetails = this.GrnData.prodViewDetails;
      this.productDetails = this.GrnData.prodList;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getPoList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getApprovedPoList(headers).subscribe(resp => {
      debugger;
      this.poList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //getting product list of selected po
  //productDetails:any = {"productId": null, "productName": null, "quantity": 0, "receivedQuantity": 0, "acceptedQuantity": 0, "rejectedQuantity": 0};
  productDetails: any = {};
  //productDetails: ProductDetails[] = [];
  getProductListByPo = function (poId) {
    debugger;
    if (poId == null) return;
    if (poId.length >= 6) {
      if (isNaN(poId))
        return;
    } else {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.grnMasterService.getProductListByPo(poId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      //this.productDetails = resp;
      if (this.route.snapshot.params.page === undefined || this.route.snapshot.params.page == 'add') {
        this.productDetails = resp;
        this.prodDetails = [];
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  tempArray: any = {};
  prodDetails: any = [];
  changeQuantity = function (index, obj) {
    debugger;
    obj.rejectedQuantity = obj.receivedQuantity - obj.acceptedQuantity;

    //check for validations
    var errorMessage = "";
    if ((obj.receivedQuantity === undefined) || (obj.receivedQuantity == null)) {
      errorMessage += "Received quantity can not be NULL or can not exceed the total quantity.\n";
    }
    /* if(vm.userform.acceptedQuantity.$touched){
      if((obj.acceptedQuantity === undefined)||(obj.acceptedQuantity == null)){
        errorMessage += "Accepted quantity can not be NULL or can not exceed the Received quantity.\n";
      }
    } */
    if ((obj.acceptedQuantity === undefined) || (obj.acceptedQuantity == null)) {
      errorMessage += "Accepted quantity can not be NULL or can not exceed the Received quantity.\n";
    }
    if (errorMessage != "") {
      this.dialogService.openConfirmDialog(errorMessage);
      return;
    }

    /*if($rootScope.iserrorMsg2==true)
      return;*/

    if (this.add) {
      this.tempArray = {};
      this.tempArray.productId = obj.productId;
      this.tempArray.quantity = obj.quantity;
      this.tempArray.productName = obj.productName;
      if (obj.receivedQuantity === null) {
        //vm.tempArray.receivedQuantity = 0;
        this.tempArray.acceptedQuantity = 0;
        this.tempArray.rejectedQuantity = 0;
      }
      else {
        this.tempArray.receivedQuantity = obj.receivedQuantity;
        this.tempArray.acceptedQuantity = obj.acceptedQuantity;
        this.tempArray.rejectedQuantity = (obj.receivedQuantity - obj.acceptedQuantity);
        obj.rejectedQuantity = (obj.receivedQuantity - obj.acceptedQuantity);
      }
      this.prodDetails[index] = this.tempArray;
    } else if (this.edit) {
      if (obj.receivedQuantity === null) {
        //obj.receivedQuantity = 0;
        obj.acceptedQuantity = 0;
        obj.rejectedQuantity = 0;
      }
      else {
        obj.rejectedQuantity = (obj.receivedQuantity - obj.acceptedQuantity);
      }
    }
  }

  disabledField = function (state) {
    if (state == "edit") {
      this.addGrnForm.get('poNo').disable();
    } else if (state == "view") {
      this.addGrnForm.get('grnNumber').disable();
      this.addGrnForm.get('grnDate').disable();
      this.addGrnForm.get('deliveryDate').disable();
      this.addGrnForm.get('deliveryChallanNo').disable();
      this.addGrnForm.get('deliveryChallanDate').disable();
      this.addGrnForm.get('invoiceNo').disable();
      this.addGrnForm.get('invoiceDate').disable();
      this.addGrnForm.get('description').disable();
      this.addGrnForm.get('vehicleNo').disable();
      this.addGrnForm.get('transporterName').disable();
      this.addGrnForm.get('dcCopyUpload').disable();
      this.addGrnForm.get('lrCopyUpload').disable();
      this.addGrnForm.get('poNo').disable();
      this.addGrnForm.get('transporterName').disable();
    }
    //this.addGrnForm.get('poNo').disable();
  }

  // Get task for resending
  getTaskById = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var taskId = id;
    this.grnTaskService.getTaskById(taskId, headers).subscribe(resp => {
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
    this.TaskEntityData.approvalStatus = "APPROVED";
    this.grnTaskService.processTask(this.TaskEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "GRN re-sent for approval.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.router.navigate(['/grnTaskSearch']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit() {
    this.getPoList();
    this.addGrnForm = this.formBuilder.group({
      grnNumber: [null, Validators.required],
      grnDate: [null, Validators.required],
      deliveryDate: [null, Validators.required],
      deliveryChallanNo: [null],
      deliveryChallanDate: [null],
      invoiceNo: [null],
      invoiceDate: [null],
      description: [null],
      vehicleNo: [null],
      transporterName: [null],
      dcCopyUpload: [null],
      lrCopyUpload: [null],
      poNo: [null, Validators.required],
      approvalStatus: [null],
      entityId: [null]
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update GRN";
      this.editon(this.route.snapshot.params.id);
      this.disabledField(this.route.snapshot.params.page);
    }

    if (this.route.snapshot.params.page == 'view') {
      this.PageTitle = "View GRN";
      this.editon(this.route.snapshot.params.id);
      this.edit = false;
      this.view = true;
      this.disabledField(this.route.snapshot.params.page);
    }

    //this.getPoList();

    if (this.route.snapshot.params.task != null) {
      this.taskId = this.route.snapshot.params.task
      this.getTaskById(this.taskId);
    }

    //Autocomplete
    this.filteredPoList = this.addGrnForm.controls['poNo'].valueChanges.pipe(
      startWith(''),
      map(value => this.getFilteredPoData(value))
    );
  }

  //Autocomplete
  getFilteredPoData(val: string) {
    debugger;
    if (val) {
      let filterValue = val;
      filterValue = filterValue.toLowerCase();
      return this.poList.filter(item => item.selectionvalue.toLowerCase().includes(filterValue));
    }
    return this.poList;
  }

  getName(poId: string) {
    debugger;
    let poitem = this.poList.find(po => po.selectionid == poId);
    if (poitem != null) {
      return poitem.selectionvalue;
    }
  }

  get formControls() {
    return this.addGrnForm.controls;
  }
}