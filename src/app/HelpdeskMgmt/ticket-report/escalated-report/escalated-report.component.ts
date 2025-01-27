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

@Component({
  selector: 'app-escalated-report',
  templateUrl: './escalated-report.component.html',
  providers: [TicketReportService, AppGlobals, DialogService, SharedService]
})
export class TicketEscalationReportComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketService: TicketReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['ticketNo', 'createdDate', 'assetName', 'location', 'ticketStatus', 'vendorname', 'escalatedOn'];
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
    "district": null, "vendorName": null, "escalatedOn": null
  };

  PageTitle = "Ticket Escalation Report";


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
  }

  projectList: any = [];
  vendorList: any = [];

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
  getVendorList = function () {
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



  search = function () {
    debugger;
    // this.FilterData
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    if (this.FilterData.escalatedOn != null) {
      this.FilterData.escalatedOn = this.FilterData.escalatedOn.getTime();
    }

    this.ticketService.ticketEscalationReport(headers, this.FilterData).subscribe(resp => {
      debugger;
      this.filterDiv = false;
      this.TicketData= new MatTableDataSource(resp.content);
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
    this.search();

  }

}

