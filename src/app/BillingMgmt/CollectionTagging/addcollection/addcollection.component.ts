import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { CollectionTaggingService } from '../collectiontagging.service';
import { SharedService } from '../../../service/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceService } from '../../Invoice/invoice.service';

import { FileuploadService } from '../../../service/fileupload.service';
@Component({
  selector: 'app-addcollection',
  templateUrl: './addcollection.component.html',
  providers: [CollectionTaggingService, AppGlobals, DialogService, SharedService, InvoiceService, FileuploadService]
})
export class AddCollectionComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private collectionService: CollectionTaggingService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,private invoiceService:InvoiceService,
    private fileuploadService: FileuploadService,
    public dialogRef: MatDialogRef<AddCollectionComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }


  showLoading: boolean = false;
  disable = false;

  
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Tag Collection";
  add = true;
  edit = false;
  list = true;
  invoiceValue :any;

  invoiceamount: any;

  CollectionData = {
    "collectiondate":null,"projectid":null,"invoiceid":null,
	  "tdsdeducted":0,"gsttdsdeducted":0,"otherdeducted":0,
	  "deductiondescription":null,"netamountcredieted":0,"utrno":null,
	  "uploadpaymentadvice":null
  };
invoiceList :any =[];
uploadpaymentadvice: any=[];

  addCollectionForm: FormGroup;
  isSubmitted = false;
  
  back = function () {
    this.dialogRef.close(false);
  }
  
  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  addCollection = function (flag) {
    debugger;
    this.isSubmitted = true;
    this.CollectionData.collectiondate = this.CollectionData.collectiondate.getTime();
    
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addCollectionForm.invalid) {
      return;
    }
    if (!this.fileuploadService.hasfile(this.uploadpaymentadvice)) {
      this.dialogService.openConfirmDialog("Please upload Invoice Excel")
      return;
    }
    
   //Check if all files are uploaded Successfully
   if (!this.fileuploadService.allFilesUploaded(this.uploadpaymentadvice)) {
    this.dialogService.openConfirmDialog("Files uploading...")
     return;
  }
  if((this.CollectionData.gsttdsdeducted == null) || (this.CollectionData.gsttdsdeducted==""))
  {
    if(this.CollectionData.deductiondescription ==null)
    {
    this.dialogService.openConfirmDialog("Deduction Description is Required")
    return;
    }
  }
  this.CollectionData.uploadpaymentadvice = this.fileuploadService.getFirstFilePath(this.uploadpaymentadvice);

    this.CollectionData.projectid = this.data.projectid
    this.showLoading = true;
    this.collectionService.saveCollection(this.CollectionData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Collection " + flag + "d successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.dialogRef.close(false);
          
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
 
  // Edit
  getInvoiceList = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (name == null){
      return;
    }
    this.sharedService.getInvoiceList(name, headers).subscribe(resp => {
      debugger;
      this.invoiceList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  getInvoice= function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (name == null){
      return;
    }
    this.invoiceService.invoiceById(name, headers).subscribe(resp => {
      debugger;
      this.invoice = resp;
      this.CollectionData.netamountcredieted = this.invoice.totalamount;
      this.invoiceValue = this.invoice.totalamount;
      this.calculateCollection();
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  amt:any;
  calculateCollection= function()
  {
    debugger;
    if((this.CollectionData.tdsdeducted == null) || (this.CollectionData.tdsdeducted=="")){
      this.CollectionData.tdsdeducted =0;
    }
    
    if((this.CollectionData.otherdeducted == null) || (this.CollectionData.otherdeducted=="")){
      this.CollectionData.otherdeducted =0;
    }
    if((this.CollectionData.gsttdsdeducted == null) || (this.CollectionData.gsttdsdeducted=="")){
      this.CollectionData.gsttdsdeducted =0;
    }
    debugger;

  this.amt = parseFloat(this.invoiceValue) - ( parseFloat(this.CollectionData.tdsdeducted) +
  parseFloat(this.CollectionData.gsttdsdeducted) + parseFloat(this.CollectionData.otherdeducted));
  this.CollectionData.netamountcredieted = parseFloat(this.amt);
  }
 

  editon = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.collectionService.collectionById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.CollectionData = resp;
      if (this.CollectionData.collectiondate > 0) {
        this.CollectionData.collectiondate = (new Date(this.CollectionData.collectiondate));
      }
      else {
        this.CollectionData.collectiondate = null;
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {

    this.getInvoiceList(this.data.projectid);
   
    this.addCollectionForm = this.formBuilder.group({
      collectiondate: [null, Validators.required],
      invoiceid: [null, Validators.required],
      tdsdeducted: [0, Validators.required],
      gsttdsdeducted: [0, Validators.required],
      netamountcredieted: [0, Validators.required],
      utrno: [null, Validators.required],
      invoiceValue: [null, Validators.required],
      otherdeducted: [0],
      uploadpaymentadvice: [null],
      deductiondescription: [null]
    });
    this.amt =0;
debugger;
     if (this.data.flag == 'edit') {
      this.PageTitle = "Update Collection";
      this.editon(this.data.id);
    }
  }
  get formControls() {
    return this.addCollectionForm.controls;
  }

}

