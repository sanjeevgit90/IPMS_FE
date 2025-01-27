import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { TicketMasterService } from './ticket-master.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TicketFilterSession } from '../helpdeskfilterdata';

@Component({
  selector: 'app-ticket-master',
  templateUrl: './ticket-master.component.html',
  providers: [TicketMasterService, AppGlobals, DialogService, SharedService]
})
export class TicketMasterComponent implements OnInit {
  result: boolean = false;
  pageEvent: PageEvent;
 // ticketNumber='ticketNo';
  //filter = 'GSG';
  pageNumber: number = 1;
  pageSize: number = 10;
  //sortName = 'DESC'

  totalElementsRecords:number;
  loading:boolean =false;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketMasterService: TicketMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['ticketNo', 'location',
    'ticketType', 'ticketStatus', 'ticketOwnerName', 'createdDate', 'action'];

  exportColumns: string[] = ['ticketNo', 'location', 'assettag', 'serialNo', 'priority', 'category', 'subCategory',
    'resolution', 'dueDate', 'ticketClosedTime', 'ticketStatus', 'ticketOwnerName', 'assignName', 'createdBy']

  TicketMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  TicketDataExport: any = [];
  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  ticketMasterAdd: boolean = false;
  ticketMasterEdit: boolean = false;
  ticketMasterView: boolean = false;
  ticketMasterDelete: boolean = false;

  FilterData = {
    "ticketNo": null, "priority": null, "accountName": null, "state": null,
    "district": null, "location": null, "ticketStatus": null, "ticketTitle": null, "assetid": null
  };

  PageTitle = "Ticket List";
  filterDiv: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TicketMasterData.filter = filterValue.trim().toLowerCase();
  }

  addUser = function () {

    this.router.navigate(['/TicketMaster']);
  }

  filterFunc = function () {

    this.filterDiv = true;

  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("TICKETFILTERSESSION");
    this.result = false;
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim();
      this.FilterData.state = state.trim();
      this.getActiveDistrictFromstate(this.FilterData.state);
      this.getActiveLocationsFromDistrict(this.FilterData.district);
      this.disable = true;
      this.result = true;
    }
  }

  projectList: any = [];
  stateList: any = [];
  districtList: any = [];
  locationList: any = [];
  assetList: any = [];

  getAssetByLocation = function (location) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getAssetByLocation(headers, location).subscribe(resp => {
      this.assetList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getActiveState = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getStateList(headers).subscribe(resp => {
      this.stateList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // district List

  getActiveDistrictFromstate = function (state) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getDistrictList(headers, state).subscribe(resp => {
      this.districtList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // City List

  getActiveLocationsFromDistrict = function (district) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveLocationsFromDistrict(headers, district).subscribe(resp => {
      this.locationList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // projectList
  getActiveProject = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      this.projectList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.FilterData.confirmed = true;
    debugger; 
    this.ticketMasterService.ticketList(this.FilterData, headers, this.pageNumber, this.pageSize).subscribe(resp => {
      debugger;
      // Set Filter
      this.totalRecords = resp.totalElements;
      let ticketfilterSession = new TicketFilterSession();
      ticketfilterSession.ticketNo = this.FilterData.ticketNo;
      ticketfilterSession.priority = this.FilterData.priority;
      ticketfilterSession.accountName = this.FilterData.accountName;
      ticketfilterSession.state = this.FilterData.state;
      ticketfilterSession.district = this.FilterData.district;
      ticketfilterSession.location = this.FilterData.location;
      ticketfilterSession.assetid = this.FilterData.assetid;
      ticketfilterSession.ticketStatus = this.FilterData.ticketStatus;
      sessionStorage.setItem('TICKETFILTERSESSION', JSON.stringify(ticketfilterSession));
      this.result = !Object.values(ticketfilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.TicketMasterData = new MatTableDataSource(resp.content);
      this.TicketMasterData.sort = this.sort;
      this.showLoading = false;
      this.exportToExcel();
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  exportToExcel = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.loading = true;
    this.FilterData.confirmed = true;
    this.ticketMasterService.ticketList(this.FilterData, headers, this.pageNumber, 5000).subscribe(resp => {
      this.TicketDataExport = resp.content;
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // search = function () {
  //   const headers = { "Authorization": sessionStorage.getItem("token") };
  //   this.showLoading = true;
  //   this.FilterData.confirmed = true;
  //   debugger; 
  //   this.ticketMasterService.ticketList(headers, this.ticketNumber, this.filter, this.pageNumber, this.pageSize, this.sortName).subscribe(resp => {
  //     debugger;
  //     // Set Filter
  //     this.totalRecords = resp.totalElements;
  //     let ticketfilterSession = new TicketFilterSession();
  //     ticketfilterSession.ticketNo = this.FilterData.ticketNo;
  //     ticketfilterSession.priority = this.FilterData.priority;
  //     ticketfilterSession.accountName = this.FilterData.accountName;
  //     ticketfilterSession.state = this.FilterData.state;
  //     ticketfilterSession.district = this.FilterData.district;
  //     ticketfilterSession.location = this.FilterData.location;
  //     ticketfilterSession.assetid = this.FilterData.assetid;
  //     ticketfilterSession.ticketStatus = this.FilterData.ticketStatus;
  //     sessionStorage.setItem('TICKETFILTERSESSION', JSON.stringify(ticketfilterSession));
  //     this.result = !Object.values(ticketfilterSession).every(o => o === null || o === undefined);
  //     this.filterDiv = false;
  //     this.TicketDataExport = resp.content;
  //     this.TicketMasterData = new MatTableDataSource(resp.content);
  //     this.TicketMasterData.sort = this.sort;
  //     this.showLoading = false;
  //   }, (error: any) => {
  //     this.showLoading = false;
  //     const errStr = error.error.errorDetail[0];
  //     this.dialogService.openConfirmDialog(errStr)
  //   });
  // }


  onPaginateChange(event: PageEvent) {
    debugger;
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.pageNumber = this.pageNumber + 1;
    this.search();

  }

  reopenTicket = function (name) {
    this.DeleteMsg = 'Are you sure you want to Re-open this ticket?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.ticketMasterService.reopenTicket(id, headers).subscribe(resp => {
            this.showLoading = false;
            this.successMessage = "Ticket is reopened successfully.";
            this.search();
            // this.getActiveClassification();
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {
              })

          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }


  hasRole: boolean = false;
  hasRoleCHM: boolean = false;
  disable: boolean = false;

  ngOnInit(): void {
    //Role Rights
    this.getActiveState();
    this.getActiveProject();
    this.TicketMasterData = new MatTableDataSource();
   // this.TicketMasterData.sort = this.sort;
    this.TicketMasterData.paginator = this.paginator;
  
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim();
      this.FilterData.state = state.trim();
      this.getActiveLocationsFromDistrict(this.FilterData.district);
      this.getActiveDistrictFromstate(this.FilterData.state);
      this.disable = true;
    }

    this.ticketMasterAdd = this._global.UserRights.includes("Ticket_Master_ADD");
    this.ticketMasterEdit = this._global.UserRights.includes("Ticket_Master_EDIT");
    this.ticketMasterView = this._global.UserRights.includes("Ticket_Master_VIEW");
    this.ticketMasterDelete = this._global.UserRights.includes("Ticket_Master_DELETE");

    this.hasRole = this._global.UserRights.includes("ROLE_ADMIN");

    this.hasRoleCHM = this._global.UserRights.includes("ROLE_CHM");
    //Assign Filter
    let ticketfilterSession = JSON.parse(sessionStorage.getItem('TICKETFILTERSESSION'));
    if (sessionStorage.getItem('TICKETFILTERSESSION') != null) {
      this.FilterData.ticketNo = ticketfilterSession.ticketNo;
      this.FilterData.priority = ticketfilterSession.priority;
      this.FilterData.accountName = ticketfilterSession.accountName;
      this.FilterData.state = ticketfilterSession.state;
      this.FilterData.district = ticketfilterSession.district;
      this.FilterData.location = ticketfilterSession.location;
      this.FilterData.assetid = ticketfilterSession.assetid;
      this.FilterData.ticketStatus = ticketfilterSession.ticketStatus;

      if (Object.keys(ticketfilterSession).length === 0 && ticketfilterSession.constructor === Object) {
        return;
      }
      else {
        this.search();
      }
    }
    if (ticketfilterSession != null) {
      this.result = !Object.values(ticketfilterSession).every(o => o === null);
    } else {
      this.result = false;
    }


    // this.search();
  }

}
