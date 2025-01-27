import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { InvoiceService } from '../invoice.service';
import { SharedService } from '../../../service/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileuploadService } from '../../../service/fileupload.service';

@Component({
  selector: 'app-addinvoice',
  templateUrl: './addinvoice.component.html',
  providers: [InvoiceService, AppGlobals, DialogService, SharedService, FileuploadService]
})
export class AddInvoiceComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private invoiceService: InvoiceService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private fileuploadService: FileuploadService,
    public dialogRef: MatDialogRef<AddInvoiceComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }


  showLoading: boolean = false;
  disable = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Add Invoice";
  add = true;
  edit = false;
  list = true;

  InvoiceData = {
    "projectid": null, "pono": null, "customer": null, "customeraddress": null, "gstno": null, "panno": null, "milestoneno": null,
    "amountwithouttax": 0, "amountwithtax": 0, "totalamount": 0, "invoicedate": null, "invoiceexcel": null,
    "invoicesupportingdoc": null, "accountexcel": null, "invoicesignedexcel": null
  };

  addInvoiceForm: FormGroup;
  isSubmitted = false;
  completionStatusList = this._global.completionStatus;

  back = function () {
    this.dialogRef.close(false);
  }

  milestoneList: any = [];
  partyList: any = [];
  addressList: any = [];
  attachmentInvoice: any = [];
  attachmentSupportingDoc: any = [];

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  // projectList
  getMilestoneList = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (name == null) {
      return;
    }
    this.sharedService.getMilestoneList(name, headers).subscribe(resp => {
      debugger;
      this.milestoneList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  calculateAmt = function () {
    debugger;
    if ((this.InvoiceData.amountwithouttax == null) || (this.InvoiceData.amountwithouttax == "")) {
      this.InvoiceData.amountwithouttax = 0;
    }
    if ((this.InvoiceData.amountwithtax == null) || (this.InvoiceData.amountwithtax == "")) {
      this.InvoiceData.amountwithtax = 0;
    }
    this.InvoiceData.totalamount = parseFloat(this.InvoiceData.amountwithouttax) + parseFloat(this.InvoiceData.amountwithtax);
    return;
  }

  getActiveParty = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      debugger;
      this.partyList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Address List

  getAllAddressOfParty = function (id) {
    this.userid = this.InvoiceData.customer;
    if (this.userid == null) {
      return;
    }
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.getPartyDetails();
    this.sharedService.getAllAddressOfParty(headers, this.userid).subscribe(resp => {
      debugger;
      this.addressList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // gst List

  getGstFromAddress = function (id) {
    debugger;
    if (id == null) {
      return;
    }
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getGstFromAddress(headers, this.InvoiceData.customer, id).subscribe(resp => {
      debugger;
      this.gstData = {};
      this.gstData = resp;
      if (this.gstData != null) {
        if (this.gstData.gstNo != null) {
          this.InvoiceData.gstno = this.gstData.gstNo;
        }
      }
      else {
        this.InvoiceData.gstno = 'NA';
      }
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Single List

  getPartyDetails = function () {

    this.userid = this.InvoiceData.customer;
    if (this.userid == null) {
      return;
    }
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getPartyDetails(headers, this.userid).subscribe(resp => {
      debugger;
      this.party = resp;

      if (this.party.panNo != null) {
        this.InvoiceData.panno = this.party.panNo;
      }
      else {
        this.InvoiceData.panno = 'NA';
      }

    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  addInvoice = function (flag) {
    debugger;
    this.isSubmitted = true;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addInvoiceForm.invalid) {
      return;
    }
    if (!this.fileuploadService.hasfile(this.attachmentInvoice)) {
      this.dialogService.openConfirmDialog("Please upload Invoice Excel")
      return;
    }

    //Check if all files are uploaded Successfully
    if (!this.fileuploadService.allFilesUploaded(this.attachmentInvoice)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.InvoiceData.invoiceexcel = this.fileuploadService.getFirstFilePath(this.attachmentInvoice);

    if (!this.fileuploadService.hasfile(this.attachmentSupportingDoc)) {
      this.dialogService.openConfirmDialog("Please upload Supporting Document")
      return;
    }

    //Check if all files are uploaded Successfully
    if (!this.fileuploadService.allFilesUploaded(this.attachmentSupportingDoc)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.InvoiceData.invoicesupportingdoc = this.fileuploadService.getFirstFilePath(this.attachmentSupportingDoc);

    this.InvoiceData.projectid = this.data.projectid;
    this.showLoading = true;
    this.invoiceService.saveInvoice(this.InvoiceData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Invoice " + flag + " successfully.";
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

  clearfields = function () {
    this.InvoiceData = {
      "projectid": null, "pono": null, "customer": null, "customeraddress": null, "gstno": null, "panno": null, "milestoneno": null,
      "amountwithouttax": null, "amountwithtax": null, "totalamount": null, "invoicedate": null,
      "invoiceexcel": null, "invoicesupportingdoc": null, "accountexcel": null
    };
  }
  // Edit

  editon = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.invoiceService.invoiceById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.InvoiceData = resp;
      if (this.InvoiceData.invoiceexcel != null) {
        this.attachmentInvoice = this.fileuploadService.getSingleFileArray(this.InvoiceData.invoiceexcel);
      }
      if (this.InvoiceData.invoicesupportingdoc != null) {
        this.attachmentSupportingDoc = this.fileuploadService.getSingleFileArray(this.InvoiceData.invoicesupportingdoc);
      }
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  submitForApproval = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.invoiceService.submitForApproval(name, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Invoice is successfully submitted for Approval.";
      this.search();
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  ngOnInit(): void {
    debugger;
    this.getMilestoneList(this.data.projectid);
    this.getActiveParty();

    this.addInvoiceForm = this.formBuilder.group({
      pono: [null, Validators.required],
      customer: [null, Validators.required],
      gstno: [null],
      panno: [null],
      milestoneno: [null, Validators.required],
      amountwithouttax: [0, Validators.required],
      amountwithtax: [0, Validators.required],
      totalamount: [0, Validators.required],
      customeraddress: [null],
      invoicedate: [null],
      invoiceno: [null],
      invoiceexcel: [null],
      invoicesupportingdoc: [null],
      accountexcel: [null]
    });


    if (this.data.flag == 'edit') {
      this.PageTitle = "Update Invoice";
      this.editon(this.data.id);

    }


  }
  get formControls() {
    return this.addInvoiceForm.controls;
  }

}

