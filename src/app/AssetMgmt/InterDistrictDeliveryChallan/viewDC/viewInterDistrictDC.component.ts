import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { InterDistrictDCService } from '../interDC.service';
import { SharedService } from '../../../service/shared.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileuploadService } from '../../../service/fileupload.service';

@Component({
  selector: 'app-viewInterDistrictDC',
  templateUrl: './viewInterDistrictDC.component.html',
  providers: [InterDistrictDCService, AppGlobals, DialogService, SharedService, FileuploadService]
})
export class ViewInterDistrictDCComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private dcService: InterDistrictDCService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private fileuploadService: FileuploadService) { }


  showLoading: boolean = false;
  disableEdit: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  displayedColumns: string[] = ['assetname', 'serialno', 'category', 'productname', 'count','action'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  PageTitle = "Add Delivery Challan";
  add = true;
  edit = false;
  list = true;

  dc = {
    "partyname": null, "dcdate": null, "gstno": null, "address": null, "dcno": null,
    "mobileno": null, "contactperson": null, "consigneename": null, "consigneecontact": null, "projectname": null,
    "shippedto": null, "asset": [], "entityId": null, "challanattachment": null, "printflag": null, "uploadflag": null,
      "noofboxes":null, "courierdate": null, "courierDetails":null,"courierno":null,"dcstatus":null
  };

  addDCForm: FormGroup;
  isSubmitted = false;
  attachmentFiles: any = [];
  uploadFlag: boolean = false;
  AssetEntityId = [];
  deleted: boolean = false;
  back = function () {
    this.router.navigate(['/searchInterDC']);
  }

  totalAssets:any=0;
  editon = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dcService.viewdcById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.dc = resp;
      this.dc.dcdate = (new Date(this.dc.dcdate));
      if (this.dc.challanattachment != null) {
        this.attachmentFiles = this.fileuploadService.getSingleFileArray(this.dc.challanattachment);
      }
      for (let i =0; i< this.dc.asset.length;i++){
        this.totalAssets = this.totalAssets +1;
      } 
      this.dcBind(resp);
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // printComponent(cmpName) {
  //   let printContents = document.getElementById(cmpName).innerHTML;
  //   let originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  //   //window.location.reload();
  // }

  printComponent(cmpName): void {
    let printContents, popupWin;
    printContents = document.getElementById(cmpName).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
  <html>
    <head>
      <title>Inter District Delivery Challan</title>
      <style>
    body {font: 400 14px/20px Roboto, "Helvetica Neue", sans-serif;}
    .table-bordered td, .table-bordered th {
      border: 1px solid #dee2e6; padding: .5rem; margin:0px}
    .pocenter-align { text-align: center;  padding: 8px;  margin: 0px;
    }
      </style>
    </head>
<body onload="window.print();window.close()">${printContents}</body>
  </html>`
    );
    popupWin.document.close();
  }

  disablePrint = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;

    if (!this.fileuploadService.hasfile(this.attachmentFiles)) {
      this.dialogService.openConfirmDialog("Please upload Attachment")
      return;
    }

    //Check if all files are uploaded Successfully
    if (!this.fileuploadService.allFilesUploaded(this.attachmentFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }

    //this.DCData.dcdate = this.DCData.dcdate.getTime();
    this.DCData.challanattachment = this.fileuploadService.getFirstFilePath(this.attachmentFiles);
    this.dcService.disablePrint(id, headers, this.DCData).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "File is uploaded successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          debugger;
          this.dc = resp;
          this.dc.dcdate = (new Date(this.DCData.dcdate));
          if (this.dc.challanattachment != null) {
            this.attachmentFiles = this.fileuploadService.getSingleFileArray(this.dc.challanattachment);
          }
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  enablePrintFlag:boolean= false;
  enableUpload = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dcService.enableUpload(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.enablePrintFlag = resp.uploadflag;
      // this.AssetRecord = this.DCData.asset;
      // this.table.renderRows();
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  DCData = {};

  dcBind = function (obj) {
    this.DCData.dcdate = obj.dcdate;
    this.DCData.dcno = obj.dcno;
    this.DCData.mobileno = obj.mobileno;
    this.DCData.contactperson = obj.contactperson;
    this.DCData.consigneename = obj.consigneename;
    this.DCData.consigneecontact = obj.consigneecontact;
    this.DCData.projectname = obj.projectid;
    this.DCData.shippedto = obj.shippedto;
    this.DCData.asset = obj.asset;
    this.DCData.entityId = obj.entityId;
    this.DCData.remark = obj.remark;
    this.DCData.printflag = obj.printflag
    this.DCData.uploadflag = obj.uploadFlag
    this.deleted = obj.isdeleted;
    this.DCData.courierno = obj.courierno;
    this.DCData.courierDetails = obj.courierDetails;
    this.DCData.courierdate = obj.courierdate;
  }
  actionFlag :boolean=false;
  interDistrictEdit :boolean=false;
  ngOnInit(): void {
         debugger;
      this.PageTitle = "Inter District Delivery Challan";
      this.editon(this.route.snapshot.params.id);
      this.actionFlag = this._global.UserRights.includes("ROLE_ADMIN");
      this.interDistrictEdit = this._global.UserRights.includes("Inter_District_DC_EDIT");
   
  }

}

