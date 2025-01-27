import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-billingcomparsion',
  templateUrl: './billingcomparsion.component.html',
  providers: [BillingReportService, AppGlobals, DialogService, SharedService]
})
export class BillingComparsionomponent implements OnInit {

  constructor( private router: Router, private route: ActivatedRoute, private http: HttpClient, private scheduleService: BillingReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private dialog:MatDialog) { }
  
    displayedColumns: string[] = ['amountofbilling', 'invoiceno', 'id', 'totalamount' , 'difference'];
    ScheduleRecord: MatTableDataSource<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Billing Comparsion";

  displayedColumns1: string[] =  ['selectionvalue'];
  ProjectData: MatTableDataSource<any>;

  applyFilterProject(event: Event) {
   debugger;
  const filterValue = (event.target as HTMLInputElement).value;
  this.ProjectData.filter = filterValue.trim().toLowerCase();
}
applyFilter(event: Event) {
  debugger;
 const filterValue = (event.target as HTMLInputElement).value;
 this.ScheduleRecord.filter = filterValue.trim().toLowerCase();
}

   projectList : any = [];
   
   enableSchedule: boolean= false;
   ProjectDataFlag :any;
   projectId: any;

   FilterData= {"projectid":null};

  // projectList
  getActiveProject= function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
  
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
      this.ProjectData = new MatTableDataSource(resp);
      this.ProjectDataFlag = this.ProjectData.filteredData.length;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  billingComparsionReport = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.FilterData.projectid= name;
    this.scheduleService.billingComparsionReport(headers, this.FilterData).subscribe(resp => {
      debugger;
      this.ScheduleRecord= new MatTableDataSource(resp);
      this.ScheduleRecord.sort = this.sort;
      this.ScheduleRecord.paginator = this.paginator;
      this.totalRecords = this.ScheduleRecord.filteredData.length;
      this.enableSchedule=true;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  ngOnInit(): void {
    debugger;
    this.getActiveProject();
    
  }

 

}
