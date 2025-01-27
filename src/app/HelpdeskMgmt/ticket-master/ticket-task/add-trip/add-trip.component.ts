import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../../global/app.global';
import { DialogService } from '../../../../service/dialog.service';
import { TicketTaskService } from '.././ticket-task.service';
import { SharedService } from '../../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  providers: [TicketTaskService, AppGlobals, DialogService, SharedService]
})
export class AddTripComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketTaskService: TicketTaskService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['tripId', 'sourceAdd', 'destAdd', 'startTime', 'endTime', 'distance'];
  TripData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  FilterData = {};

  PageTitle = "Trip List";
  filterDiv: boolean = false;


  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }

  search = function () {
    debugger;
    // this.FilterData
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketTaskService.tripList(headers, this.FilterData).subscribe(resp => {
      debugger;
      this.TripData = new MatTableDataSource(resp);
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


