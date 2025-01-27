import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { GrnTaskService } from '../../OrderMgmt/grn-task/grn-task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GrnFilterSession } from '../ordermgmtfilterdata';
@Component({
  selector: 'app-grn-task',
  templateUrl: './grn-task.component.html',
  providers: [AppGlobals, DialogService, SharedService, GrnTaskService]
})

export class GrnTaskComponent implements OnInit {
  result: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private grnTaskService: GrnTaskService) { }
  displayedColumns: string[] = ['grnNumber', 'approvalStatus', 'stageName', 'action'];
  TaskListData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  FilterData = { "grnNumber": null, "approvalStatus": null };
  PageTitle = "Approval Task";
  filterDiv: boolean = false;
  filterFunc = function () {
    this.filterDiv = true;
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("GRNTASKFILTERSESSION");
    this.result = false;
    this.search();
  }

  addPO = function () {
  }

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    // Set Filter
    let GrnTaskFilterSession = new GrnFilterSession();
    GrnTaskFilterSession.grnNumber = this.FilterData.grnNumber;
    sessionStorage.setItem('FILTERSESSION', JSON.stringify(GrnTaskFilterSession));
    this.result = !Object.values(GrnTaskFilterSession).every(o => o === null || o === undefined);
    this.filterDiv = false;
    this.grnTaskService.getAllPendingTask(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskListData = new MatTableDataSource(resp);
      this.TaskListData.sort = this.sort;
      this.TaskListData.paginator = this.paginator;
      this.totalRecords = this.TaskListData.filteredData.length;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    //Assign Filter
    let GrnTaskFilterSession = JSON.parse(sessionStorage.getItem('GRNTASKFILTERSESSION'));
    if (sessionStorage.getItem('GRNTASKFILTERSESSION') != null) {
      this.FilterData.grnNumber = GrnTaskFilterSession.purchaseOrderNo;
    }
    if (GrnTaskFilterSession != null) {
      this.result = !Object.values(GrnTaskFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
  }
}