import { Component, OnInit, ViewChild , Inject, Optional} from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { BillingReportService } from '../billingreport.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-invoicereport',
  templateUrl: './invoicereport.component.html',
  providers: [BillingReportService, AppGlobals, DialogService, SharedService]
})
export class InvoiceAgeingReportComponent implements OnInit {

  constructor( private router: Router, private route: ActivatedRoute, private http: HttpClient, private invoiceService: BillingReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }
  
  displayedColumns: string[] = ['projectpin', 'customername', 'invoiceno', 'invoicedate' , 'totalamount', 'ageingsince'];
  InvoiceRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  PageTitle = "Invoice Ageing Report";
  FilterData = { "projectid": null };
  //, "fromdate":null, "toDate":null};

  filterDiv: boolean = false;

  filterFunc = function () {
    debugger;
    this.getActiveProject();
    this.filterDiv = true;
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }
  
   projectList : any = []; 
   projectid: String = null;
 
  getActiveProject = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  

  getReport = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectId = name;
    this.invoiceService.invoiceAgingReport(headers, this.FilterData).subscribe(resp => {
      debugger;
      this.InvoiceRecord= new MatTableDataSource(resp);
      this.InvoiceRecord.sort = this.sort;
      this.InvoiceRecord.paginator = this.paginator;
      this.totalRecords = this.InvoiceRecord.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

 //delete 
  
 
  ngOnInit(): void {
    debugger;
    this.getReport();
  }

 

}
