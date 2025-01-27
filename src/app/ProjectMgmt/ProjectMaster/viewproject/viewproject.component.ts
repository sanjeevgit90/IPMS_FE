import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { ProjectMasterService } from '../projectmaster.service';
import { SharedService } from '../../../service/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-viewproject',
  templateUrl: './viewproject.component.html',
  providers: [ProjectMasterService, AppGlobals, DialogService, SharedService]
})
export class ViewProjectComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private projectService: ProjectMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }



  showLoading: boolean = false;
  disable = false;
  showSubmit: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  url = null;
  taskBackflag: boolean = false;

  PageTitle = "Add Project";
  add = true;
  edit = false;
  list = true;

  ProjectData = {
    "projectName": null, "clientName": null, "departmentName": null, "projectLocation": null,
    "projectStopDate": null, "projectStartDate": null, "projectStatus": null,
    "remark": null, "poAttached": false, "projectPlan": false, "completionStatus": null,
    "percentageCompleted": null, "budget": null, "percentagePaymentReceived": null,
    "planAttachment": null, "poAttachment": null, "projectType": null, "projectPin": null,
    "practiceName": null, "organization": null, "entityId": null, "accountManager": null,
    "projectManager": null, "approvalStatus": null, "isDeleted": null
  };

  addProjectForm: FormGroup;
  MappingForm: FormGroup;
  uploadForm: FormGroup;

  poAttachment: any = [];
  planAttachment: any = [];

  isSubmitted = false;
  completionStatusList = this._global.completionStatus;

  back = function () {
    if (this.taskBackflag == false) {
      this.router.navigate(['/searchProject']);
    }
    else {
      this.router.navigate(['/searchProjectTask']);
    }

  }

  projectTypeList: any = [];
  statusList: any = [];
  organizationsList: any = [];
  departmentList: any = [];
  userList: any = [];
  levelList: any = [];
  newLevelList: any = [];
  taskHistoryList: any = [];

  addLevelFlag: boolean = false;

  showUploadFlag: boolean = false;

  compareObjects(o1: any, o2: any): boolean {
    debugger;
    return o1.name == o2.name && o1.id == o2.id;
  }

  compareUser(o1: any, o2: any): boolean {
    debugger;
    return o1 == o2;
  }

  getUserName(o1: any): boolean {
    debugger;
    for (let i = 0; i < this.userList.length; i++) {

      if (o1 == this.userList[i].selectionid) {
        return true;
      }
    }
    return false;
  }


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

  // organizationsList
  getAllDepartment = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDepartmentList(headers).subscribe(resp => {
      debugger;
      this.departmentList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // userList
  getAllUsers = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveUserList(headers).subscribe(resp => {
      debugger;
      this.userList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // levelList
  getAllLevel = function (flag) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    //  var projectType = this.ProjectData.projectType;
    var project = this.ProjectData.entityId;
    this.projectService.getLevelsByProject(project, headers).subscribe(resp => {
      debugger;
      this.levelList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  // Edit

  editon = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectService.projectById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ProjectData = resp;
      this.ProjectData.projectStartDate = (new Date(this.ProjectData.projectStartDate));
      this.ProjectData.projectStopDate = (new Date(this.ProjectData.projectStopDate));
      this.getAllLevel('update');
      this.getHistoryDataById(this.ProjectData.entityId);
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
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

  getHistoryDataById = function (entityId) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectService.getHistoryDataById(entityId, headers).subscribe(resp => {
      debugger;
      this.taskHistoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  sendForApproval = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var name = this.ProjectData.entityId;
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
  disableFields = function () {
    this.addProjectForm.get('projectName').disable();
    this.addProjectForm.get('user').disable();
    this.addProjectForm.get('organization').disable();
    this.addProjectForm.get('departmentName').disable();
    this.addProjectForm.get('clientName').disable();
    this.addProjectForm.get('practiceName').disable();
    this.addProjectForm.get('projectLocation').disable();
    this.addProjectForm.get('projectStopDate').disable();
    this.addProjectForm.get('projectStartDate').disable();
    this.addProjectForm.get('projectStatus').disable();
    this.addProjectForm.get('projectType').disable();
    this.addProjectForm.get('percentagePaymentReceived').disable();
    this.addProjectForm.get('percentageCompleted').disable();
    this.addProjectForm.get('completionStatus').disable();
    this.addProjectForm.get('accountManager').disable();
    this.addProjectForm.get('projectManager').disable();
    this.addProjectForm.get('poAttached').disable();
    this.addProjectForm.get('projectPlan').disable();
    this.addProjectForm.get('budget').disable();
    this.addProjectForm.get('remark').disable();
    this.addProjectForm.get('projectPin').disable();
  }

  ngOnInit(): void {
    this.getProjectType();
    this.getProgressStatus();
    this.getAllOrganizations();
    this.getAllDepartment();
    this.getAllUsers();

    this.addProjectForm = this.formBuilder.group({
      projectName: [null],
      organization: [null],
      departmentName: [null],
      clientName: [null],
      practiceName: [null],
      projectLocation: [null],
      projectStopDate: [null],
      projectStartDate: [null],
      projectStatus: [null],
      projectType: [null],
      percentagePaymentReceived: [null],
      percentageCompleted: [null],
      completionStatus: [null],
      accountManager: [null],
      projectManager: [null],
      planAttachment: [null],
      poAttachment: [null],
      poAttached: [false],
      projectPlan: [false],
      budget: [null],
      remark: [null],
      projectPin: [null],
      user: [null]
    });

    if (this.route.snapshot.params.page == 'view') {
      this.taskBackflag = false;
    }
    if (this.route.snapshot.params.page == 'viewTask') {
      this.taskBackflag = true;
    }
    this.PageTitle = "View Project";
    this.editon(this.route.snapshot.params.id);
    this.disableFields();

    this.url = this._global.baseUrl;

  }
  get formControls() {
    return this.addProjectForm.controls;
  }


}

