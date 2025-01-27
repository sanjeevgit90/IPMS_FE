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
  selector: 'app-monthlycollection',
  templateUrl: './monthlycollection.component.html',
  providers: [BillingReportService, AppGlobals, DialogService, SharedService]
})
export class MonthlyCollectionComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private reportService: BillingReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private dialog:MatDialog) { }
  
    displayedColumns: string[] = ['projectpin','collectiondate', 'invoiceno', 'netamountcredieted', 'utrno' ];
    CollectionRecord: MatTableDataSource<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
 
    displayedColumns1: string[] =  ['selectionvalue'];
    MonthData: MatTableDataSource<any>;
   
  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Monthly Collection Report";

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
   this.CollectionRecord.filter = filterValue.trim().toLowerCase();
  }
  // projectList
  monthlyOfCollectionReport= function (year) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
  
    this.reportService.monthlyOfCollectionReport(year,headers).subscribe(resp => {
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
    this.reportService.monthlyCollectionReport( name, headers).subscribe(resp => {
      debugger;
      this.CollectionRecord= new MatTableDataSource(resp);
      this.CollectionRecord.sort = this.sort;
      this.CollectionRecord.paginator = this.paginator;
      this.totalRecords = this.CollectionRecord.filteredData.length;
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
