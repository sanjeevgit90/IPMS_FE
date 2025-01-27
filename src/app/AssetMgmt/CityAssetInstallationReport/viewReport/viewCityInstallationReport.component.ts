import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { CityInstallationReportService } from '../cityassetinstallation.service';
import { SharedService } from '../../../service/shared.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileuploadService } from '../../../service/fileupload.service';

@Component({
  selector: 'app-viewCityInstallationReport',
  templateUrl: './viewCityInstallationReport.component.html',
  providers: [CityInstallationReportService, AppGlobals, DialogService, SharedService, FileuploadService]
})
export class ViewCityInstallationReport implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private reportService: CityInstallationReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private fileuploadService: FileuploadService) { }


  displayedColumns: string[] = ['product', 'count'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Generate City Wise Asset Report";
  add = true;
  edit = false;
  list = true;

  addCityForm: FormGroup;
  isSubmitted = false;
  attachmentFiles: any = [];
  uploadFlag: boolean = false;

  back = function () {
    this.router.navigate(['/searchCityInstallationReport']);
  }

  cityAssets = {
    "city": null, "poreferenceno": null, "pono": null, "podate": null, "customerdepartment": null,
    "project": [], "remark": null, "installationdate": null, "contactperson": null,
    "designation": null, "address": null, "telno": null, "installationMasterChild": [], "installationattachment": null,
    "printflag": null, "uploadflag": null, "entityId": null
  };

  editon = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.reportService.reportById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.cityAssets = resp;
      if (this.cityAssets.installationattachment != null) {
        this.attachmentFiles = this.fileuploadService.getSingleFileArray(this.cityAssets.installationattachment);
      }
      this.dcBind(resp);
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // printComponent1(cmpName) {
  //   let printContents = document.getElementById(cmpName).innerHTML;
  //   let originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  // }

  printComponent(cmpName): void {
    let printContents, popupWin;
    printContents = document.getElementById(cmpName).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
  <html>
    <head>
      <title>City Asset Installation Report</title>
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

    this.ReportData.installationattachment = this.fileuploadService.getFirstFilePath(this.attachmentFiles);

    this.reportService.disablePrint(id, headers, this.ReportData).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "File is uploaded successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          debugger;
          this.dc = resp;
          this.dc.dcdate = (new Date(this.DCData.dcdate));
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  enableUpload = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.reportService.enableUpload(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;

      // this.AssetRecord = this.DCData.asset;
      // this.table.renderRows();
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ReportData = {};

  dcBind = function (obj) {
    this.ReportData.city = obj.city;
    this.ReportData.poreferenceno = obj.poreferenceno;
    this.ReportData.pono = obj.pono;
    this.ReportData.podate = obj.podate;
    this.ReportData.project = obj.project;
    this.ReportData.customerdepartment = obj.customerdepartment;
    this.ReportData.remark = obj.remark;
    this.ReportData.installationdate = obj.installationdate;
    this.ReportData.contactperson = obj.contactperson;
    this.ReportData.designation = obj.designation;
    this.ReportData.address = obj.address;
    this.ReportData.telno = obj.telno;
    this.ReportData.installationMasterChild = obj.installationMasterChild;
  }

  ngOnInit(): void {
    debugger;

    this.PageTitle = "City Asset Installation Report";
    this.editon(this.route.snapshot.params.id);

  }


}

