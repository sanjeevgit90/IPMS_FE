import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { TicketReportService } from '../ticket-report.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IncidentFilterSession } from '../../helpdeskfilterdata';
//import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-incident-report',
  templateUrl: './incident-report.component.html',
  providers: [TicketReportService, AppGlobals, DialogService, SharedService]
})
export class TicketIncidentReportComponent implements OnInit {
  loading:boolean =false;
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketService: TicketReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['Serial', 'ticketNo', 'location', 'assettag', 'productModel',
    'priority', 'ticketCategory', 'resolution', 'dueDate', 'totalCloserTime', 'contactName', 'ticketStatus']

  exportColumns: string[] = ['ticketNo', 'location','locationAddress', 'assettag', 'serialNo', 'productModel', 'subCategory',
    'priority', 'ticketType', 'ticketCategory', 'ticketSubCategory','description','resolution', 'dueDate',
     'ticketClosedTime', 'totalCloserTime', 'violationTime', 'contactName', 'updatedBy', 'ticketStatus',
      'attachment']
  TicketData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('content') content:ElementRef;

  TicketDataExport: any = [];
downloadEnable:boolean = false;
  showLoading: boolean = false;
  history: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  projectList: any = [];
  stateList: any = [];
  districtList: any = [];
  FilterData = {
    "ticketNo": null, "priority": null, "accountName": null, "state": null,
    "district": null, "fromDate": null, "toDate": null,
  };

  PageTitle = "Ticket Incident Report";


  filterDiv: boolean = false;
  // addUser = function() {
  //   debugger;
  //   this.router.navigate(['/TicketMaster']);
  // }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TicketData.filter = filterValue.trim().toLowerCase();
  }

  filterFunc = function () {
    this.filterDiv = true;
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("INCIDENTFILTERSESSION");
    this.result = false;
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim();
      this.FilterData.state = state.trim();
      this.disable = true;
      this.getActiveDistrictFromstate(state.trim());
    }
  }
  fromdateSheet: any;
  todateSheet: any;

  search = function () {
    // this.FilterData
    const headers = { "Authorization": sessionStorage.getItem("token") };
    debugger;
    if ((this.FilterData.toDate != null) && (this.FilterData.fromDate != null)) {
      let toDate = this.FilterData.toDate.getTime();
      let fromDate = this.FilterData.fromDate.getTime();
      if (toDate == fromDate) {
        this.FilterData.toDate.setHours(this.FilterData.toDate.getHours() + 24);
      }
    }
    if (this.FilterData.fromDate != null) {
      this.fromdateSheet = this.FilterData.fromDate;
      this.FilterData.fromDate = this.FilterData.fromDate.getTime();
    }
    if (this.FilterData.toDate != null) {
      this.todateSheet = this.FilterData.toDate;
      this.FilterData.toDate = this.FilterData.toDate.getTime();
    }
    
    this.showLoading = true;
    this.ticketService.incidentReport(headers, this.FilterData).subscribe(resp => {
       // Set Filter
       debugger;
      let incidentFilterSession = new IncidentFilterSession();
      incidentFilterSession.ticketNo = this.FilterData.ticketNo;
      incidentFilterSession.priority = this.FilterData.priority;
      incidentFilterSession.accountName = this.FilterData.accountName;
      incidentFilterSession.state = this.FilterData.state;
      incidentFilterSession.district = this.FilterData.district;
      incidentFilterSession.fromDate = this.FilterData.fromDate;
      incidentFilterSession.toDate = this.FilterData.toDate;
      sessionStorage.setItem('INCIDENTFILTERSESSION', JSON.stringify(incidentFilterSession));
      this.result = !Object.values(incidentFilterSession).every(o => o === null || o === undefined|| o === "");
      this.filterDiv = false;
      this.FilterData.fromDate = this.fromdateSheet;
      this.FilterData.toDate = this.todateSheet;
      this.TicketData = new MatTableDataSource(resp.content);
      this.TicketData.sort = this.sort;
      this.TicketData.paginator = this.paginator;
      this.TicketDataExport = resp.content;
      this.totalRecords = resp.totalElements;
     // this.downloadEnable = false;
      this.showLoading = false;


    }, (error: any) => {
      this.showLoading = false;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
        return;
      }
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  /* downloadExcel = function () {
    // this.FilterData
    const headers = { "Authorization": sessionStorage.getItem("token") };
    debugger;
    if ((this.FilterData.toDate != null) && (this.FilterData.fromDate != null)) {
      let toDate = this.FilterData.toDate.getTime();
      let fromDate = this.FilterData.fromDate.getTime();
      if (toDate == fromDate) {
        this.FilterData.toDate.setHours(this.FilterData.toDate.getHours() + 24);
      }
    }
    if (this.FilterData.fromDate != null) {
      this.fromdateSheet = this.FilterData.fromDate;
      this.FilterData.fromDate = this.FilterData.fromDate.getTime();
    }
    if (this.FilterData.toDate != null) {
      this.todateSheet = this.FilterData.toDate;
      this.FilterData.toDate = this.FilterData.toDate.getTime();
    }
    
    this.loading = true;
    this.ticketService.downloadIncident(headers, this.FilterData).subscribe(resp => {
       // Set Filter
       debugger;
      this.TicketDataExport = resp.content;
      this.downloadEnable= true;
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  */
  // State List

  getActiveState = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getStateList(headers).subscribe(resp => {
      debugger;
      this.stateList = resp;
    }, (error: any) => {
      debugger;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
        return;
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // district List

  getActiveDistrictFromstate = function (state) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getDistrictList(headers, state).subscribe(resp => {
      debugger;
      this.districtList = resp;
    }, (error: any) => {
      debugger;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
        return;
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // City List

  getActiveCityFromDistrict = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCityListFromDistrict(headers, name).subscribe(resp => {
      debugger;
      this.cityList = resp;
    }, (error: any) => {
      debugger;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
        return;
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // projectList
  getActiveProject = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };

    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
    }, (error: any) => {
      debugger;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
        return;
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  
  printComponent(cmpName): void {
    let printContents, popupWin;
    printContents = document.getElementById(cmpName).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
  <html>
    <head>
      <title>Purchase Order</title>
      <style>
    body {font: 400 14px/20px Roboto, "Helvetica Neue", sans-serif;}
    .table-bordered td, .table-bordered th {
      border: 1px solid #dee2e6; padding: .5rem; margin:0px}
    .pocenter-align { text-align: center;  padding: 8px;  margin: 0px;
    }
      </style>
    </head>
<body onload="window.print();window.close()">${printContents}</body>
  </html>`
    );
    popupWin.document.close();
  }

  disable: boolean = false;

  ngOnInit(): void {
    this.getActiveState();
    this.getActiveProject();
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim();
      this.FilterData.state = state.trim();
      this.disable = true;
      this.getActiveDistrictFromstate(this.FilterData.state);
    }
   
       //Assign Filter
       let incidentFilterSession = JSON.parse(sessionStorage.getItem('INCIDENTFILTERSESSION'));
       if (sessionStorage.getItem('INCIDENTFILTERSESSION') != null) {
         this.FilterData.ticketNo = incidentFilterSession.ticketNo;
         this.FilterData.priority = incidentFilterSession.priority;
         this.FilterData.accountName = incidentFilterSession.accountName;
         this.FilterData.state = incidentFilterSession.state;
         this.FilterData.district = incidentFilterSession.district;
         this.FilterData.toDate = (new Date(incidentFilterSession.toDate));
         this.FilterData.fromDate = (new Date(incidentFilterSession.fromDate));
         if (Object.keys(incidentFilterSession).length === 0 && incidentFilterSession.constructor === Object) {
           return;
         }
         else{
          
           this.search();
         }
       }
       if (incidentFilterSession != null) { 
         this.result = !Object.values(incidentFilterSession).every(o => o === null || o === "");
       } else {
         this.result = false;
       }
   
       // this.search();
   
     }
   }
   