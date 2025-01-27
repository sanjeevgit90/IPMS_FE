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
  selector: 'app-view-workflow',
  templateUrl: './view-workflow.component.html',
  providers: [PurchaseOrderService, AppGlobals, DialogService, SharedService, PoTaskService]
})
export class ViewWorkflowComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private purchaseOrderService: PurchaseOrderService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private poTaskService: PoTaskService) { }

    displayedColumns: string[] = ['stageName', 'approvalStatus', 'updatedBy', 'updatedDate', 'remark'];
    WorkflowHistoryData: MatTableDataSource<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    showLoading: boolean = false;
  
    totalRecords: any;
    itemPerPage = this._global.pageNumer;
    pageSizedisplay = this._global.pageSize;
    baseUrl:any = null;
  
    PageTitle = "Workflow History";

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

  back() {
    if(this.route.snapshot.params.flag == "PO"){
      this.router.navigate(['/ViewPoById',this.route.snapshot.params.id, 'PO']);
    } else if(this.route.snapshot.params.flag == "POTASK"){
      this.router.navigate(['/ViewPoById',this.route.snapshot.params.id, 'POTASK']);
    } else if(this.route.snapshot.params.flag == "RC"){
      this.router.navigate(['/ViewRcById',this.route.snapshot.params.id, 'RC']);
    } else if(this.route.snapshot.params.flag == "RCTASK"){
      this.router.navigate(['/ViewRcById',this.route.snapshot.params.id, 'RCTASK']);
    }
  }

  ngOnInit(): void {
    this.baseUrl = this._global.baseUrl;
    this.searchWorkflowHistory(this.route.snapshot.params.id, this.route.snapshot.params.flag);
  }
}