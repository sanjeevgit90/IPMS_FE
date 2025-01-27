import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { TicketTaskService } from './ticket-task.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ticket-task',
  templateUrl: './ticket-task.component.html',
  providers: [TicketTaskService, AppGlobals, DialogService, SharedService]
})
export class TicketTaskComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketTaskService: TicketTaskService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['ticketNo', 'assetName', 'ticketType', 'approvalStatus', 'ticketOwnerName', 'action'];
  historyColumns: string[] = ['ticketNo', 'assetName', 'ticketType', 'approvalStatus', 'ticketOwnerName',];

  TicketTaskData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  history: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  FilterData = { "state": null, "district": null };

  PageTitle = "Ticket Task List";


  filterDiv: boolean = false;
  // addUser = function() {
  //  
  //   this.router.navigate(['/TicketMaster']);
  // }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TicketTaskData.filter = filterValue.trim().toLowerCase();
  }

  filterFunc = function () {

    this.filterDiv = true;
  }
  cancel = function () {

    this.filterDiv = false;
    this.FilterData = {};
  }







  search = function () {

    // this.FilterData
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketTaskService.ticketList(headers, this.FilterData).subscribe(resp => {
     
      this.TicketTaskData= new MatTableDataSource(resp.content);
      this.TicketTaskData.sort = this.sort;
      this.TicketTaskData.paginator = this.paginator;
      this.totalRecords = resp.totalElements;
      this.history = false;
      this.showLoading = false;


    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getHistoryTask = function () {
debugger;
    // this.FilterData
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketTaskService.HistoryTaskList(headers, this.FilterData).subscribe(resp => {
debugger;
      this.TicketTaskData = new MatTableDataSource(resp.content);
      this.TicketTaskData.sort = this.sort;
      this.TicketTaskData.paginator = this.paginator;
      this.totalRecords = this.TicketTaskData.filteredData.length;
      this.showLoading = false;
      this.history = true;

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

