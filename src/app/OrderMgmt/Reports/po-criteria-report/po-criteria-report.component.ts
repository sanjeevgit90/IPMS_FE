import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { PoReportsService } from '../po-reports.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-po-criteria-report',
  templateUrl: './po-criteria-report.component.html',
  providers: [PoReportsService, AppGlobals, DialogService, SharedService]

})
export class PoCriteriaReportComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poReportsService: PoReportsService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService
  ) { }

  displayedColumns: string[] = ['purchaseOrderNo', 'accName', 'suppName', 'buyName' ,'grandTotal', 'currency', 'approvalStatus', 'createdDate'];
  PoCriteriaData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Po Criteria Report";
  add = true;
  edit = false;
  list = true;
  addPoCriteriaForm: FormGroup;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.PoCriteriaData.filter = filterValue.trim().toLowerCase();
  }
  ReportRequest = {
    "accountName": null, "category": null, "subcategory": null, "productId": null, "fromDate": null, "toDate": null, "wiseReport": null
  };

  FilterData = {
    
  };
    // Search function
    search = function () {
      debugger;
      const headers = { "Authorization": sessionStorage.getItem("token") };
      /*if(this.ReportRequest.wiseReport == null){
        this.dialogService.openConfirmDialog("Please select category or product.");
        return;
      }*/
      if(this.ReportRequest.wiseReport == "Category"){
        if(this.ReportRequest.category == null && this.ReportRequest.subcategory == null){
          this.dialogService.openConfirmDialog("Please select category or sub-category.");
          return;
        }
        this.ReportRequest.productId = null;
      }
      if(this.ReportRequest.wiseReport == "Product"){
        if(this.ReportRequest.productId == null){
          this.dialogService.openConfirmDialog("Please select product.");
          return;
        }
        this.ReportRequest.category = null;
        this.ReportRequest.subcategory = null;
      }
      if(this.ReportRequest.fromDate != null){
        this.ReportRequest.fromDate = this.ReportRequest.fromDate.getTime();
      }
      if(this.ReportRequest.toDate != null){
        this.ReportRequest.toDate = this.ReportRequest.toDate.getTime();
      }
      this.showLoading = true;
      this.poReportsService.getPoCriteriaReport(this.ReportRequest, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.PoCriteriaData = new MatTableDataSource(resp);
        console.log(resp);
        this.PoCriteriaData.sort = this.sort;
        this.PoCriteriaData.paginator = this.paginator;
        if(this.PoCriteriaData.filteredData != null){
          this.totalRecords = this.PoCriteriaData.filteredData.length;
        } else {
          this.totalRecords = 0;
        }
        if(this.ReportRequest.fromDate != null){
          this.ReportRequest.fromDate = (new Date(this.ReportRequest.fromDate));
        }
        if(this.ReportRequest.toDate != null){
          this.ReportRequest.toDate = (new Date(this.ReportRequest.toDate));
        }
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        if(this.ReportRequest.fromDate != null){
          this.ReportRequest.fromDate = (new Date(this.ReportRequest.fromDate));
        }
        if(this.ReportRequest.toDate != null){
          this.ReportRequest.toDate = (new Date(this.ReportRequest.toDate));
        }
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  
  // category List
  categoryList:any = [];
  getActiveCategory = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveCategory(headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.categoryList = resp;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

   // subcategory List from category
   subcategoryList:any = [];
   getActiveSubCategoryfromcategory = function (Name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveSubCategoryfromcategory(headers, Name).subscribe(resp => {
      debugger;
      this.subcategoryList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

   // productList
   productList:any = [];
   getProductList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getAllProduct(headers).subscribe(resp => {
      debugger;
      this.productList = resp;
     }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }  
  
  // projectList
  projectList:any = [];
  getProjectList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getProjectList(headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.projectList = resp;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

    ngOnInit(): void {

      //Fromgroup collection
      this.addPoCriteriaForm = this.formBuilder.group({
        accountName: [null],
        category: [null],
        subcategory: [null],
        productId: [null],
        fromDate: [null],
        toDate: [null],
        wiseReport: [null]
      });
      //this.search();
      this.getActiveCategory();
      this.getProductList();
      this.getProjectList();
    }
    get formControls() { return this.addPoCriteriaForm.controls; }
  }
  
