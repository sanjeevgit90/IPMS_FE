import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SupportTeamService } from './support-team.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SupportFilterSession } from '../helpdeskfilterdata';

@Component({
  selector: 'app-support-team',
  templateUrl: './support-team.component.html',
  providers: [SupportTeamService, AppGlobals, DialogService, SharedService]
})
export class SupportTeamComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private supportTeamService: SupportTeamService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['firstName', 'lastName', 'vehicleSupportType', 'usid', 'employeeId', 'serviceStartDate', 'action'];
  SupportTeamMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  FilterData = {
    "firstName": "", "lastName": "", "employeeId": "",
    isdeleted: false
  };
  PageTitle = "Support Team Details";
  filterDiv: boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.SupportTeamMasterData.filter = filterValue.trim().toLowerCase();
  }
  addSupportTeam = function () {
    this.router.navigate(['/addSupportTeam']);
  }

  filterFunc = function () {
    this.filterDiv = true;
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("SUPPORTFILTERSESSION");
    this.result = false;
    this.search();
  }

  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.FilterData.confirmed = true;
    this.supportTeamService.getSupportTeamList(this.FilterData, headers).subscribe(resp => {
      debugger;

      // Set Filter
      let supportFilterSession = new SupportFilterSession();
      supportFilterSession.firstName = this.FilterData.firstName;
      supportFilterSession.lastName = this.FilterData.lastName;
      supportFilterSession.employeeId = this.FilterData.employeeId;
      sessionStorage.setItem('SUPPORTFILTERSESSION', JSON.stringify(supportFilterSession));
      this.result = !Object.values(supportFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.SupportTeamMasterData = new MatTableDataSource(resp);
      this.SupportTeamMasterData.sort = this.sort;
      this.SupportTeamMasterData.paginator = this.paginator;
      this.totalRecords = this.SupportTeamMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  deleteVehicle = function (vehicleRegNo) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = vehicleRegNo;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.supportTeamService.deleteSupportTeam(id, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Support Team deleted successfully.";
            this.search();
            // this.getActiveClassification();
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {
              })

          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }

  ngOnInit(): void {
    
    //Assign Filter
    let supportFilterSession = JSON.parse(sessionStorage.getItem('SUPPORTFILTERSESSION'));
    if (sessionStorage.getItem('SUPPORTFILTERSESSION') != null) {
      this.FilterData.firstName = supportFilterSession.firstName;
      this.FilterData.lastName = supportFilterSession.lastName;
      this.FilterData.employeeId = supportFilterSession.employeeId;
    }
    if (supportFilterSession != null) {
      this.result = !Object.values(supportFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
  }
}


