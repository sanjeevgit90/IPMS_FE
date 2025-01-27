import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { PurchaseOrderService } from '../../../OrderMgmt/purchase-order/purchase-order.service';
import { PoTaskService } from '../../../OrderMgmt/purchase-order-task/po-task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-update-po-task',
  templateUrl: './update-po-task.component.html',
  providers: [PurchaseOrderService, AppGlobals, DialogService, SharedService, PoTaskService]
})
export class UpdatePoTaskComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private purchaseOrderService: PurchaseOrderService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private poTaskService: PoTaskService) { }

  showLoading: boolean = false;

  displayedColumns: string[] = ['stageName', 'approvalStatus', 'updatedBy', 'updatedDate', 'remark'];
  WorkflowHistoryData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Approve/Reject";
  add = true;
  edit = false;
  list = true;

  addPoTaskForm: FormGroup;
  isSubmitted = false;
  baseUrl: any = null;

  TaskEntityData = {
    "entityId": null, "poId": null, "uploadFile": null,
    "poRcFlag": null, "stageName": null, "workflowName": null,
    "assignToRole": null, "assignToUser": null, "approvalStatus": null,
    "remark": null, "rcId": null
  };

  cancel = function () {
    this.router.navigate(['/searchTask']);
  }

  updateTask = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    //this.TaskEntityData.poRcFlag = this.route.snapshot.params.poRcFlag;
    this.poTaskService.processTask(this.TaskEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Task updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addPoTaskForm.reset();
          this.router.navigate(['/searchTask']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Edit
  editon = function (id, poRcFlag) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var taskId = id;
    this.poTaskService.getTaskById(taskId, headers, poRcFlag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskEntityData = resp;
      if (poRcFlag == "PO") {
        this.searchWorkflowHistory(this.TaskEntityData.poId, poRcFlag);
      } else if (poRcFlag == "RC") {
        this.searchWorkflowHistory(this.TaskEntityData.rcId, poRcFlag);
      }
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  // Search function
  searchWorkflowHistory = function (id, flag) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.poTaskService.getWorkflowHistory(id, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.WorkflowHistoryData = new MatTableDataSource(resp);
      this.WorkflowHistoryData.sort = this.sort;
      //this.WorkflowHistoryData.paginator = this.paginator;
      this.totalRecords = this.WorkflowHistoryData.filteredData.length;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.addPoTaskForm = this.formBuilder.group({
      entityId: [null, Validators.required],
      poId: [null],
      uploadFile: [null],
      poRcFlag: [null],
      stageName: [null],
      workflowName: [null],
      assignToRole: [null],
      assignToUser: [null],
      approvalStatus: [null],
      remark: [null]
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Approve/Reject";
      this.editon(this.route.snapshot.params.id, this.route.snapshot.params.poRcFlag);
      //this.disabledField();
      //this.searchWorkflowHistory(this.route.snapshot.params.id, this.route.snapshot.params.poRcFlag);
    }

    this.baseUrl = this._global.baseUrl;
  }

}
