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
  selector: 'app-grn-report',
  templateUrl: './grn-report.component.html',
  providers: [PoReportsService, AppGlobals, DialogService, SharedService]
})
export class GrnReportComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poReportsService: PoReportsService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService
  ) { }

  displayedColumns: string[] = ['poName','orderDate','suppName','product','quantity','grnQuantity','pendingQuantity'];
  GrnReportData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "GRN Report";
  add = true;
  edit = false;
  list = true;
  grnReportForm: FormGroup;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.GrnReportData.filter = filterValue.trim().toLowerCase();
  }
  GrnData = {
    "purchaseOrderNo":null, "suppId": null, "fromDate": null, "toDate": null
  };

  cancel = function() {
    this.GrnData = {};
    this.search();
  }

    // Search function
    search = function () {
      debugger;
      const headers = { "Authorization": sessionStorage.getItem("token") };
      if(this.GrnData.fromDate != null){
        this.GrnData.fromDate = this.GrnData.fromDate.getTime();
      }
      if(this.GrnData.toDate != null){
        this.GrnData.toDate = this.GrnData.toDate.getTime();
      }
      this.showLoading = true;
      this.poReportsService.getGrnReport(this.GrnData, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.GrnReportData = new MatTableDataSource(resp.content);
        this.GrnReportData.sort = this.sort;
        this.GrnReportData.paginator = this.paginator;
        this.totalRecords = this.GrnReportData.filteredData.length;
        if(this.GrnData.fromDate != null){
          this.GrnData.fromDate = new Date(this.GrnData.fromDate);
        }
        if(this.GrnData.toDate != null){
          this.GrnData.toDate = new Date(this.GrnData.toDate);
        }
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
        this.GrnData.fromDate = new Date(this.GrnData.fromDate);
        this.GrnData.toDate = new Date(this.GrnData.toDate);
      });
    }

  // Party List
  partyList:any = [];
  getActiveVendors = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      debugger;
      this.partyList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  poList:any = [];
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

    ngOnInit(): void {

      //Fromgroup collection
      this.grnReportForm = this.formBuilder.group({
        purchaseOrderNo: [null],
        suppId: [null],
        fromDate: [null],
        toDate: [null]
      });
      this.search();
      this.getActiveVendors();
      this.getPoList();
    }
    get formControls() { return this.grnReportForm.controls; }
  }