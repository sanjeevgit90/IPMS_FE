import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { GrnMasterService } from './grn-master.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GrnTaskService } from '../../OrderMgmt/grn-task/grn-task.service';
import { GrnFilterSession } from '../ordermgmtfilterdata';

@Component({
  selector: 'app-grn-master',
  templateUrl: './grn-master.component.html',
  providers: [GrnMasterService, AppGlobals, DialogService, SharedService, GrnTaskService]
})
export class GrnMasterComponent implements OnInit {
  result: boolean = false;

  constructor(
    //private formBuilder: FormBuilder, 
    private router: Router, private route: ActivatedRoute, private http: HttpClient, private grnMasterService: GrnMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private grnTaskService: GrnTaskService) { }

  displayedColumns: string[] = ['grnNumber', 'grnDate', 'deliveryDate', 'purchaseOrderNo', 'approvalStatus', 'action'];
  GrnMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  FilterData = { "grnNumber": null, "purchaseOrderNo": null };
  TaskData = { "grnId": null, "remark": null, "workflowName": null };
  TaskEntityData = {
    "entityId": null, "grnId": null, "stageName": null, "workflowName": null,
    "assignToRole": null, "assignToUser": null, "approvalStatus": null,
    "remark": null
  };

  poList: any = [];
  grnAdd: boolean = true;
  grnEdit: boolean = true;
  grnView: boolean = true;
  grnDelete: boolean = true;
  PageTitle = "GRN Master";
  filterDiv: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.GrnMasterData.filter = filterValue.trim().toLowerCase();
  }

  addGrn = function () {
    this.router.navigate(['/grnMasterAdd']);
  }

  filterFunc = function () {
    this.filterDiv = true;
  }

  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("GRNFILTERSESSION");
    this.result = false;
    this.search();
  }

  getPoList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getPoList(headers).subscribe(resp => {
      debugger;
      this.poList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.grnMasterService.getAllGrn(this.FilterData, headers).subscribe(resp => {
      debugger;
      // Set Filter
      let grnFilterSession = new GrnFilterSession();
      grnFilterSession.grnNumber = this.FilterData.grnNumber;
      grnFilterSession.purchaseOrderNo = this.FilterData.purchaseOrderNo;
      sessionStorage.setItem('GRNFILTERSESSION', JSON.stringify(grnFilterSession));
      this.result = !Object.values(grnFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.showLoading = false;
      this.GrnMasterData = new MatTableDataSource(resp.content);
      this.GrnMasterData.sort = this.sort;
      this.GrnMasterData.paginator = this.paginator;
      this.totalRecords = this.GrnMasterData.filteredData.length;
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

  saveTask = function (grnId) {
    debugger;
    this.DeleteMsg = 'Send grn for approval?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.grnTaskService.saveTask(grnId, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "GRN sent for approval";
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {
                this.search();
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

  // Get task for resending
  getTaskById = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var taskId = id;
    this.grnTaskService.getTaskById(taskId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskEntityData = resp;
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error.error.errorDetail[0];
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  //re-send task for approval
  reSendTask = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.TaskEntityData.approvalStatus = "APPROVED";
    this.grnTaskService.processTask(this.TaskEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "GRN re-sent for approval.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.addPoTaskForm.reset();
          this.router.navigate(['/grnTaskSearch']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  onDelete = function (id) {
    this.DeleteMsg = 'Are you sure you want to delete this record?';
    var experienceId = id;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.grnMasterService.onDelete(experienceId, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "GRN is deleted successfully.";
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
      })
  }

  ngOnInit(): void {
    //Role Rights
    //this.grnAdd = this._global.UserRights.includes("PRS_Master_ADD");
    //this.grnEdit = this._global.UserRights.includes("PRS_Master_EDIT");
    //this.grnView = this._global.UserRights.includes("PRS_Master_VIEW");
    //this.grnDelete = this._global.UserRights.includes("PRS_Master_DELETE");

    //Assign Filter
    let grnFilterSession = JSON.parse(sessionStorage.getItem('GRNFILTERSESSION'));
    if (sessionStorage.getItem('GRNFILTERSESSION') != null) {
      this.FilterData.grnNumber = grnFilterSession.grnNumber;
      this.FilterData.purchaseOrderNo = grnFilterSession.purchaseOrderNo;
    }
    if (grnFilterSession != null) {
      this.result = !Object.values(grnFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }

    this.search();
  }
}