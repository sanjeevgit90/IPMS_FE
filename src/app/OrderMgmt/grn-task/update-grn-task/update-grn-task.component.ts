import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { GrnTaskService } from '../../../OrderMgmt/grn-task/grn-task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-update-grn-task',
  templateUrl: './update-grn-task.component.html',
  providers: [AppGlobals, DialogService, SharedService, GrnTaskService]
})
export class UpdateGrnTaskComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private grnTaskService: GrnTaskService) { }

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

  addGrnTaskForm: FormGroup;
  isSubmitted = false;
  baseUrl: any = null;

  TaskEntityData = {
    "entityId": null, "grnId": null, "stageName": null, "workflowName": null,
    "assignToRole": null, "assignToUser": null, "approvalStatus": null,
    "remark": null
  };

  cancel = function () {
    this.router.navigate(['/grnTaskSearch']);
  }

  updateTask = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.grnTaskService.processTask(this.TaskEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Task updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addGrnTaskForm.reset();
          this.router.navigate(['/grnTaskSearch']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Edit
  editon = function (id) {
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
      this.searchWorkflowHistory(this.TaskEntityData.grnId);
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  // Search function
  searchWorkflowHistory = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.grnTaskService.getWorkflowHistory(id, headers).subscribe(resp => {
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
    this.addGrnTaskForm = this.formBuilder.group({
      entityId: [null, Validators.required],
      grnId: [null],
      stageName: [null],
      workflowName: [null],
      assignToRole: [null],
      assignToUser: [null],
      approvalStatus: [null],
      remark: [null]
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Approve/Reject";
      this.editon(this.route.snapshot.params.id);
      //this.disabledField();
      //this.searchWorkflowHistory(this.route.snapshot.params.id);
    }

    this.baseUrl = this._global.baseUrl;
  }

}
