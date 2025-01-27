import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { PurchaseOrderService } from '../../../OrderMgmt/purchase-order/purchase-order.service';
import { PoTaskService } from '../../../OrderMgmt/purchase-order-task/po-task.service';

@Component({
  selector: 'app-cancel-po-task',
  templateUrl: './cancel-po-task.component.html',
  providers: [PurchaseOrderService, AppGlobals, DialogService, SharedService, PoTaskService]
})
export class CancelPoTaskComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private purchaseOrderService: PurchaseOrderService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private poTaskService: PoTaskService) { }

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Cancellation";
  add = true;
  edit = false;
  list = true;

  cancelPoTaskForm: FormGroup;
  isSubmitted = false;

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
      this.successMessage = "PO sent for cancellation.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.cancelPoTaskForm.reset();
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
      this.TaskEntityData.approvalStatus = "CANCELLED";
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  ngOnInit(): void {
    this.cancelPoTaskForm = this.formBuilder.group({
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
      this.PageTitle = "Cancellation";
      this.editon(this.route.snapshot.params.id, this.route.snapshot.params.poRcFlag);
      //this.disabledField();
    }
  }

}