import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { PoReportsService } from '../po-reports.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-status-wise-po-report',
  templateUrl: './status-wise-po-report.component.html',
  providers: [PoReportsService, AppGlobals, DialogService, SharedService]

})
export class StatusWisePoReportComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poReportsService: PoReportsService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService
  ) { }

  displayedColumns: string[] = ['approvalStatus', 'approvalStatusCount'];
  displayedPoColumns: string[] = ['purchaseOrderNo', 'orderDate', 'departmentName', 'accName', 'approvalStatus'];
  PoSearch: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Purchase Order Status Report";
  add = false;
  edit = false;
  list = true;
  poStatusForm: FormGroup;
  StatusCountReport : any = {};
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.StatusCountReport.filter = filterValue.trim().toLowerCase();
  }
  ReportRequest = {
    "projectId": 0,
  };
  PoRequest = {
    "approvalStatus": null,
    "accountName" : null
  };

  projectList:any = [];

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.poReportsService.getApprovalCount(this.ReportRequest.projectId, headers).subscribe(resp => {
      this.StatusCountReport = new MatTableDataSource(resp);
      console.log(resp);
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Search function
  posearch = function (status) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PoRequest.approvalStatus = status;
    if(this.ReportRequest.projectId > 0){
      this.PoRequest.accountName = this.ReportRequest.projectId;
    }
    this.poReportsService.getAllApprovalReport(this.PoRequest, headers).subscribe(resp => {
      this.PoSearch = new MatTableDataSource(resp);
      console.log(resp);
      this.PoSearch.sort = this.sort;
      this.PoSearch.paginator = this.paginator;
      this.totalRecords = this.PoSearch.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // getting project list
  getAllProjects = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getProjectList(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  

    ngOnInit(): void {

      //Fromgroup collection
      this.poStatusForm = this.formBuilder.group({
        projectId: [null]
      });
      this.search();
      this.getAllProjects();
    }
    get formControls() { return this.poStatusForm.controls; }
  }
  