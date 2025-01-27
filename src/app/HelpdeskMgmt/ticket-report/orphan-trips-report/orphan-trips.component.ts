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
  selector: 'app-orphan-trips',
  templateUrl: './orphan-trips.component.html',
  providers: [TicketReportService, AppGlobals, DialogService, SharedService]
})
export class OrphanTripsComponent implements OnInit {

  constructor( private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketService: TicketReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = [ 'tripId','vehicleNo','distance','startTime', 'Source'];

  exportColumns: string[] = [ 'tripId','vehicleNo','distance','startTime', 'endTime','Source','destination'];
  TripData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  history: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  FilterData = {"vehicleNo":null, "startTime": null, "endTime":null};

  TripDataExport:any = [];
  vehicleList:any = [];

  PageTitle = "Orphan Trips Report";


  filterDiv:boolean = false;
  // addUser = function() {
  //   debugger;
  //   this.router.navigate(['/TicketMaster']);
  // }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TripData.filter = filterValue.trim().toLowerCase();
  }

  filterFunc = function() {
    debugger;
    this.filterDiv = true;
  }
  cancel = function() {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }
  getActiveVehicleList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveVehicleList(headers).subscribe(resp => {
      debugger;
      this.vehicleList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
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
    if (this.FilterData.startTime != null)
    {
     this.FilterData.startTime = this.FilterData.startTime.getTime();
    }
    if (this.FilterData.endTime != null)
    {
     this.FilterData.endTime = this.FilterData.endTime.getTime();
    }
    this.ticketService.orphanTrips(headers, this.FilterData).subscribe(resp => {
      debugger;
      this.filterDiv = false;
      this.TripDataExport = resp;
      this.TripData= new MatTableDataSource(resp);
      this.TripData.sort = this.sort;
      this.TripData.paginator = this.paginator;
      this.totalRecords = this.TripData.filteredData.length;
      this.showLoading = false;
       
  
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
 
  ngOnInit(): void {
    this.search();
   
  }

}

 