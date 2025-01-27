import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { UserProfileService } from './user-profile.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { flatMap } from 'rxjs/operators';
import { ManagerUserFilterSession } from '../ConfigurationMgmtFilterData';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  providers: [UserProfileService, AppGlobals, DialogService, SharedService]
})
export class UserProfileComponent implements OnInit {
  result: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private userProfileService: UserProfileService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['firstName', 'emailId', 'address-pcol', 'employeeCode', 'action'];
  UserMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  FilterData = { "fullName": null, "employeeCode": null, "emailId": null, "mobileNumber": null, "organizations": null, "roles": null };

  PageTitle = "User List";
  filterDiv: boolean = false;

  //User Rgiht Declaration
  userEdit: boolean = false;
  userView: boolean = false;
  userAdd: boolean = false;
  userDelete: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.UserMasterData.filter = filterValue.trim().toLowerCase();
  }


  addUser = function () {
    this.router.navigate(['/registerEmployee']);
  }

  filterFunc = function () {
    this.filterDiv = true;
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("USERFILTERSESSION");
    this.result = false;
    this.search();
  }

  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.FilterData.confirmed = true;
    this.userProfileService.userList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      let userFilterSession = new ManagerUserFilterSession();
      userFilterSession.fullName = this.FilterData.fullName;
      userFilterSession.employeeCode = this.FilterData.employeeCode;
      userFilterSession.roles = this.FilterData.roles;
      userFilterSession.organizations = this.FilterData.organizations;
      userFilterSession.emailId = this.FilterData.emailId;
      userFilterSession.mobileNumber = this.FilterData.mobileNumber;
      sessionStorage.setItem('USERFILTERSESSION', JSON.stringify(userFilterSession));
      this.result = !Object.values(userFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.UserMasterData = new MatTableDataSource(resp);
      this.UserMasterData.sort = this.sort;
      this.UserMasterData.paginator = this.paginator;
      this.totalRecords = this.UserMasterData.filteredData.length;
      this.showLoading = false;

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Delete Function
  onDelete = function (id) {
    this.DeleteMsg = 'Are you sure you want to Delete this user?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.userProfileService.deleteUserById(id, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }


      })
  }

  roleList: any = [];

  organizationsList: any = [];

  // organizationsList
  getAllOrganizations = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getOrganizationsList(headers).subscribe(resp => {
      this.organizationsList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // organizationsList
  getAllRole = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getRoleList(headers).subscribe(resp => {
      this.roleList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Lock unlock Function
  lockUnlock = function (status, profileid) {
    debugger;
    if (status == 'LOCK') {
      this.DeleteMsg = 'Are you sure you want to lock this user?';
    }
    if (status == 'UNLOCK') {
      this.DeleteMsg = 'Are you sure you want to unlock this user?';
    }
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.userProfileService.getlockUnlock(status, profileid, headers).subscribe(resp => {
            debugger;
            this.successMessage = 'Successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }


      })
  }


  ngOnInit(): void {
    //Role Rights
    this.userEdit = this._global.UserRights.includes("Manage_User_EDIT");
    this.userView = this._global.UserRights.includes("Manage_User_VIEW");
    this.userDelete = this._global.UserRights.includes("Manage_User_DELETE");
    this.userAdd = this._global.UserRights.includes("Manage_User_ADD");
    this.getAllOrganizations();
    this.getAllRole();
    //Assign Filter
    let userFilterSession = JSON.parse(sessionStorage.getItem('USERFILTERSESSION'));
    if (sessionStorage.getItem('USERFILTERSESSION') != null) {
      this.FilterData.fullName = userFilterSession.fullName;
      this.FilterData.employeeCode = userFilterSession.employeeCode;
      this.FilterData.roles = userFilterSession.roles;
      this.FilterData.organizations = userFilterSession.organizations;
      this.FilterData.emailId = userFilterSession.emailId;
      this.FilterData.mobileNumber = userFilterSession.mobileNumber;
    }
    if (userFilterSession != null) {
      this.result = !Object.values(userFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
  }

}
