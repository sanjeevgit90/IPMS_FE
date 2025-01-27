import { Component, OnInit, ViewChild , Inject, Optional} from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { PrsTaskService } from './prstask.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { PrsActionComponent} from './action/prsaction.component';
import { PrsFilterSession } from '../../ordermgmtfilterdata';

@Component({
  selector: 'app-prstask',
  templateUrl: './prstask.component.html',
  providers: [AppGlobals, DialogService, SharedService, PrsTaskService]
})
export class PrsTaskComponent implements OnInit {
  result: boolean = false;
  constructor( private router: Router, private route: ActivatedRoute, private http: HttpClient, private taskService: PrsTaskService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }
  displayedColumns: string[] = ['prsNo' , 'project','partyName', 'invoiceAmount', 'approvalStatus', 'stageName', 'action'];
  historyColumns: string[] = ['prsNo' , 'project','partyName', 'invoiceAmount', 'approvalStatus', 'stageName', 'action'];
  TaskRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  history: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  FilterData = {"prsNo" : null};
  PageTitle = "PRS Task List";
  filterDiv:boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TaskRecord.filter = filterValue.trim().toLowerCase();
  }
  filterFunc = function() {
    this.filterDiv = true;
  }
  cancel = function() {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("PRSTASKFILTERSESSION");
    this.result = false;
    this.search();

  }
  
   search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.getTaskList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      let PrsTaskFilterSession = new PrsFilterSession();
      PrsTaskFilterSession.prsNo = this.FilterData.prsNo;
      sessionStorage.setItem('PrsTaskFilterSession', JSON.stringify(PrsTaskFilterSession));
      this.result = !Object.values(PrsTaskFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.TaskRecord= new MatTableDataSource(resp.content);
      this.TaskRecord.sort = this.sort;
      this.TaskRecord.paginator = this.paginator;
      this.totalRecords = this.TaskRecord.filteredData.length;
      this.history=false;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getHistoryTask = function () {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.getHistoryTaskList(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.TaskRecord= new MatTableDataSource(resp.content);
      this.TaskRecord.sort = this.sort;
      this.TaskRecord.paginator = this.paginator;
      this.totalRecords = this.TaskRecord.filteredData.length;
      this.history= true;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  action = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    this.data.flag = 'invoice';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(PrsActionComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;
      this.search();
    })
  }

  saveTaskId = function (taskId) {
    debugger;
    sessionStorage.setItem('prsTaskId', taskId);
  }
 
  ngOnInit(): void {
    //Assign Filter
    let PrsTaskFilterSession = JSON.parse(sessionStorage.getItem('PRSTASKFILTERSESSION'));
    if (sessionStorage.getItem('PRSTASKFILTERSESSION') != null) {
      this.FilterData.prsNo = PrsTaskFilterSession.prsNo;
    }
    if (PrsTaskFilterSession != null) {
      this.result = !Object.values(PrsTaskFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
  }
}
