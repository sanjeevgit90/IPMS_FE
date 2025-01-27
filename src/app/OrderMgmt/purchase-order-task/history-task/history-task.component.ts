import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { PurchaseOrderService } from '../../../OrderMgmt/purchase-order/purchase-order.service';
import { PoTaskService } from '../../../OrderMgmt/purchase-order-task/po-task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-history-task',
  templateUrl: './history-task.component.html',
  providers: [PurchaseOrderService, AppGlobals, DialogService, SharedService, PoTaskService]
})
export class HistoryTaskComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private purchaseOrderService: PurchaseOrderService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private poTaskService: PoTaskService) { }

    displayedColumns: string[] = ['poRcFlag', 'purchaseOrderNo', 'approvalStatus', 'stageName', 'remark'];
    TaskListData: MatTableDataSource<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    showLoading: boolean = false;
  
    totalRecords: any;
    itemPerPage = this._global.pageNumer;
    pageSizedisplay = this._global.pageSize;
  
    FilterData = {"purchaseOrderNo": null, "approvalStatus": null};
  
    PageTitle = "Task Approval History";
    filterDiv:boolean = false;
  
    filterFunc = function() {
      debugger;
      this.filterDiv = true;
    }
    cancel = function() {
      debugger;
      this.filterDiv = false;
      this.FilterData = {};
    }

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.poTaskService.getAllHistoryTask(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskListData = new MatTableDataSource(resp.content);
      this.TaskListData.sort = this.sort;
      this.TaskListData.paginator = this.paginator;
      this.totalRecords = this.TaskListData.filteredData.length;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.search();
  }
}