import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { BillingReportService } from '../billingreport.service';

@Component({
  selector: 'app-monthlybilling',
  templateUrl: './monthlybilling.component.html',
  providers: [BillingReportService, AppGlobals, DialogService, SharedService]
})
export class MonthlyBillingComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private scheduleService: BillingReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private dialog:MatDialog) { }
  
    displayedColumns: string[] = ['projectpin', 'customername', 'pono', 'milestoneno' , 'totalamount'];
    InvoiceRecord: MatTableDataSource<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    displayedColumns1: string[] =  ['selectionvalue'];
    MonthData: MatTableDataSource<any>;
   
  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Monthly Billing Report";

   monthList : any = [];

   selectedYear : String = null;
   
   enableMonth: boolean= false;
   enableSchedule: boolean= false;
   
  // projectId: any;

  
  reportForm: FormGroup;
  isSubmitted = false;

applyFilter(event: Event) {
  debugger;
 const filterValue = (event.target as HTMLInputElement).value;
 this.InvoiceRecord.filter = filterValue.trim().toLowerCase();
}
  // projectList
  monthlyOfBillingReport= function (year) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
  
    this.scheduleService.monthlyOfBillingReport(year,headers).subscribe(resp => {
      debugger;
      this.monthList = resp;
      this.MonthData = new MatTableDataSource(resp);
      this.enableMonth = true;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  monthlyBillingReport = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.projectId= name;
    this.scheduleService.monthlyBillingReport(name, headers).subscribe(resp => {
      debugger;
      this.InvoiceRecord= new MatTableDataSource(resp);
      this.InvoiceRecord.sort = this.sort;
      this.InvoiceRecord.paginator = this.paginator;
      this.totalRecords = this.InvoiceRecord.filteredData.length;
      this.enableSchedule=true;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  ngOnInit(): void {
    debugger;
    this.reportForm = this.formBuilder.group({
      selectedYear: [null]     
    });
  }

  get formControls() {
    return this.reportForm.controls;
  }

}
