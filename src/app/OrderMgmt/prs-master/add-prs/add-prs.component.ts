import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { PRSService } from '../prs.service';
import { PrsTaskService } from '../prstask/prstask.service';
import { FileuploadService } from '../../../service/fileupload.service';
import { PurchaseOrderService } from '../../../OrderMgmt/purchase-order/purchase-order.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-prs',
  templateUrl: './add-prs.component.html',
  providers: [PRSService, AppGlobals, DialogService, SharedService, FileuploadService, PurchaseOrderService, PrsTaskService]
})
export class AddPrsComponent implements OnInit {

  filteredPoList: any = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private prsService: PRSService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private fileuploadService: FileuploadService, private purchaseOrderService: PurchaseOrderService,private prsTaskService: PrsTaskService,
    private cdr: ChangeDetectorRef) { }

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  ngAfterViewChecked(){
    this.cdr.detectChanges();
 }

  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "Add PRS";
  add = true;
  edit = false;
  list = true;

  addPrsForm: FormGroup;
  isSubmitted = false;

  PrsData = {
    "prsNo": null, "prsDate": null, "purchaseOrderNo": null, "issueChequeTo": null, "invoiceNo": null,
    "invoiceDate": null, "invoiceAmount": null, "paymentDueDate": null, "description": null, "note": null,
    "department": null, "projectName": null, "approvalStatus": null, "location": null, "requestedBy": null,
    "approvedBy": null, "signature": null, "checklist": null, "quotation": null, "poCopy": null, "checkedInvoiceCopy": null,
    "approval": null, "supportingDocuments": null, "invoiceFileUpload": null, "grnId": null,
    "isUtilityPayment": false, "office": null, "billType": null, "billNo": null, "attachedBill": null, "entityId": null
  };

  projectList: any = [];
  deptList: any = [];
  orgList: any = [];
  officeList: any = [];
  grnList: any = [];
  partyList: any = [];
  billTypeList: any = [];
  ConstantData = { "type": "" };
  isUtilityPayment: Boolean = false;
  poList: any = [];
  attachedBill: any = [];
  invoiceFileUpload: any = [];
  attachments: any = [];

  compareObjects(o1: any, o2: any): boolean {
    //return o1.name === o2.name && o1.id === o2.id;
    return o1 == o2;
  }

  cancel = function () {
    if (this.taskFlag == false)
    {
      this.router.navigate(['/searchPrs']);
    }
    else{
      this.router.navigate(['/searchPrsTask']);
    }
    
  }

  savePrs = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addPrsForm.invalid) {
      return;
    }
    if (this.PrsData.isUtilityPayment == false) {
      if (this.PrsData.purchaseOrderNo == null) {
        this.dialogService.openConfirmDialog("Purchase Order is required");
        return;
      }
      if (this.PrsData.grnId == null) {
        this.dialogService.openConfirmDialog("GRN is required");
        return;
      }
    }
    else {
      if (this.PrsData.office == null) {
        this.dialogService.openConfirmDialog("Office is required");
        return;
      }
      if (this.PrsData.billType == null) {
        this.dialogService.openConfirmDialog("Bill Type is required");
        return;
      }
      if (this.PrsData.billNo == null) {
        this.dialogService.openConfirmDialog("Bill/Agreement No. is required");
        return;
      }
      if (!this.fileuploadService.hasfile(this.attachedBill)) {
        this.dialogService.openConfirmDialog("Please upload bill")
        return;
      }
      //Check if all files are uploaded Successfully
      if (this.attachedBill.length > 0) {
        if (!this.fileuploadService.allFilesUploaded(this.attachedBill)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PrsData.attachedBill = this.fileuploadService.getFirstFilePath(this.attachedBill);
      }

    }

    /* if (!this.fileuploadService.hasfile(this.invoiceFileUpload)) {
      this.dialogService.openConfirmDialog("Please upload Invoice")
      return;
    } */

    //Check if all files are uploaded Successfully
    if (this.invoiceFileUpload.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.invoiceFileUpload)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.PrsData.invoiceFileUpload = this.fileuploadService.getFirstFilePath(this.invoiceFileUpload);
    }

    /* if (!this.fileuploadService.hasfile(this.attachments)) {
      this.dialogService.openConfirmDialog("Please upload Attachments")
      return;
    } */

    //Check if all files are uploaded Successfully
    if (this.attachments.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.attachments)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.PrsData.attachments = this.fileuploadService.allUploadedFiles(this.attachments);
    }
    this.PrsData.prsDate = this.PrsData.prsDate.getTime();
    this.PrsData.paymentDueDate = this.PrsData.paymentDueDate.getTime();
    if (this.PrsData.invoiceDate != null) {
      this.PrsData.invoiceDate = this.PrsData.invoiceDate.getTime();
    }

    this.showLoading = true;
    this.prsService.savePrs(this.PrsData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "PRS created successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.attachBill = [];
          this.invoiceFileUpload = [];
          this.attachments = [];
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.PrsData.prsDate = (new Date(this.PrsData.prsDate));
      this.PrsData.paymentDueDate = (new Date(this.PrsData.paymentDueDate));
      if (this.PrsData.invoiceDate != null) {
        this.PrsData.invoiceDate = (new Date(this.PrsData.invoiceDate));
      }
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  updatePrs = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addPrsForm.invalid) {
      return;
    }
    if (this.PrsData.isUtilityPayment == false) {
      if (this.PrsData.purchaseOrderNo == null) {
        this.dialogService.openConfirmDialog("Purchase Order is required");
        return;
      }
      if (this.PrsData.grnId == null) {
        this.dialogService.openConfirmDialog("GRN is required");
        return;
      }
    }
    else {
      if (this.PrsData.office == null) {
        this.dialogService.openConfirmDialog("Office is required");
        return;
      }
      if (this.PrsData.billType == null) {
        this.dialogService.openConfirmDialog("Bill Type is required");
        return;
      }
      if (this.PrsData.billNo == null) {
        this.dialogService.openConfirmDialog("Bill/Agreement No. is required");
        return;
      }
      if (!this.fileuploadService.hasfile(this.attachedBill)) {
        this.dialogService.openConfirmDialog("Please upload bill")
        return;
      }
      //Check if all files are uploaded Successfully
      if (this.attachedBill.length > 0) {
        if (!this.fileuploadService.allFilesUploaded(this.attachedBill)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PrsData.attachedBill = this.fileuploadService.getFirstFilePath(this.attachedBill);
      }
    }

    if (this.PrsData.invoiceAmount == null) {
      this.dialogService.openConfirmDialog("Invoice amount is required");
      return;
    }

    /* if (!this.fileuploadService.hasfile(this.invoiceFileUpload)) {
      this.dialogService.openConfirmDialog("Please upload Invoice")
      return;
    } */

    //Check if all files are uploaded Successfully
    if (this.invoiceFileUpload.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.invoiceFileUpload)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.PrsData.invoiceFileUpload = this.fileuploadService.getFirstFilePath(this.invoiceFileUpload);
    }

    /* if (!this.fileuploadService.hasfile(this.attachments)) {
      this.dialogService.openConfirmDialog("Please upload Attachments")
      return;
    } */

    //Check if all files are uploaded Successfully
    if (this.attachments.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.attachments)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.PrsData.attachments = this.fileuploadService.allUploadedFiles(this.attachments);
    }

    this.PrsData.prsDate = this.PrsData.prsDate.getTime();
    this.PrsData.paymentDueDate = this.PrsData.paymentDueDate.getTime();
    if (this.PrsData.invoiceDate != null) {
      this.PrsData.invoiceDate = this.PrsData.invoiceDate.getTime();
    }

    this.showLoading = true;
    this.prsService.updatePrs(this.PrsData, headers, this.PrsData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "PRS updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.PrsData.prsDate = (new Date(this.PrsData.prsDate));
          this.PrsData.paymentDueDate = (new Date(this.PrsData.paymentDueDate));
          if (this.PrsData.invoiceDate != null) {
            this.PrsData.invoiceDate = (new Date(this.PrsData.invoiceDate));
          }         
         
          if (this.taskFlag == false)
          {
            this.router.navigate(['/searchPrs']);
          }

        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.PrsData.prsDate = (new Date(this.PrsData.prsDate));
      this.PrsData.paymentDueDate = (new Date(this.PrsData.paymentDueDate));
      if (this.PrsData.invoiceDate != null) {
        this.PrsData.invoiceDate = (new Date(this.PrsData.invoiceDate));
      }
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
    var prsId = id;
    this.prsService.getPrsById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.PrsData = resp;
      this.PrsData.purchaseOrderNo = this.PrsData.purchaseOrderNo.toString(); 
      this.PrsData.prsDate = (new Date(this.PrsData.prsDate));
      this.PrsData.invoiceDate = (new Date(this.PrsData.invoiceDate));
      this.PrsData.paymentDueDate = (new Date(this.PrsData.paymentDueDate));
      if (this.PrsData.attachments != null) {
        this.attachments = this.fileuploadService.getMultipleFileArray(this.PrsData.attachments);
      }
      if (this.PrsData.invoiceFileUpload != null) {
        this.invoiceFileUpload = this.fileuploadService.getSingleFileArray(this.PrsData.invoiceFileUpload);
      }
      if (this.PrsData.attachedBill != null) {
        this.attachedBill = this.fileuploadService.getSingleFileArray(this.PrsData.attachedBill);
      }
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  taskFlag:boolean= false;

  taskData = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.prsTaskService.taskById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.taskData = resp;
      this.taskFlag = true;
      this.editon(this.taskData.prsId);
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  // getting project list
  getAllProjects = function () {
    //  debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getProjectList(headers).subscribe(resp => {
      //  debugger;
      this.projectList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // getting project list
  getAllDepartments = function () {
    // debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDepartmentList(headers).subscribe(resp => {
      // debugger;
      this.deptList = resp;
      this.showLoading = false;
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //get all constants
  getAllConstants = function (flag) {
    //debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.ConstantData.type = flag;
    this.sharedService.getAllConstant(this.ConstantData, headers).subscribe(resp => {
      //debugger;
      if (flag == "BILL") {
        this.billTypeList = resp;
      } else if (flag == "OFC") {
        this.officeList = resp;
      }
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Org List
  getAllGrn = function (id) {
    //debugger;
    if (id == null) return;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getAllGrnByPo(id, headers).subscribe(resp => {
      //debugger;
      this.grnList = resp;
      this.showLoading = false;
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // party List
  getAllParty = function () {
    //debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      //debugger;
      this.partyList = resp;
      this.showLoading = false;
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  getAllOffice = function () {
    //debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getOfficeList(headers).subscribe(resp => {
      //debugger;
      this.officeList = resp;
      this.showLoading = false;
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getPoList = function () {
    //debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getAllPoListFromGrn(headers).subscribe(resp => {
      debugger;
      this.poList = resp;
      this.showLoading = false;
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  saveTask = function (name) {
    //debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.prsService.submitForApproval(name, headers).subscribe(resp => {
      //debugger;
      this.showLoading = false;
      this.successMessage = "PRS is successfully submitted for Approval.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.addProductDetailsForm.reset();
          this.router.navigate(['searchPrs']);
        })
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });

  }
 //re-send task for approval
 reSendTask = function () {
  debugger;
  this.isSubmitted = true;
  const headers = { "Authorization": sessionStorage.getItem("token") };
  this.showLoading = true;
  //this.TaskEntityData.poRcFlag = this.route.snapshot.params.poRcFlag;
  this.taskData.approvalStatus = "APPROVED";
  this.taskData.remark = "RE-SUBMITTED";
  this.prsTaskService.processTask(this.taskData, headers).subscribe(resp => {
    debugger;
    this.showLoading = false;
    this.successMessage = "PRS re-sent for approval.";
    this.dialogService.openConfirmDialog(this.successMessage)
      .afterClosed().subscribe(res => {
        //this.addPoTaskForm.reset();
        this.router.navigate(['/searchPrsTask']);
      })
  }, (error: any) => {
    this.showLoading = false;
    const errStr = error.error.errorDetail[0];
    this.dialogService.openConfirmDialog(errStr)
  });
}

  //getting selected po
  PoEntity: any = {};
  getSelectedPurchaseOrder = function (poId) {
    //debugger;
    if (poId == null) return;
    if (poId.length >= 6) {
      if (isNaN(poId))
        return;
    } else {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.purchaseOrderService.getPOById(poId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.PoEntity = resp;
      this.PrsData.issueChequeTo = this.PoEntity.supplierName;
      this.getAllGrn(poId);
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  ngOnInit() {

    debugger;
    this.getPoList();
    this.addPrsForm = this.formBuilder.group({
      prsNo: [null, Validators.required],
      prsDate: [null, Validators.required],
      invoiceNo: [null, Validators.required],
      paymentDueDate: [null, Validators.required],
      purchaseOrderNo: [null],
      grnId: [null],
      issueChequeTo: [null],
      invoiceDate: [null, Validators.required],
      invoiceAmount: [null, Validators.required],
      description: [null],
      note: [null],
      department: [null],
      projectName: [null, Validators.required],
      location: [null],
      quotation: [false],
      poCopy: [false],
      checkedInvoiceCopy: [false],
      approval: [false],
      supportingDocuments: [false],
      office: [null],
      billType: [null],
      billNo: [null],
      isUtilityPayment: [false]
    });


    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Prs";
      this.editon(this.route.snapshot.params.id);
      //this.disabledField();
    }
    if (this.route.snapshot.params.page == 'taskedit') {
      this.PageTitle = "Update Prs";
      this.taskData(this.route.snapshot.params.id);
      //this.disabledField();
    }

    this.getAllProjects();
    this.getAllDepartments();
    this.getAllConstants("BILL");
    this.getAllConstants("OFC");
    this.getAllParty();
    //this.getAllOffice();
    //this.getAllGrn();


    //Autocomplete
    this.filteredPoList = this.addPrsForm.controls['purchaseOrderNo'].valueChanges.pipe(
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
    return this.addPrsForm.controls;
  }
}