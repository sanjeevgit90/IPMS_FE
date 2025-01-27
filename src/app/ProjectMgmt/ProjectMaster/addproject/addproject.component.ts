import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { ProjectMasterService } from '../projectmaster.service';
import { SharedService } from '../../../service/shared.service';
import { MatStepper } from '@angular/material/stepper';
import { FileuploadService } from '../../../service/fileupload.service';
import { ProjectApprovalTaskService } from '../../ProjectApproval/projectapproval.service';

@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  providers: [ProjectMasterService, AppGlobals, DialogService, SharedService, FileuploadService, MatStepper, ProjectApprovalTaskService]
})
export class AddProjectComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private projectService: ProjectMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private fileuploadService: FileuploadService,
    private taskService: ProjectApprovalTaskService) { }
  @ViewChild('stepper') private myStepper: MatStepper;

  showLoading: boolean = false;
  disable = false;
  showSubmit: boolean = false;
  uploadFlag: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "Add Project";
  add = true;
  edit = false;
  list = true;
  backToTask: boolean = false;

  ProjectData = {
    "projectName": null, "clientName": null, "departmentName": null, "projectLocation": null,
    "projectStopDate": null, "projectStartDate": null, "projectStatus": null,
    "remark": null, "poAttached": false, "projectPlan": false, "completionStatus": null,
    "percentageCompleted": null, "budget": null, "percentagePaymentReceived": null,
    "planAttachment": null, "poAttachment": null, "projectType": null, "projectPin": null,
    "practiceName": null, "organization": null, "entityId": null, "accountManager": null,
    "projectManager": null, "approvalStatus": null
  };

  addProjectForm: FormGroup;
  MappingForm: FormGroup;
  uploadForm: FormGroup;

  poAttachment: any = [];
  planAttachment: any = [];

  isSubmitted = false;
  completionStatusList = this._global.completionStatus;

  back = function () {
    if (this.backToTask == true) {
      debugger;
      this.router.navigate(['/searchProjectTask']);
    }
    else {
      this.router.navigate(['/searchProject']);
    }

  }

  projectTypeList: any = [];
  statusList: any = [];
  organizationsList: any = [];
  departmentList: any = [];
  userList: any = [];
  levelList: any = [];
  newLevelList: any = [];
  AlllevelList: any = [];

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
    var org = this.ProjectData.organization;
    //  var projectType = this.ProjectData.projectType;
    var projectType = '';
    if (this.ProjectData.projectType == 'P/L Projects' || this.ProjectData.projectType == 'Miscellaneous') {
      projectType = this.ProjectData.projectType;
    }
    else {
      projectType = 'ALL';
    }

    var project = this.ProjectData.entityId;
    this.projectService.getAllLevels(org, projectType, project, headers, flag).subscribe(resp => {
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


  getLevels = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var org = this.ProjectData.organization;
    //  var projectType = this.ProjectData.projectType;
    var projectType = '';
    if (this.ProjectData.projectType == 'P/L Projects' || this.ProjectData.projectType == 'Miscellaneous') {
      projectType = this.ProjectData.projectType;

    }
    else {
      projectType = 'ALL';
    }

    var project = this.ProjectData.entityId;
    this.projectService.getLevels(org, projectType, headers).subscribe(resp => {
      debugger;
      this.AlllevelList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });

  }
  isEditable: boolean = false;
  next : boolean = false;

  addProject = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addProjectForm.invalid) {
      this.dialogService.openConfirmDialog("Invalid Form Data");
      return;
    }
    this.ProjectData.projectStartDate = this.ProjectData.projectStartDate.getTime();
    this.ProjectData.projectStopDate = this.ProjectData.projectStopDate.getTime();

    const headers = { "Authorization": sessionStorage.getItem("token") };

    if (parseInt(this.ProjectData.projectStartDate) > parseInt(this.ProjectData.projectStopDate)) {
      this.dialogService.openConfirmDialog("Project Start Date should be less than Project End Date");
      return;
    }
    if (this.ProjectData.percentagePaymentReceived > this.ProjectData.percentageCompleted) {
      this.dialogService.openConfirmDialog("Percentage Payment Recieved should be less than Percentage Completed");
      return;
    }
    if (parseInt(this.ProjectData.percentagePaymentReceived) > 100) {
      this.dialogService.openConfirmDialog("Percentage Payment Recieved can't be more than 100 %");
      return;
    }
    if (parseInt(this.ProjectData.percentageCompleted) > 100) {
      this.dialogService.openConfirmDialog("Percentage Completedcan't be more than 100 %");
      return;
    }


    this.showLoading = true;
    var flagForLevel = flag
    this.projectService.saveProjectData(this.ProjectData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Project " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.ProjectData = resp;
          this.ProjectData.projectStartDate = (new Date(this.ProjectData.projectStartDate));
          this.ProjectData.projectStopDate = (new Date(this.ProjectData.projectStopDate));

          this.getAllLevel(flagForLevel);
          this.next = true;

          if (flag == 'save') {
            this.dialogService.openConfirmDialog("Next Step, Please fill Project Configuration Details below");
          }

         
          if ((this.ProjectData.poAttached != false) || (this.ProjectData.projectPlan != false)) {
            this.showUploadFlag = true;
          }
          else{
            this.router.navigate(['searchProject/updateProjectDetails', this.ProjectData.entityId, 'edit']);
          }
        })
    }, (error: any) => {
      debugger;
      this.ProjectData.projectStartDate = (new Date(this.ProjectData.projectStartDate));
      this.ProjectData.projectStopDate = (new Date(this.ProjectData.projectStopDate));
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  clearfields = function () {
    this.ProjectData = {
      "projectName": null, "clientName": null, "departmentName": null, "projectLocation": null,
      "projectStopDate": null, "projectStartDate": null, "projectStatus": null,
      "remark": null, "poAttached": false, "projectPlan": false, "completionStatus": null,
      "percentageCompleted": null, "budget": null, "percentagePaymentReceived": null,
      "planAttachment": null, "poAttachment": null, "projectType": null, "projectPin": null,
      "practiceName": null, "organization": null, "entityId": null
    };
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
      if (this.ProjectData.poAttachment != null) {
        this.poAttachment = this.fileuploadService.getSingleFileArray(this.ProjectData.poAttachment);
      }
      if (this.ProjectData.planAttachment != null) {
        this.planAttachment = this.fileuploadService.getSingleFileArray(this.ProjectData.planAttachment);
      }
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
      this.router.navigate(['/searchProject']);
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

  sendForApproval = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    if (this.backToTask == false) {
      var name = this.ProjectData.entityId;
      this.projectService.submitForApproval(name, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.successMessage = "Project is successfully submitted for Approval.";
        this.router.navigate(['/searchProject']);
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(res => {
          })
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
    else {
      this.ActionData.approvalStatus = "APPROVED";
      this.taskService.processTask(this.ActionData, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.successMessage = "Project is re-submitted successfully.";
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(res => {
            // this.addAssetForm.reset();
            this.router.navigate(['/searchProjectTask']);

          })

      }, (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });

    }


  }
  editProject = function (id) {
    debugger;
    this.dc = false;
    this.project = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.taskById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ActionData = resp;
      this.editon(this.ActionData.projectid);
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  submitUploads = function () {
    debugger;
    if (this.ProjectData.poAttached == true) {
      if (!this.fileuploadService.hasfile(this.poAttachment)) {
        this.dialogService.openConfirmDialog("Please upload PO Attachment")
        return;
      }

      //Check if all files are uploaded Successfully
      if (!this.fileuploadService.allFilesUploaded(this.poAttachment)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }

      this.ProjectData.poAttachment = this.fileuploadService.getFirstFilePath(this.poAttachment);

    }
    if (this.ProjectData.projectPlan == true) {
      //If mandatory then check for atleast one fileuploaded
      if (!this.fileuploadService.hasfile(this.planAttachment)) {
        this.dialogService.openConfirmDialog("Please upload Plan Attachment")
        return;
      }

      //Check if all files are uploaded Successfully
      if (!this.fileuploadService.allFilesUploaded(this.planAttachment)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }

      this.ProjectData.planAttachment = this.fileuploadService.getFirstFilePath(this.planAttachment);

    }
    this.uploadFlag = true;
    this.addProject('update');

  }

  ngOnInit(): void {
    this.getProjectType();
    this.getProgressStatus();
    this.getAllOrganizations();
    this.getAllDepartment();
    this.getAllUsers();

    this.addProjectForm = this.formBuilder.group({
      projectName: [null, Validators.required],
      organization: [null, Validators.required],
      departmentName: [null, Validators.required],
      clientName: [null, Validators.required],
      practiceName: [null, Validators.required],
      projectLocation: [null, Validators.required],
      projectStopDate: [null, Validators.required],
      projectStartDate: [null, Validators.required],
      projectStatus: [null, Validators.required],
      projectType: [null, Validators.required],
      percentagePaymentReceived: [null, Validators.required],
      percentageCompleted: [null, Validators.required],
      completionStatus: [null, Validators.required],
      accountManager: [null, Validators.required],
      projectManager: [null, Validators.required],
      planAttachment: [null],
      poAttachment: [null],
      poAttached: [false],
      projectPlan: [false],
      budget: [null],
      remark: [null],
      projectPin: [null]
    });

    if (this.route.snapshot.params.page == 'editTask') {
      this.PageTitle = "Update Project";
      this.editProject(this.route.snapshot.params.id);

      this.backToTask = true;
    }
    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Project";
      this.editon(this.route.snapshot.params.id);
    }


  }
  get formControls() {
    return this.addProjectForm.controls;
  }

}

