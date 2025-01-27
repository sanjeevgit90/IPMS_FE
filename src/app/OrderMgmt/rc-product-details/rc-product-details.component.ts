import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { RcProductDetailsService } from '../../OrderMgmt/rc-product-details/rc-product-details.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PoTaskService } from '../../OrderMgmt/purchase-order-task/po-task.service';

@Component({
  selector: 'app-rc-product-details',
  templateUrl: './rc-product-details.component.html',
  providers: [RcProductDetailsService, AppGlobals, DialogService, SharedService, PoTaskService]
})
export class RcProductDetailsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private productDetailsService: RcProductDetailsService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private poTaskService: PoTaskService) { }

  displayedColumns: string[] = ['product', 'hsnId', 'cgst', 'sgst', 'igst', 'cgstAmount', 'sgstAmount', 'igstAmount', 'finalAmount', 'action'];
  ProductDetailsList: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  FilterData = { "entityId": "" };
  TaskData = { "rcId": null, "poRcFlag": null, "remark": null, "workflowType": null };
  TaskEntityData = {
    "entityId": null, "rcId": null, "uploadFile": null,
    "poRcFlag": null, "stageName": null, "workflowName": null,
    "assignToRole": null, "assignToUser": null, "approvalStatus": null,
    "remark": null
  };
  //workflowDiv:boolean = false;
  additionalTerms: any = false;

  taskId = null;

  PageTitle = "Product Details";
  filterDiv: boolean = false;
  /* addProductDetails = function() {
    debugger;
    this.router.navigate(['/addRcProductDetails']);
  } */

  filterFunc = function () {
    debugger;
    this.filterDiv = true;
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }

  ProductDetailsCard: any = [];
  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.FilterData.entityId = this.route.snapshot.params.id;
    this.showLoading = true;

    this.productDetailsService.searchAllProductDetailsByRc(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.ProductDetailsCard = resp;
      this.ProductDetailsList = new MatTableDataSource(resp);
      this.ProductDetailsList.sort = this.sort;
      this.ProductDetailsList.paginator = this.paginator;
      this.totalRecords = this.ProductDetailsList.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  addProduct = function () {
    debugger;
    //this.router.navigate(['searchRateContract/addRcProductDetails',this.route.snapshot.params.id,'add']);
    if (this.route.snapshot.params.task == null) {
      this.router.navigate(['searchRateContract/addRcProductDetails', this.route.snapshot.params.id, 'add']);
    } else {
      this.router.navigate(['searchTask/addRcProductDetails', this.route.snapshot.params.id, 'add', this.route.snapshot.params.task]);
    }
  }

  editProduct = function (id) {
    debugger;
    //this.router.navigate(['searchRateContract/editRcProductDetails',id,'edit']);
    if (this.route.snapshot.params.task == null) {
      this.router.navigate(['searchRateContract/editRcProductDetails', id, 'edit']);
    } else {
      this.router.navigate(['searchTask/editRcProductDetails', id, 'edit', this.route.snapshot.params.task]);
    }
  }

  // Delete function
  deleteProduct = function (productId) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to delete this product?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.productDetailsService.deleteProductDetailsById(productId, headers).subscribe(resp => {
            this.successMessage = 'Product deleted successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      })
  }

  saveTask = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    const errStr = null;
    this.showLoading = true;
    this.TaskData.rcId = this.route.snapshot.params.id;
    this.TaskData.poRcFlag = "RC";
    this.poTaskService.saveRcTask(this.TaskData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskData = {};
      this.successMessage = "Rate contract sent for approval";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.addProductDetailsForm.reset();
          this.router.navigate(['searchRateContract']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get task for resending
  getTaskById = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var taskId = id;
    this.poTaskService.getTaskById(taskId, headers, "RC").subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskEntityData = resp;
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
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
    //this.TaskEntityData.poRcFlag = this.route.snapshot.params.poRcFlag;
    this.TaskEntityData.approvalStatus = "APPROVED";
    this.poTaskService.processTask(this.TaskEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "RC re-sent for approval.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.addPoTaskForm.reset();
          this.router.navigate(['/searchTask']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    //this.search();
    debugger;
    if (this.route.snapshot.params.page == 'list') {
      this.PageTitle = "RC Product Details";
      this.search();
      //this.disabledField();
    }

    if (this.route.snapshot.params.task != null) {
      this.taskId = this.route.snapshot.params.task;
      this.getTaskById(this.taskId);
    }

    this.additionalTerms = sessionStorage.getItem("additionalTerms");
  }

}