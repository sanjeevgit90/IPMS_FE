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
  selector: 'app-po-fullfillment-report',
  templateUrl: './po-fullfillment-report.component.html',
  providers: [PoReportsService, AppGlobals, DialogService, SharedService]

})
export class PoFullfillmentReportComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poReportsService: PoReportsService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService
  ) { }

  displayedColumns: string[] = ['purchaseOrderNo', 'accName', 'vendor', 'orderDate' ,'grandTotal', 'invoiceAmount',  'balanceInvoice','paymentDueDate'];
  PoFulfillmentData: MatTableDataSource<any>;
  displayedColumns1: string[] = ['purchaseOrderNo', 'accName', 'vendor', 'orderDate' ,'grandTotal', 'invoiceAmount', 'amount', 'balanceInvoice','balancePayment','paymentDueDate'];
  PoFulfillment: any =[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Po Fulfillment Report";
  add = true;
  edit = false;
  list = true;
  addPoCriteriaForm: FormGroup;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.PoFulfillmentData.filter = filterValue.trim().toLowerCase();
  }
  ReportRequest = {
    "projectId": null, "partyId": null, "fromDate": null, "toDate": null
  };
    // Search function
    search = function () {
      debugger;
      const headers = { "Authorization": sessionStorage.getItem("token") };
      /*if(this.ReportRequest.wiseReport == null){
        this.dialogService.openConfirmDialog("Please select category or product.");
        return;
      }*/
     
      if(this.ReportRequest.fromDate != null){
        this.ReportRequest.fromDate = this.ReportRequest.fromDate.getTime();
      }
      if(this.ReportRequest.toDate != null){
        this.ReportRequest.toDate = this.ReportRequest.toDate.getTime();
      }
      this.showLoading = true;
      this.poReportsService.getPoFulfilmentReport(this.ReportRequest, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.PoFulfillmentData = new MatTableDataSource(resp.content);
        this.PoFulfillmentData.sort = this.sort;
        this.PoFulfillment = resp.content
        this.PoFulfillmentData.paginator = this.paginator;
        if(this.PoFulfillmentData.filteredData != null){
          this.totalRecords = this.PoFulfillmentData.filteredData.length;
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
  
 
  // projectList
  projectList:any = [];
  partyList:any = [];
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

  getAllParty = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      //this.supplierPartyList = resp;
      this.partyList = resp;
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
        projectId: [null],
        fromDate: [null],
        toDate: [null],
        partyId: [null]
      });
      //this.search();
      this.getAllParty();
      this.getProjectList();
    }
    get formControls() { return this.addPoCriteriaForm.controls; }
  }
  
