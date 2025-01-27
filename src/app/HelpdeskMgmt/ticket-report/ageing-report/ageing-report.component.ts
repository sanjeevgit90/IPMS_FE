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
import { TicketAgingFilterSession } from '../../helpdeskfilterdata';

@Component({
  selector: 'app-ageing-report',
  templateUrl: './ageing-report.component.html',
  providers: [TicketReportService, AppGlobals, DialogService, SharedService]
})
export class TicketAgeingReportComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketService: TicketReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['ticketNo', 'createdDate', 'assignName', 'priority', 'ticketStatus', 'vendorname', 'escalatedOn', 'ageingSince'];
  exportColumns: string[] = ['ticketNo', 'ticketTitle', 'createdDate', 'assignName', 'priority', 'ticketStatus',
    'escalatedTo', 'escalatedOn', 'ageingsince']

  TicketData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  history: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  FilterData = {
    "ticketNo": null, "priority": null, "accountName": null, "state": null,
    "district": null, "vendorName": null, "ticketStatus": null
  };


  PageTitle = "Ticket Ageing Report";
  vendorList: any = [];
  projectList: any = [];

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
    debugger;
    this.filterDiv = true;
    this.getProjectList();
    this.getVendorList();
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim().toLowerCase();
      this.FilterData.state = state.trim().toLowerCase();
    }
    sessionStorage.removeItem("AGEINGFILTERSESSION");
    this.result = false;
    this.search();

  }


  getVendorList = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketTaskService.getAllVendorList(headers).subscribe(resp => {
      debugger;
      this.vendorList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  TicketDataExport: any = [];

  search = function () {
    debugger;
    // this.FilterData
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketService.ticketAgeingReport(headers, this.FilterData).subscribe(resp => {

      // Set Filter
      let AgeingFilterSession = new TicketAgingFilterSession();
      AgeingFilterSession.ticketNo = this.FilterData.ticketNo;
      AgeingFilterSession.priority = this.FilterData.priority;
      AgeingFilterSession.accountName = this.FilterData.accountName;
      AgeingFilterSession.ticketStatus = this.FilterData.ticketStatus;
      AgeingFilterSession.vendorName = this.FilterData.vendorName;
      sessionStorage.setItem('AGEINGFILTERSESSION', JSON.stringify(AgeingFilterSession));
      this.result = !Object.values(AgeingFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;

      this.filterDiv = false;
      this.TicketDataExport = resp.content;
      this.TicketData = new MatTableDataSource(resp.content);
      this.TicketData.sort = this.sort;
      this.TicketData.paginator = this.paginator;
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
    let AgeingFilterSession = JSON.parse(sessionStorage.getItem('AGEINGFILTERSESSION'));
    if (sessionStorage.getItem('AGEINGFILTERSESSION') != null) {
      this.FilterData.ticketNo = AgeingFilterSession.ticketNo;
      this.FilterData.priority = AgeingFilterSession.priority;
      this.FilterData.accountName = AgeingFilterSession.accountName;
      this.FilterData.ticketStatus = AgeingFilterSession.ticketStatus;
      this.FilterData.vendorName = AgeingFilterSession.vendorName;
    }
    if (AgeingFilterSession != null) {
      this.result = !Object.values(AgeingFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }

    this.search();

  }

}

