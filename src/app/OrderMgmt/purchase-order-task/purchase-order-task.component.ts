import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { PurchaseOrderService } from '../../OrderMgmt/purchase-order/purchase-order.service';
import { PoTaskService } from '../../OrderMgmt/purchase-order-task/po-task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PoApprovalFilterSession } from '../ordermgmtfilterdata';

@Component({
  selector: 'app-purchase-order-task',
  templateUrl: './purchase-order-task.component.html',
  providers: [PurchaseOrderService, AppGlobals, DialogService, SharedService, PoTaskService]
})
export class PurchaseOrderTaskComponent implements OnInit {

  result: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private purchaseOrderService: PurchaseOrderService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private poTaskService: PoTaskService) { }

  displayedColumns: string[] = ['poRcFlag', 'purchaseOrderNo', 'grandTotal', 'projectName', 'orgName', 'approvalStatus', 'stageName', 'action'];
  TaskListData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  FilterData = { "purchaseOrderNo": null, "supplierName": null, "accountName": null, "approvalStatus": null, "stageName": null };

  PageTitle = "Approval Task";
  filterDiv: boolean = false;

  filterFunc = function () {
    this.filterDiv = true;
  }
  
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("POAPPROVALFILTERSESSION");
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
    this.poTaskService.getAllPendingTask(this.FilterData, headers).subscribe(resp => {
      debugger;
      // Set Filter
      let poApprovalFilterSession = new PoApprovalFilterSession();
      poApprovalFilterSession.purchaseOrderNo = this.FilterData.purchaseOrderNo;
      poApprovalFilterSession.accountName = this.FilterData.accountName;
      poApprovalFilterSession.supplierName = this.FilterData.supplierName;
      poApprovalFilterSession.stageName = this.FilterData.stageName;
      sessionStorage.setItem('POAPPROVALFILTERSESSION', JSON.stringify(poApprovalFilterSession));
      this.result = !Object.values(poApprovalFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.TaskListData = new MatTableDataSource(resp.content);
      this.TaskListData.sort = this.sort;
      this.TaskListData.paginator = this.paginator;
      this.totalRecords = this.TaskListData.filteredData.length;
      this.showLoading = false;
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

  saveTask = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    const errStr = null;
    this.showLoading = true;
    this.TaskData.poId = this.route.snapshot.params.id;
    this.TaskData.poRcFlag = "PO";
    this.poTaskService.saveTask(this.TaskData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskData = {};
      this.successMessage = "Order sent for approval";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.addProductDetailsForm.reset();
          this.router.navigate(['searchPurchaseOrder']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  saveTaskId = function (taskId) {
    debugger;
    sessionStorage.setItem('taskId', taskId);
  }

  // getting project list
  projectList: any = [];
  getAllProjects = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getProjectList(headers).subscribe(resp => {
      this.projectList = resp;
    }, (error: any) => {
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // party List
  supplierPartyList: any = [];
  getAllParty = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      this.supplierPartyList = resp;
    }, (error: any) => {
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
    let poApprovalFilterSession = JSON.parse(sessionStorage.getItem('POAPPROVALFILTERSESSION'));
    if (sessionStorage.getItem('POAPPROVALFILTERSESSION') != null) {
      this.FilterData.purchaseOrderNo = poApprovalFilterSession.purchaseOrderNo;
      this.FilterData.accountName = poApprovalFilterSession.accountName;
      this.FilterData.supplierName = poApprovalFilterSession.supplierName;
      this.FilterData.stageName = poApprovalFilterSession.stageName;
    }
    if (poApprovalFilterSession != null) {
      this.result = !Object.values(poApprovalFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
    this.getAllProjects();
    this.getAllParty();
  }
}