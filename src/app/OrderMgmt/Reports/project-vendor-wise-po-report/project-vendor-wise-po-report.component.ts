import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { PoReportsService } from '../po-reports.service';
//import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-project-vendor-wise-po-report',
  templateUrl: './project-vendor-wise-po-report.component.html',
  providers: [PoReportsService, AppGlobals, DialogService]

})
export class ProjectVendorWisePoReportComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poReportsService: PoReportsService,
    private _global: AppGlobals, private dialogService: DialogService
  ) { }

  displayedColumns: string[] = ['name', 'count', 'allTotalOfPo'];
  ReportData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Project-Vendor Wise Report";
  add = false;
  edit = false;
  list = true;
  projectVendorWiseReportForm: FormGroup;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ReportData.filter = filterValue.trim().toLowerCase();
  }
  ReportRequest = {
    "wiseReport": null,
  };

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    // if(this.ReportRequest.wiseReport == null){
    //   this.ReportRequest.wiseReport = "PROJECT";
    // }
    this.showLoading = true;
    this.poReportsService.getProjectVendorWiseReport(this.ReportRequest, headers).subscribe(resp => {
      console.log(resp);
      this.ReportData = new MatTableDataSource(resp);
      this.ReportData.sort = this.sort;
      this.ReportData.paginator = this.paginator;
      this.totalRecords = this.ReportData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

    ngOnInit(): void {

      //Fromgroup collection
      this.projectVendorWiseReportForm = this.formBuilder.group({
        wiseReport: [null]
      });
      //this.search();
      this.ReportRequest.wiseReport = "PROJECT";
    }
    get formControls() { return this.projectVendorWiseReportForm.controls; }
  }
