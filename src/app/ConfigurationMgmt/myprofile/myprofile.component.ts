import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { MyprofileService } from './myprofile.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  providers: [MyprofileService, AppGlobals, DialogService, SharedService]

})
export class MyprofileComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private myprofileService: MyprofileService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['projectname', 'orgname', 'workflowlevel'];

  PageTitle = "Profile";
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  profileEdit: boolean = false;
  userProjectMapping: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  ProfileData = {
    "firstName": null, "lastName": null, "designation": null,
    "department": null, "employeeCode": null, "doj": null, "mobileNumber": null,
    "emailId": null, "dob": null, "address": null, "district": null,
    "state": null, "gender": null, "manager": { "firstName": null, "lastName": null },
    "roles": [{ "rolename": null }], "organizations": [{ "orgName": null }], "entityId": null,
    "bloodGroup": null, "emergencyContactPerson": null, "emergencyContactMobile": null,
    "profileImage": null
  };
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userProjectMapping.filter = filterValue.trim().toLowerCase();
    this.totalRecords = this.userProjectMapping.filteredData.length > 0 ? this.userProjectMapping.filteredData.length : 0;
  }

  back = function () {
    this.router.navigate(['/searchUsers']);
  }

  // Search function
  search = function (id) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.myprofileService.getProfile(id, headers).subscribe(resp => {
      this.ProfileData = resp;
      this.showLoading = false;
      this.userProjectList(this.ProfileData.entityId);
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Project Mapping function
  userProjectList = function (id) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    let myproject = {};
    this.myprofileService.getProjectLevelList(myproject, headers, id).subscribe(resp => {
      this.showLoading = false;
      this.userProjectMapping = new MatTableDataSource(resp.content);
      this.totalRecords = this.userProjectMapping.filteredData.length > 0 ? this.userProjectMapping.filteredData.length : 0;
      this.userProjectMapping.sort = this.sort;
      this.userProjectMapping.paginator = this.paginator;

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  adminEdit: boolean = false;

  ngOnInit(): void {

    //Role Rights
    //this.profileEdit = this._global.UserRights.includes("My Profile_EDIT");
    if (!this.route.snapshot.params.hasOwnProperty("id")) {
      this.profileEdit = true;
      this.PageTitle = "Update User";
      this.search(null);
    } else {
      this.PageTitle = "Update User";
      this.adminEdit = true;
      this.search(this.route.snapshot.params.id);
    }



  }

}
