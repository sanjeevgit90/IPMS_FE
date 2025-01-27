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
import { TicketMISFilterSession } from '../../helpdeskfilterdata';

@Component({
  selector: 'app-ticket-mis-report',
  templateUrl: './ticket-mis-report.component.html',
  providers: [TicketReportService, AppGlobals, DialogService, SharedService]
})
export class TicketMISComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketService: TicketReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['ticketNo', 'ticketCategory', 'location', 'category', 'createdBy',
    'ticketType', 'dueDate', 'ticketClosedTime', 'updatedBy', 'ticketStatus'];

  exportColumns: string[] = ['ticketNo', 'ticketCategory', 'location', 'category', 'subcategory', 'district', 'createdBy',
    'assignName', 'ticketType', 'priority', 'dueDate', 'resolutionDate', 'ticketClosedTime', 'totalCloserTime', 'updatedBy', 'ticketStatus']

  TicketData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  TicketDataExport: any = [];

  showLoading: boolean = false;
  history: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  FilterData = {
    "ticketNo": null, "priority": null, "accountName": null, "state": null,
    "district": null, "location": null, "ticketStatus": null, "fromDate": null, "toDate": null
  };

  PageTitle = "Ticket MIS Report";

  projectList: any = [];
  stateList: any = [];
  districtList: any = [];
  locationList: any = [];
  filterDiv: boolean = false;
  // addUser = function() {
  //   debugger;
  //   this.router.navigate(['/TicketMaster']);
  // }

  getActiveState = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getStateList(headers).subscribe(resp => {
      debugger;
      this.stateList = resp;
    }, (error: any) => {
      debugger;
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
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // City List

  getActiveLocationsFromDistrict = function (district) {
    // debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveLocationsFromDistrict(headers, district).subscribe(resp => {
      //  debugger;
      this.locationList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
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
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  disable: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TicketData.filter = filterValue.trim().toLowerCase();
  }

  filterFunc = function () {
    debugger;
    this.filterDiv = true;
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("TICKETMISFILTERSESSION");
    this.result = false;
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim();
      this.FilterData.state = state.trim();
      this.disable = true;
    }
  }





  fromdateSheet: any;
  todateSheet: any;

  search = function () {
    debugger;
    // this.FilterData
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;

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

    this.ticketService.ticketMisReport(headers, this.FilterData).subscribe(resp => {
      debugger;
      // Set Filter
      debugger;
      this.FilterData.fromDate = this.fromdateSheet;
      this.FilterData.toDate = this.todateSheet;

      let ticketMisfilterSession = new TicketMISFilterSession();
      ticketMisfilterSession.ticketNo = this.FilterData.ticketNo;
      ticketMisfilterSession.priority = this.FilterData.priority;
      ticketMisfilterSession.accountName = this.FilterData.accountName;
      ticketMisfilterSession.state = this.FilterData.state;
      ticketMisfilterSession.district = this.FilterData.district;
      ticketMisfilterSession.location = this.FilterData.location;
      ticketMisfilterSession.fromDate = this.FilterData.fromDate;
      ticketMisfilterSession.toDate = this.FilterData.toDate;
      ticketMisfilterSession.ticketStatus = this.FilterData.ticketStatus;
      sessionStorage.setItem('TICKETMISFILTERSESSION', JSON.stringify(ticketMisfilterSession));
      this.result = !Object.values(ticketMisfilterSession).every(o => o === null || o === undefined || o === "");

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
    this.getActiveState();
    this.getActiveProject();
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim();
      this.FilterData.state = state.trim();
      this.disable = true;
      this.getActiveDistrictFromstate(state.trim());
      this.getActiveLocationsFromDistrict(district.trim());
    }

    //Assign Filter
    let ticketMisfilterSession = JSON.parse(sessionStorage.getItem('TICKETMISFILTERSESSION'));
    if (sessionStorage.getItem('TICKETMISFILTERSESSION') != null) {
      this.FilterData.ticketNo = ticketMisfilterSession.ticketNo;
      this.FilterData.priority = ticketMisfilterSession.priority;
      this.FilterData.accountName = ticketMisfilterSession.accountName;
      this.FilterData.state = ticketMisfilterSession.state;
      this.FilterData.district = ticketMisfilterSession.district;
      this.FilterData.location = ticketMisfilterSession.location;
      this.FilterData.fromDate = ticketMisfilterSession.fromDate;
      this.FilterData.toDate = ticketMisfilterSession.toDate;
      this.FilterData.ticketStatus = ticketMisfilterSession.ticketStatus;
      if (Object.keys(ticketMisfilterSession).length === 0 && ticketMisfilterSession.constructor === Object) {
        return;
      }
      else {
        this.search();
      }
    }
    if (ticketMisfilterSession != null) {
      this.result = !Object.values(ticketMisfilterSession).every(o => o === null || o === "");
    } else {
      this.result = false;
    }

    // this.search();

  }

}

