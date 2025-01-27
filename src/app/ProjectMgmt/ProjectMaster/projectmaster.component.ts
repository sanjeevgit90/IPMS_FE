import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { ProjectMasterService } from './projectmaster.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewProjectComponent } from './viewproject/viewproject.component';

@Component({
  selector: 'app-project',
  templateUrl: './projectmaster.component.html',
  providers: [ProjectMasterService, AppGlobals, DialogService, SharedService]
})
export class ProjectMasterComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private projectService: ProjectMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }

  displayedColumns: string[] = ['projectPin', 'projectName', 'clientName',
    'projectStartDate', 'projectStatus', 'approvalStatus', 'action'];
  ProjectRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  FilterData = {
    "projectType": null, "projectName": null, "clientName": null, "organization": null,
    "projectStartDate": null, "projectStopDate": null, "projectStatus": null
  };

  PageTitle = "Project List";
  filterDiv: boolean = false;
  projectId:any;

  projectMasterAdd: boolean = false;
  projectMasterEdit: boolean = false;
  projectMasterView: boolean = false;
  projectMasterDelete: boolean = false;

  addProject = function () {
    this.router.navigate(['/addProject']);
  //  this.router.navigate(['/projectDetails']);
    //this.router.navigate(['/projectConfiguration']);
  }

  itemValue: any;
  onEdit = function (rowIndex) {
    this.itemValue = rowIndex;
  }

  filterFunc = function () {
    this.getProjectType();
    this.getProgressStatus();
    this.getAllOrganizations();
    this.filterDiv = true;
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }
  projectTypeList: any = [];
  statusList: any = [];
  organizationsList: any = [];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectRecord.filter = filterValue.trim().toLowerCase();
  }

  // organizationsList
  getAllOrganizations = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getOrganizationsList(headers).subscribe(resp => {
      debugger;
      this.organizationsList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // category List

  getProjectType = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getProjectType(headers).subscribe(resp => {
      debugger;
      this.projectTypeList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // projectList
  getProgressStatus = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };

    this.sharedService.getProgressStatus(headers).subscribe(resp => {
      debugger;
      this.statusList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  search = function () {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectService.getProjectList(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.ProjectRecord = new MatTableDataSource(resp.content);
      this.ProjectRecord.sort = this.sort;
      this.ProjectRecord.paginator = this.paginator;
      this.totalRecords = this.ProjectRecord.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //delete 

  onDelete = function (name) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var experienceId = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.projectService.deleteProject(experienceId, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Project is deleted successfully.";
            this.search();
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

  saveOpenBravoId = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectService.saveOpenBravoId(this.projectId, name, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Openbravo project id is successfully updated.";
      this.search();

      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.itemValue = null;
          this.projectId = null;
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  submitForApproval = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectService.submitForApproval(name, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Project is successfully submitted for Approval.";
      this.search();
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
  viewProject = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(ViewProjectComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;

    })
  }

  ngOnInit(): void {

    //Role Rights
    this.projectMasterAdd = this._global.UserRights.includes("Project_Master_ADD");
    this.projectMasterEdit = this._global.UserRights.includes("Project_Master_EDIT");
    this.projectMasterView = this._global.UserRights.includes("Project_Master_VIEW");
    this.projectMasterDelete = this._global.UserRights.includes("Project_Master_DELETE");

    this.search();

  }



}
