import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BillingScheduleService } from './billingschedule.service';
import { AddScheduleComponent } from './addbillingschedule/addschedule.component';

@Component({
  selector: 'app-billingschedule',
  templateUrl: './billingschedule.component.html',
  providers: [BillingScheduleService, AppGlobals, DialogService, SharedService]
})
export class BillingScheduleComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private scheduleService: BillingScheduleService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private dialog: MatDialog) { }

  displayedColumns: string[] = ['id', 'dateofbilling', 'amountofbilling', 'action'];
  ScheduleRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns1: string[] = ['selectionvalue'];
  ProjectData: MatTableDataSource<any>;
 
  billingScheduleAdd: boolean = false;
  billingScheduleEdit: boolean = false;
  billingScheduleView: boolean = false;
  billingScheduleDelete: boolean = false;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Billing Schedule";

  projectList: any = [];

  enableSchedule: boolean = false;

  projectId: any;
  FilterData = {};

  applyFilterProject(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectData.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ScheduleRecord.filter = filterValue.trim().toLowerCase();
  }

  // projectList
  getActiveProject = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };

    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
      this.ProjectData = new MatTableDataSource(resp);
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getScheduleByProject = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.projectId = name;
    this.scheduleService.getScheduleList(headers, name, this.FilterData).subscribe(resp => {
      debugger;
      this.ScheduleRecord = new MatTableDataSource(resp);
      this.ScheduleRecord.sort = this.sort;
      this.ScheduleRecord.paginator = this.paginator;
      this.totalRecords = this.ScheduleRecord.filteredData.length;
      this.enableSchedule = true;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  addSchedule = function (id, flag) {
    debugger;
    this.data = {};
    if (id == null) {
      this.item = {};
      this.item.milestoneno = null;
      this.item.projectid = this.projectId;
      this.data.id = this.item;
    }
    else {
      this.data.id = id;
    }


    this.data.flag = flag;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(AddScheduleComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;
      this.getScheduleByProject(this.projectId);
    })
  }

  deleteSchedule = function (name) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var experienceId = name.milestoneno;
    var projectId = name.projectid;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.scheduleService.deleteSchedule(experienceId, projectId, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Schedule is deleted successfully.";
            this.getActiveProject();
            this.getScheduleByProject(projectId);
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
      })
  }

  ngOnInit(): void {
    //Role Rights
    this.billingScheduleAdd = this._global.UserRights.includes("Billing_Schedule_ADD");
    this.billingScheduleEdit = this._global.UserRights.includes("Billing_Schedule_EDIT");
    this.billingScheduleView = this._global.UserRights.includes("Billing_Schedule_VIEW");
    this.billingScheduleDelete = this._global.UserRights.includes("Billing_Schedule_DELETE");

    this.getActiveProject();

  }



}
