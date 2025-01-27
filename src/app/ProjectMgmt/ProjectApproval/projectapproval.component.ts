import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { ProjectApprovalTaskService } from './projectapproval.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActionComponent } from '../../AssetMgmt/InterDistrictDeliveryChallan/action/action.component';
import { ViewProjectComponent } from './../ProjectMaster/viewproject/viewproject.component';

@Component({
  selector: 'app-projectapproval',
  templateUrl: './projectapproval.component.html',
  providers: [AppGlobals, DialogService, SharedService, ProjectApprovalTaskService]
})
export class ProjectApprovalTaskComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private taskService: ProjectApprovalTaskService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }

  displayedColumns: string[] = ['projectName', 'clientName', 'projectStartDate', 'projectStopDate',
    'approvalStatus', 'action'];
  historyColumns: string[] = ['projectName', 'clientName', 'projectStartDate', 'projectStopDate',
    'approvalStatus'];
  ProjectRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  history: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  FilterData = { "projectName": null };

  PageTitle = "Project Approval Task List";
  filterDiv: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectRecord.filter = filterValue.trim().toLowerCase();
  }


  filterFunc = function () {
    debugger;
    this.filterDiv = true;
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }

  search = function () {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.getTaskList(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.ProjectRecord = new MatTableDataSource(resp);
      this.ProjectRecord.sort = this.sort;
      this.ProjectRecord.paginator = this.paginator;
      this.totalRecords = this.ProjectRecord.filteredData.length;
      this.history = false;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  getHistoryTask = function () {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.getHistoryTask(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.ProjectRecord = new MatTableDataSource(resp);
      this.ProjectRecord.sort = this.sort;
      this.ProjectRecord.paginator = this.paginator;
      this.totalRecords = this.ProjectRecord.filteredData.length;
      this.history = true;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  action = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    this.data.flag = 'projectApproval';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(ActionComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;
      this.search();
    })
  }

  viewProject = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(ViewProjectComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;

    })
  }

  ngOnInit(): void {
    debugger;
    this.search();

  }



}
