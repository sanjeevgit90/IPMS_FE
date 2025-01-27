import { Component, OnInit, ViewChild } from '@angular/core';
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
import { TicketSLAFilterSession } from '../../helpdeskfilterdata';

@Component({
  selector: 'app-sla-report',
  templateUrl: './sla-report.component.html',
  providers: [TicketReportService, AppGlobals, DialogService, SharedService]
})
export class TicketSLAReportComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketService: TicketReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['ticketNo', 'location',
    'ticketType', 'ticketStatus', 'priority', 'ticketOwnerName', 'assignName', 'createdate'];

  exportColumns: string[] = ['ticketNo', 'ticketCategory', 'location', 'category', 'subcategory', 'district', 'createdBy',
    'assignName', 'ticketType', 'priority', 'dueDate', 'resolutionDate', 'ticketClosedTime', 'totalCloserTime', 'updatedBy', 'ticketStatus']

  TicketMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  TicketDataExport: any = [];
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  matSelectDuration = this._global.matSelectDurationTime;
  pageSizedisplay = this._global.pageSize;
  FilterData = {
    "ticketNo": null, "priority": null, "accountName": null, "state": null,
    "district": null, "fromDate": null, "toDate": null
  };

  PageTitle = "Ticket SLA Report";
  filterDiv: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TicketMasterData.filter = filterValue.trim().toLowerCase();
  }

  projectList: any = [];

  filterFunc = function () {
    this.filterDiv = true;
    this.getProjectList();
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("ASSETFILTERSESSION");
    this.result = false;
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim().toLowerCase();
      this.FilterData.state = state.trim().toLowerCase();
    }
  }
  //get all project list
  getProjectList = function () {
    // debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      // debugger;
      this.projectList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  fromdateSheet :any;
  todateSheet :any;

  search = function () {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    // Set Filter
    debugger;
    let ticketSlafilterSession = new TicketSLAFilterSession();
    ticketSlafilterSession.ticketNo = this.FilterData.ticketNo;
    ticketSlafilterSession.priority = this.FilterData.priority;
    ticketSlafilterSession.accountName = this.FilterData.accountName;
    ticketSlafilterSession.fromDate = this.FilterData.fromDate;
    ticketSlafilterSession.toDate = this.FilterData.toDate;
    sessionStorage.setItem('TICKETSLAFILTERSESSION', JSON.stringify(ticketSlafilterSession));
    this.result = !Object.values(ticketSlafilterSession).every(o => o === null || o === undefined|| o === "");
    this.filterDiv = false;
    
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
    this.ticketService.ticketSLAReport(headers, this.FilterData).subscribe(resp => {
      debugger;
      this.FilterData.fromDate = this.fromdateSheet;
      this.FilterData.toDate  = this.todateSheet;
           
      this.filterDiv = false;
      this.TicketDataExport = resp.content;
      this.TicketMasterData= new MatTableDataSource(resp.content);
      this.TicketMasterData.sort = this.sort;
      this.TicketMasterData.paginator = this.paginator;
      this.totalRecords = resp.totalElements;
      this.showLoading = false;


    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }






  ngOnInit(): void {
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim().toLowerCase();
      this.FilterData.state = state.trim().toLowerCase();
    }
    
    //Assign Filter
    let ticketSlafilterSession = JSON.parse(sessionStorage.getItem('TICKETSLAFILTERSESSION'));
    if (sessionStorage.getItem('TICKETSLAFILTERSESSION') != null) {
      this.FilterData.ticketNo = ticketSlafilterSession.ticketNo;
      this.FilterData.priority = ticketSlafilterSession.priority;
      this.FilterData.accountName = ticketSlafilterSession.accountName;
      this.FilterData.fromDate = ticketSlafilterSession.fromDate;
      this.FilterData.toDate = ticketSlafilterSession.toDate;
      if (Object.keys(ticketSlafilterSession).length === 0 && ticketSlafilterSession.constructor === Object) {
        return;
      }
      else{
        this.search();
      }
    }
    if (ticketSlafilterSession != null) { 
      this.result = !Object.values(ticketSlafilterSession).every(o => o === null || o === "");
    } else {
      this.result = false;
    }

    //this.search();
  }

}
