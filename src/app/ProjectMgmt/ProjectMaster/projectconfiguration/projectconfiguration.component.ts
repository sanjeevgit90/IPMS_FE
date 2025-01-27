import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { ProjectMasterService } from '../projectmaster.service';
import { SharedService } from '../../../service/shared.service';
import { FileuploadService } from '../../../service/fileupload.service';
import { ProjectApprovalTaskService } from '../../ProjectApproval/projectapproval.service';

@Component({
  selector: 'app-projectconfiguration',
  templateUrl: './projectconfiguration.component.html',
  providers: [ProjectMasterService, AppGlobals, DialogService, SharedService, FileuploadService, ProjectApprovalTaskService]

})
export class ProjectconfigurationComponent implements OnInit {

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
  matSelectDuration = this._global.matSelectDurationTime;
  PageTitle = "Project Configuration";
  userList: any = [];
  AlllevelList: any = [];
  levelList: any = [];
  newLevelList: any = [];
  addProjectForm: FormGroup;
  actionFlag: boolean = false; 
  backToTask: boolean = false;
  organization:any ;
  projectManager:any;
  submitToFlag: boolean = true;
  
  compareUser(o1: any, o2: any): boolean {
    return o1 == o2;
  }
  deleteLevel = function (item) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var experienceId = item.entityId;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          if (experienceId == null)
          {
            this.levelList.splice(this.levelList.indexOf(item), 1);
             return;
          }
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.projectService.deleteLevel(experienceId, headers).subscribe(resp => {
            this.showLoading = false;
            this.successMessage = "Project Configuration is deleted successfully.";
            this.levelList.splice(this.levelList.indexOf(item), 1);
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {
              })
          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }

  addMoreLevel = function () {
    debugger;
    this.item = {};
    this.item.workflowlevel = null;
    this.item.userid = null;
    this.newLevelList.push(this.item);
    this.addLevelFlag = true;
    this.getAllLevel(this.route.snapshot.params.id,'all');
    return;
  }
  addLevel = function (flag) {
    this.isSubmitted = true;
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };

    for (let i = 0; i < this.newLevelList.length; i++) {
      this.levelList.push(this.newLevelList[i])
    }

    for (let i = 0; i < this.levelList.length; i++) {
      this.temp = this.levelList[i];
      if (this.temp.workflowlevel == null) {
        this.dialogService.openConfirmDialog("Workflow id required for item " + i + 1);
        return;
      }
      if (this.temp.userid == null) {
        this.dialogService.openConfirmDialog("User is required for " + this.temp.workflowlevel);
        return;
      }
    }
var id =this.route.snapshot.params.id;
    this.showLoading = true;
    this.projectService.addLevel(this.organization,id, this.levelList, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Project Configuration is " + flag + "d successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.newLevelList = [];
          this.actionFlag = true;
          this.getAllLevel(id,'all');
        })
        //this.myStepper.next();
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  removeLevel = function (item) {
    this.newLevelList.splice(this.newLevelList.indexOf(item), 1);
    return;
  }

   // levelList
   getAllLevel = function (id, flag) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
     var project = id;
    this.projectService.getAllLevels(project, headers, flag).subscribe(resp => {
      debugger;
      if (flag =='default')
      {
        this.levelList = resp;
      }
       else
       {
        this.AlllevelList = resp;
       }
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });

  }
  back = function () {
    if (this.backToTask == true) {
      this.router.navigate(['/searchProjectTask']);
    }
    else {
      this.router.navigate(['/searchProject']);
    }
  }

  sendForApproval = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var name = this.route.snapshot.params.id;
    if (this.backToTask == false) {
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
  
  //Get Level
  getLevelsByProject = function (id) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var project = id;
    this.projectService.getLevelsByProject(project, headers).subscribe(resp => {
     var listOfLevels = resp;
      if (listOfLevels.length ==0)
      {
        this.getAllLevel(this.route.snapshot.params.id,'default');
        this.actionFlag = false;
      }
      else{
        this.actionFlag= true;
        this.levelList = resp;
      }
      this.showLoading = false;
    }, (error: any) => {
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

  editon = function (id) {
    debugger;
   
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectService.projectById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ProjectData = resp;
      this.organization= this.ProjectData.organization;
      this.projectManager = this.ProjectData.projectManager;
      if (this.ProjectData.approvalStatus!='PENDING')
      {
        this.submitToFlag = false;
      }
      
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getLevelsByProject(this.route.snapshot.params.id);
    this.addProjectForm =this.formBuilder.group({});
    if (this.route.snapshot.params.page == 'editTask') {
      this.PageTitle = "Update Project";
      this.editProject(this.route.snapshot.params.taskid);

      this.backToTask = true;
    }
    if (this.route.snapshot.params.page == 'edit') {
        this.editon(this.route.snapshot.params.id);
    }
  }

  
  get formControls() {
    return this.addProjectForm.controls;
  }

}
