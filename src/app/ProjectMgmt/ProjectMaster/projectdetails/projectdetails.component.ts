import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { ProjectMasterService } from '../projectmaster.service';
import { SharedService } from '../../../service/shared.service';
//import { MatStepper } from '@angular/material/stepper';
import { FileuploadService } from '../../../service/fileupload.service';
import { ProjectApprovalTaskService } from '../../ProjectApproval/projectapproval.service';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  providers: [ProjectMasterService, AppGlobals, DialogService, SharedService, FileuploadService, ProjectApprovalTaskService]

})
export class ProjectdetailsComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private projectService: ProjectMasterService,
    private _global: AppGlobals,
    private dialogService: DialogService,
    private sharedService: SharedService,
    private fileuploadService: FileuploadService,
    private taskService: ProjectApprovalTaskService) {

  }

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
  addProjectForm: FormGroup;
  poAttachment: any = [];
  planAttachment: any = [];
  isSubmitted = false;
  completionStatusList = this._global.completionStatus;
  projectTypeList: any = [];
  statusList: any = [];
  organizationsList: any = [];
  departmentList: any = [];
  userList: any = [];
  
  addLevelFlag: boolean = false;
  showUploadFlag: boolean = false;
  ProjectData = {
    "projectName": null, "clientName": null, "departmentName": null, "projectLocation": null,
    "projectStopDate": null, "projectStartDate": null, "projectStatus": null,
    "remark": null, "poAttached": false, "projectPlan": false, "completionStatus": null,
    "percentageCompleted": null, "budget": null, "percentagePaymentReceived": null,
    "planAttachment": null, "poAttachment": null, "projectType": null, "projectPin": null,
    "practiceName": null, "organization": null, "entityId": null, "accountManager": null,
    "projectManager": null, "approvalStatus": null
  };

  back = function () {
    if (this.backToTask == true) {
      this.router.navigate(['/searchProjectTask']);
    }
    else {
      this.router.navigate(['/searchProject']);
    }
  }
  //Get Project Type
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
  // Get Organizations List
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

  //Get Department List
  getAllDepartment = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDepartmentList(headers).subscribe(resp => {
      this.departmentList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

   // userList
   getAllUsers = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveUserList(headers).subscribe(resp => {
      this.userList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //Status List
  getProgressStatus = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getProgressStatus(headers).subscribe(resp => {
      this.statusList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

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
      this.showLoading = false;
      this.successMessage = "Project " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.ProjectData = resp;
          this.ProjectData.projectStartDate = (new Date(this.ProjectData.projectStartDate));
          this.ProjectData.projectStopDate = (new Date(this.ProjectData.projectStopDate));
          // this.getAllLevel(flagForLevel);
          // this.next = true;
        
          this.router.navigate(['searchProject/updateProjectDetails', this.ProjectData.entityId, 'edit']);
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
  sendForApproval = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    if (this.backToTask == false) {
      var name = this.ProjectData.entityId;
      this.projectService.submitForApproval(name, headers).subscribe(resp => {
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
        this.showLoading = false;
        this.successMessage = "Project is re-submitted successfully.";
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(res => {
            this.router.navigate(['/searchProjectTask']);
          })
      }, (error: any) => {
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });

    }
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1.name == o2.name && o1.id == o2.id;
  }
  compareUser(o1: any, o2: any): boolean {
    return o1 == o2;
  }
  
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
    this.getAllOrganizations();
    this.getAllDepartment();
    this.getAllUsers();
    this.getProgressStatus();
    this.addProjectForm = this.formBuilder.group({
      projectName: [null, Validators.required],
      organization: [null, Validators.required],
      departmentName: [null, Validators.required],
      clientName: [null, Validators.required],
      practiceName: [null, Validators.required],
      projectLocation: [null, Validators.required],
      projectStopDate: [null, Validators.required],
      projectStartDate: [null, Validators.required],
      projectStatus: [null],
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
      this.editProject(this.route.snapshot.params.taskid);

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
