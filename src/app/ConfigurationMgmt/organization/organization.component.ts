import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { OrganizationService } from './organization.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  providers: [OrganizationService, AppGlobals, DialogService, SharedService]

})
export class OrganizationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private organizationService: OrganizationService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['orgName', 'orgCountry', 'orgPan', 'orgTan', 'orgDirectors', 'orgRegAddress', 'action'];

  OrgMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Organization Master";
  add = true;
  edit = false;
  list = true;

  orgEdit: boolean = false;
  orgDelete: boolean = false;
  orgAdd: boolean = false;


  OrganizationData = {
    "orgName": "", "orgCountry": "", "orgDirectors": "", "orgPan": "",
    "orgTan": "", "orgRegAddress": ""
  };
  addOrganizationForm: FormGroup;
  isSubmitted = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.OrgMasterData.filter = filterValue.trim().toLowerCase();
  }

  cancel = function () {
    this.list = true;
    this.edit = false;
    //this.OrganizationData = {};
    this.formDirective.resetForm();
    this.isSubmitted = false;
    this.PageTitle = "Organization Master";
  }

  // Add / update function
  addOrganization = function (flag) {
    this.isSubmitted = true;
    if (this.addOrganizationForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.organizationService.saveOrganization(this.OrganizationData, headers, flag).subscribe(resp => {
      this.showLoading = false;
      this.successMessage = "Organization " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.OrganizationData = {};
          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Organization Master";
          }
        })

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Search function
  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.organizationService.getOrganizationList(headers).subscribe(resp => {
      this.OrgMasterData = new MatTableDataSource(resp);
      this.OrgMasterData.sort = this.sort;
      this.OrgMasterData.paginator = this.paginator;
      this.totalRecords = this.OrgMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get data by id
  editon = function (id) {
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var orgId = id;
    this.PageTitle = "Update Organization";
    this.organizationService.OrgById(orgId, headers).subscribe(resp => {
      this.showLoading = false;
      this.OrganizationData = resp;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // Delete Function
  onDelete = function (id) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.organizationService.deleteOrgById(id, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.formDirective.resetForm();
            this.isSubmitted = false;
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



  ngOnInit(): void {


    //Role Rights
    this.orgEdit = this._global.UserRights.includes("Organization_Master_EDIT");
    this.orgDelete = this._global.UserRights.includes("Organization_Master_DELETE");
    this.orgAdd = this._global.UserRights.includes("Organization_Master_ADD");


    this.addOrganizationForm = this.formBuilder.group({
      orgName: ['', Validators.required],
      orgCountry: ['', Validators.required],
      orgDirectors: ['', Validators.required],
      orgPan: ['', Validators.required],
      orgTan: ['', Validators.required],
      orgRegAddress: ['', Validators.required]
    });
    this.search();
  }
  get formControls() { return this.addOrganizationForm.controls; }
}
