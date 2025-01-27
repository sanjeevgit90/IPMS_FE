import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { TicketMasterService } from '../ticket-master.service';
import { TicketTaskService } from '../ticket-task/ticket-task.service';
import { LocationService } from '../../../UniqueSiteId/location/location.service';
import { FileuploadService } from '../../../service/fileupload.service';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  providers: [TicketMasterService, AppGlobals, DialogService, SharedService, FileuploadService, TicketTaskService, LocationService]
})
export class AddTicketComponent implements OnInit {


  maxDateDisabled: string;
   
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketMasterService: TicketMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private fileuploadService: FileuploadService,
    private taskService: TicketTaskService, private locationService: LocationService) { }

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  showLoading: boolean = false;
  BackToTask: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  PageTitle = "Ticket Master";
  add = true;
  edit = false;
  view = false;
  TicketData = {
    "ticketNo": "", "otherProblemDescription": "", "accountName": null, "district": "", "state": "", "location": "",
    "category": "", "subCategory": "", "description": null, "attachment": "", "ticketOwner": null,
    "ticketType": "", "ticketTitle": "", "contactName": "", "channel": "", "email": "", "phone": "",
    "dueDate": "", "resolutionDate": "", "assignTo": null, "assetid": null, "ticketStatus": null, "ticketClosedTime": "",
    "classifications": null, "department": null, "ticketCategory": null, "ticketSubcategory": null, "resolution": "", "priority": null
  };
  state = null;
  contactEmail = null;
  assettag = null;
  ticketAttachment: any = [];
  stateList: any = [];
  districtList: any = [];
  locationList: any = [];
  assetList: any = [];
  assetTagList: any = [];
  taskHistoryList: any = [];
  classifications: any = [];
  departmentList: any = [];
  projectList: any = [];
  problemReportList: any = [];
  classificationList: any = [];
  userList: any = [];

  emailAndPhone = {};
  mobileNo: String = '';
  ticketCategoryList: any = [];
  subCategoryList: any = [];
  BackToMis: boolean = false;
  BackToSla: boolean = false;
  BackToInc: boolean = false;
  BackToAge: boolean = false;
  BackToEsc: boolean = false;

  addTicketMasterForm: FormGroup;
  isSubmitted = false;

  back = function () {
    debugger;
    if (this.BackToTask == true) {
      this.router.navigate(['/searchTicketAction']);
    }
    else if (this.BackToAge == true) {
      this.router.navigate(['/AgingReport']);
    }
    else if (this.BackToEsc == true) {
      this.router.navigate(['/TicketEscalationReport']);
    }
    else if (this.BackToInc == true) {
      this.router.navigate(['/TicketIncidentReport']);
    }
    else if (this.BackToSla == true) {
      this.router.navigate(['/TicketSLAReport']);
    }
    else if (this.BackToMis == true) {
      this.router.navigate(['/AllTicketReport']);
    }
    else {
      this.router.navigate(['/searchTicket']);
    }
  }

  getAllState = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getStateList(headers).subscribe(resp => {
      this.stateList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // districtL List
  getAllDistrictByState = function (stateName) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDistrictList(headers, stateName).subscribe(resp => {
      this.districtList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getActiveLocationsFromDistrict = function (district) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveLocationsFromDistrict(headers, district).subscribe(resp => {
      this.locationList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  onLocation = function (location) {
    this.getAssetByLocation(location);
  }

  getAssetByLocation = function (location) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getAssetByLocation(headers, location).subscribe(resp => {
      this.assetList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAllDepartment = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDepartmentList(headers).subscribe(resp => {
      this.departmentList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //get all project list
  getProjectList = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      this.projectList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getDataByProject = function (project) {
    this.getClassificationByProject(project);
    this.getProblemByProject(project);
  }

  getClassificationByProject = function (project) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketMasterService.getClassificationByProject(headers, project).subscribe(resp => {
      debugger;
      this.classificationList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getProblemByProject = function (project) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketMasterService.getProblemByProject(headers, project).subscribe(resp => {
      debugger;
      this.problemReportList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //get all profile list
  getAllUser = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveUserList(headers).subscribe(resp => {
      this.userList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getEmailByAssignName = function (id) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getEmailByUserProfielName(headers, id).subscribe(resp => {
      this.emailAndPhone = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getMobileNoByUserProfile = function (name) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getMobileNoByUserProfile(headers, name).subscribe(resp => {
      this.mobileNo = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAllCategory = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveCategoryList(headers).subscribe(resp => {
      this.ticketCategoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAllSubcategoryByCategory = function (name) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketMasterService.getSubcategoryByCategory(headers, name).subscribe(resp => {
      this.subCategoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAssetById = function (id) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getAssetById(headers, id).subscribe(resp => {
      this.showLoading = false;
      this.asset = resp;
      this.TicketData.category = this.asset.category;
      this.TicketData.subCategory = this.asset.subcategory;
      this.assettag = this.asset.assettag;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getUserProfileById = function (id) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getUserProfileById(headers, id).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.userProfileList = resp;
      this.contactEmail = this.userProfileList.emailId;
      this.mobileNo = this.userProfileList.mobileNumber;

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  location = {};
  getLocationById = function (id) {
    //  debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.locationService.findlocationById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.location = resp;
      this.state = this.location.state;
      this.getAllDistrictByState(this.state);
      this.getActiveLocationsFromDistrict(this.TicketData.district);

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  ticketClosedTime = null;
  generateCloseTime = function (time) {
    debugger;
    this.TicketData.ticketClosedTime = time;
  }

  TicketDate = function () {
    if (this.TicketData.ticketStatus == "CLOSED") {
      this.addTicketMasterForm.get('ticketClosedTime').enable();
      let localdate = new Date();
      let newDate = localdate.getFullYear() + "-" + (localdate.getMonth() + 1).toString().padStart(2, '0') + "-" + localdate.getDate().toString().padStart(2, '0') + "T" + localdate.getHours().toString().padStart(2, '0') + ":" + localdate.getMinutes().toString().padStart(2, '0')
      this.ticketClosedTime = this.getFormattedDate(newDate);
    }
    else {
      this.addTicketMasterForm.get('ticketClosedTime').disable();
      this.TicketData.ticketClosedTime = "";
    }
  }

  problemChange() {
    this.addTicketMasterForm.get('otherProblemDescription').disable();
    if (this.TicketData.description != 'Other') {
      this.addTicketMasterForm.get('otherProblemDescription').disable();
    }
    else {
      if (this.view == false) {
        this.addTicketMasterForm.get('otherProblemDescription').enable();
      }
    }
  }

  classificationsChange(obj) {
    debugger;
    let temp: any = [];
    for (let i = 0; i < obj.length; i++) {
      if (i == 0) {
        temp = obj[i];
      }
      else {
        temp = temp + "," + obj[i];
      }
    }
    this.TicketData.classifications = temp;
  }

  // Add / update function
  addTicket = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addTicketMasterForm.invalid) {
      return;
    }
    if (this.classifications.length != 0) {
      this.classificationsChange(this.classifications);
    }
    if (this.TicketData.ticketStatus == 'OPEN') {
      if (this.TicketData.assignTo == null) {
        this.dialogService.openConfirmDialog("Assigned to is required")
        return;
      }
    }

    //Check if all files are uploaded Successfully
    if (this.ticketAttachment.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.ticketAttachment)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.TicketData.attachment = this.fileuploadService.getFirstFilePath(this.ticketAttachment);
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };

    let duedate = new Date(this.TicketData.dueDate);
    let resDate = new Date(this.TicketData.resolutionDate);
    let currentDate = new Date ();
    if (this.TicketData.ticketClosedTime != null) {
      if (this.TicketData.ticketClosedTime != "") {
        let closetime = new Date(this.TicketData.ticketClosedTime);

        if (duedate.getTime() > closetime.getTime()) {
          this.dialogService.openConfirmDialog("Ticket Created Date Time should be less than Ticket Closed Date Time ");
          return;
        }

        if (duedate.getTime() > currentDate.getTime()) {
          this.dialogService.openConfirmDialog("Ticket Created Date Time should be less than Current Date Time ");
          return;
        }
        if (closetime.getTime() > currentDate.getTime()) {
          this.dialogService.openConfirmDialog("Ticket Closed Date Time should be less than Current Date Time ");
          return;
        }
        this.TicketData.ticketClosedTime = closetime.getTime();
      }
    }
    this.TicketData.dueDate = duedate.getTime();
    this.TicketData.resolutionDate = resDate.getTime();


    if (this.TicketData.ticketStatus == 'CLOSED') {
      if (this.TicketData.ticketClosedTime > this.TicketData.resolutionDate) {
        this.dialogService.openConfirmDialog("Ticket Closed Date Time is greater than SLA Resolution Date Time. Do you want to proceed.?")
          .afterClosed().subscribe(res => {
            debugger;
            if (res) {
              this.showLoading = true;
              this.ticketMasterService.saveTicket(this.TicketData, headers, flag).subscribe(resp => {
                debugger;
                this.showLoading = false;
                this.successMessage = "Ticket " + flag + " successfully.";
                this.dialogService.openConfirmDialog(this.successMessage)
                  .afterClosed().subscribe(res => {
                    this.formDirective.resetForm();
                    this.isSubmitted = false;
                    this.router.navigate(['/searchTicket']);
                    if (flag == "update") {
                      this.edit = false;
                      this.list = true;
                    }
                  })
              }, (error: any) => {
                debugger;
                this.showLoading = false;
                this.TicketData.dueDate = (new Date(this.TicketData.dueDate));
                this.TicketData.resolutionDate = (new Date(this.TicketData.resolutionDate));
                this.TicketData.ticketClosedTime = (new Date(this.TicketData.ticketClosedTime));
                const errStr = error.error.errorDetail[0];
                this.dialogService.openConfirmDialog(errStr)
              });
            } else {
              this.TicketData.dueDate = null;
              this.TicketData.resolutionDate = null;
              this.TicketData.ticketClosedTime = null;
            }
          })
      } else {
        this.showLoading = true;
        this.ticketMasterService.saveTicket(this.TicketData, headers, flag).subscribe(resp => {
          debugger;
          this.showLoading = false;
          this.successMessage = "Ticket " + flag + " successfully.";
          this.dialogService.openConfirmDialog(this.successMessage)
            .afterClosed().subscribe(res => {
              this.formDirective.resetForm();
              this.isSubmitted = false;
              this.router.navigate(['/searchTicket']);
              if (flag == "update") {
                this.edit = false;
                this.list = true;
              }
            })
        }, (error: any) => {
          debugger;
          this.showLoading = false;
          this.TicketData.dueDate = (new Date(this.TicketData.dueDate));
          this.TicketData.resolutionDate = (new Date(this.TicketData.resolutionDate));
          this.TicketData.ticketClosedTime = (new Date(this.TicketData.ticketClosedTime));
          const errStr = error.error.errorDetail[0];
          this.dialogService.openConfirmDialog(errStr)
        });
      }
    }
    else {
      this.showLoading = true;
      this.ticketMasterService.saveTicket(this.TicketData, headers, flag).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.successMessage = "Ticket " + flag + " successfully.";
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(res => {
            this.formDirective.resetForm();
            this.isSubmitted = false;
            this.router.navigate(['/searchTicket']);
            if (flag == "update") {
              this.edit = false;
              this.list = true;
            }
          })
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        this.TicketData.dueDate = (new Date(this.TicketData.dueDate));
        this.TicketData.resolutionDate = (new Date(this.TicketData.resolutionDate));
        this.TicketData.ticketClosedTime = (new Date(this.TicketData.ticketClosedTime));
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  }

  saveAsDraft = function () {
    debugger;
    this.isSubmitted = true;
    if (this.addTicketMasterForm.invalid) {
      return;
    }
    if (this.classifications.length != 0) {
      this.classificationsChange(this.classifications);
    }

    //Check if all files are uploaded Successfully
    if (this.ticketAttachment.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.ticketAttachment)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.TicketData.attachment = this.fileuploadService.getFirstFilePath(this.ticketAttachment);
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };

    let duedate = new Date(this.TicketData.dueDate);
    let resDate = new Date(this.TicketData.resolutionDate);
    let currentDate = new Date();
    if (this.TicketData.ticketClosedTime != null) {
      if (this.TicketData.ticketClosedTime != "") {
        let closetime = new Date(this.TicketData.ticketClosedTime);

        if (duedate.getTime() > closetime.getTime()) {
          this.dialogService.openConfirmDialog("Ticket Created Date Time should be less than Ticket Closed Date Time ");
          return;
        }
        if (duedate.getTime() > currentDate.getTime()) {
          this.dialogService.openConfirmDialog("Ticket Created Date Time should be less than Current Date Time ");
          return;
        }
        if (closetime.getTime() > currentDate.getTime()) {
          this.dialogService.openConfirmDialog("Ticket Closed Date Time should be less than Current Date Time ");
          return;
        }
        this.TicketData.ticketClosedTime = closetime.getTime();
      }
    }
    this.TicketData.dueDate = duedate.getTime();
    this.TicketData.resolutionDate = resDate.getTime();

    this.showLoading = true;
    this.ticketMasterService.saveAsDraft(this.TicketData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Ticket saved as draft successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addTicketMasterForm.reset();
          this.TicketData = {};
          //this.search();
          this.router.navigate(['/searchTicket']);
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.TicketData.dueDate = (new Date(this.TicketData.dueDate));
      this.TicketData.resolutionDate = (new Date(this.TicketData.resolutionDate));
      this.TicketData.ticketClosedTime = (new Date(this.TicketData.ticketClosedTime));
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  updateTicketData = function () {
    debugger;
    this.isSubmitted = true;
    if (this.addTicketMasterForm.invalid) {
      return;
    }
    if (this.classifications.length != 0) {
      this.classificationsChange(this.classifications);
    }

    //Check if all files are uploaded Successfully
    if (this.ticketAttachment.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.ticketAttachment)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.TicketData.attachment = this.fileuploadService.getFirstFilePath(this.ticketAttachment);
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    let duedate = new Date(this.TicketData.dueDate);
    let resDate = new Date(this.TicketData.resolutionDate);
    if (this.TicketData.ticketClosedTime != null) {
      if (this.TicketData.ticketClosedTime != "") {
        let closetime = new Date(this.TicketData.ticketClosedTime);

        if (duedate.getTime() > closetime.getTime()) {
          this.dialogService.openConfirmDialog("Ticket Created Date Time should be less than Ticket Closed Date Time ");
          return;
        }
        this.TicketData.ticketClosedTime = closetime.getTime();
      }
    }
    this.TicketData.dueDate = duedate.getTime();
    this.TicketData.resolutionDate = resDate.getTime();


    this.showLoading = true;
    this.ticketMasterService.updateTicketData(this.TicketData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Ticket updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addTicketMasterForm.reset();
          this.TicketData = {};
          this.router.navigate(['/searchTicket']);
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.TicketData.dueDate = (new Date(this.TicketData.dueDate));
      this.TicketData.resolutionDate = (new Date(this.TicketData.resolutionDate));
      this.TicketData.ticketClosedTime = (new Date(this.TicketData.ticketClosedTime));
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  generateSLADateTime = function () {
    debugger
    let createdDate = this.TicketData.dueDate;
    this.TicketData.resolutionDate = new Date(createdDate);
    this.TicketData.resolutionDate.setHours(this.TicketData.resolutionDate.getHours() + 4);
  }

  closedFlag: Boolean = false;
  draftFlag: Boolean = true;

  // Get data by id
  editon = function (entityId, flag) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var entityId = entityId;
    this.PageTitle = "Update Ticket Master";
    this.ticketMasterService.ticketById(entityId, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TicketData = resp;

      if (this.TicketData.ticketStatus != 'DRAFT') {
        this.draftFlag = false;
      }

      if (this.TicketData.ticketStatus != 'CLOSED') {
        this.closedFlag = true;
      }
      // this.TicketData.dueDate = (new Date(this.TicketData.dueDate));
      let createdDate = this.TicketData.dueDate;
      this.TicketData.dueDate = this.getFormattedDate(createdDate);
      //.slice(0, 16);
      if (this.TicketData.ticketClosedTime > 0) {
        let ticketClosedTime = this.TicketData.ticketClosedTime;
        this.TicketData.ticketClosedTime = this.getFormattedDate(ticketClosedTime);
      }
      else {
        this.TicketData.ticketClosedTime = null;
      }

      this.TicketData.resolutionDate = (new Date(this.TicketData.resolutionDate));
      // this.TicketData.ticketClosedTime = (new Date(this.TicketData.ticketClosedTime));
      this.getLocationById(this.TicketData.location);
      this.getAssetByLocation(this.TicketData.location);
      this.getAssetById(this.TicketData.assetid);
      this.getProblemByProject(this.TicketData.accountName);
      this.getUserProfileById(this.TicketData.assignTo);
      this.getAllSubcategoryByCategory(this.TicketData.ticketCategory);
      this.getClassificationByProject(this.TicketData.accountName);
      this.problemChange();
      if (this.TicketData.classifications != null) {
        debugger;
        let classificationTemp = [];
        var splitted = this.TicketData.classifications.split(",");
        this.classifications = splitted;

      }
      if (this.TicketData.attachment != null) {
        this.ticketAttachment = this.fileuploadService.getSingleFileArray(this.TicketData.attachment);
      }
      //this.getEmailByAssignName(this.TicketData.assignName)
      //this.getMobileNoByUserProfile(this.TicketData.assignName)
      if (flag == 'edit') {
        this.edit = true;
        this.view = false;
      }
      else {
        this.edit = false;
        this.view = true;

        this.getHistoryDataById(this.TicketData.ticketNo);
      }


    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getFormattedDate(datemilli) {
    debugger;
    let localdate = new Date(datemilli);
    return localdate.getFullYear() + "-" + (localdate.getMonth() + 1).toString().padStart(2, '0') + "-" + localdate.getDate().toString().padStart(2, '0') + "T" + localdate.getHours().toString().padStart(2, '0') + ":" + localdate.getMinutes().toString().padStart(2, '0')
  }

  maxDateMethod() {
    let maxDate: string = new Date().toISOString();
    this.maxDateDisabled = this.getFormattedDate(maxDate);
    return;
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name == o2.name && o1.id == o2.id;
  }

  compareUser(o1: any, o2: any): boolean {
    return o1 == o2;
  }

  getHistoryDataById = function (entityId) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.taskService.getHistoryDataById(entityId, headers).subscribe(resp => {
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



  disableFields = function () {

    this.addTicketMasterForm.get('otherProblemDescription').disable();
    this.addTicketMasterForm.get('accountName').disable();
    this.addTicketMasterForm.get('state').disable();
    this.addTicketMasterForm.get('district').disable();
    this.addTicketMasterForm.get('location').disable();
    this.addTicketMasterForm.get('assetid').disable();
    this.addTicketMasterForm.get('assettag').disable();
    this.addTicketMasterForm.get('category').disable();
    this.addTicketMasterForm.get('subCategory').disable();
    this.addTicketMasterForm.get('description').disable();
    this.addTicketMasterForm.get('attachment').disable();
    this.addTicketMasterForm.get('ticketOwner').disable();
    this.addTicketMasterForm.get('ticketType').disable();
    this.addTicketMasterForm.get('ticketTitle').disable();
    this.addTicketMasterForm.get('contactName').disable();
    this.addTicketMasterForm.get('channel').disable();
    this.addTicketMasterForm.get('email').disable();
    this.addTicketMasterForm.get('phone').disable();
    this.addTicketMasterForm.get('dueDate').disable();
    this.addTicketMasterForm.get('resolutionDate').disable();
    this.addTicketMasterForm.get('assignName').disable();
    this.addTicketMasterForm.get('contactEmail').disable();
    this.addTicketMasterForm.get('mobileNo').disable();
    this.addTicketMasterForm.get('ticketStatus').disable();
    this.addTicketMasterForm.get('ticketClosedTime').disable();
    this.addTicketMasterForm.get('ticketCategory').disable();
    this.addTicketMasterForm.get('ticketSubcategory').disable();
    this.addTicketMasterForm.get('department').disable();
    this.addTicketMasterForm.get('classifications').disable();
    this.addTicketMasterForm.get('resolution').disable();
    this.addTicketMasterForm.get('ticketNo').disable();
    this.addTicketMasterForm.get('priority').disable();
  }

  url: string = null;
  hasRole: Boolean = false;

  ngOnInit(): void {
    this.maxDateMethod();
    this.getAllState();
    this.getAllDepartment();
    this.getProjectList();
    //this.getAllProblemList();
    //this.getAllClassificationList();
    this.getAllUser();
    this.getAllCategory();

    this.addTicketMasterForm = this.formBuilder.group({
      ticketNo: [''],
      otherProblemDescription: ['', Validators.required],
      accountName: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      location: ['', Validators.required],
      assetid: [null, Validators.required],
      assettag: [''],
      category: [''],
      subCategory: [''],
      description: ['', Validators.required],
      attachment: [''],
      ticketOwner: ['', Validators.required],
      ticketType: ['', Validators.required],
      ticketTitle: ['', Validators.required],
      contactName: ['', Validators.required],
      channel: ['', Validators.required],
      email: [''],
      phone: [''],
      dueDate: ['', Validators.required],
      resolutionDate: ['', Validators.required],
      assignName: [''],
      contactEmail: [''],
      mobileNo: [''],
      ticketStatus: [''],
      ticketClosedTime: [''],
      ticketCategory: ['', Validators.required],
      ticketSubcategory: ['', Validators.required],
      department: [''],
      classifications: [null],
      resolution: ['', Validators.required],
      priority: [''],

    });
    this.addTicketMasterForm.get('resolutionDate').disable();
    this.addTicketMasterForm.get('otherProblemDescription').disable();

    this.hasRole = this._global.UserRights.includes("ROLE_CHM");

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Ticket";
      this.editon(this.route.snapshot.params.id, 'edit');
    }
    if (this.route.snapshot.params.page == 'view') {
      this.PageTitle = "View Ticket";
      this.editon(this.route.snapshot.params.id, 'view');
      this.disableFields();
    }
    if (this.route.snapshot.params.page == 'viewTask') {
      this.PageTitle = "View Ticket";
      this.editon(this.route.snapshot.params.id, 'view');
      this.disableFields();
      this.BackToTask = true;
    }
    if (this.route.snapshot.params.page == 'slaView') {
      this.PageTitle = "View Ticket";
      this.editon(this.route.snapshot.params.id, 'view');
      this.disableFields();
      this.BackToSla = true;
    }
    if (this.route.snapshot.params.page == 'incView') {
      this.PageTitle = "View Ticket";
      this.editon(this.route.snapshot.params.id, 'view');
      this.disableFields();
      this.BackToInc = true;
    }
    if (this.route.snapshot.params.page == 'escView') {
      this.PageTitle = "View Ticket";
      this.editon(this.route.snapshot.params.id, 'view');
      this.disableFields();
      this.BackToEsc = true;
    }
    if (this.route.snapshot.params.page == 'ageView') {
      this.PageTitle = "View Ticket";
      this.editon(this.route.snapshot.params.id, 'view');
      this.disableFields();
      this.BackToAge = true;
    }
    if (this.route.snapshot.params.page == 'misView') {
      this.PageTitle = "View Ticket";
      this.editon(this.route.snapshot.params.id, 'view');
      this.disableFields();
      this.BackToMis = true;
    }

    if (this.route.snapshot.params.page == null) {
      this.TicketData.ticketOwner = sessionStorage.getItem("userEntityId");
    }

    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {

      this.TicketData.district = district;
      this.TicketData.state = state;
      this.getAllDistrictByState(state);
      this.addTicketMasterForm.get('district').disable();
      this.addTicketMasterForm.get('state').disable();
      this.getActiveLocationsFromDistrict(district);
    }
    //this.getAllSubcategoryByCategory(name);  
    this.url = this._global.baseUrl;
  }
  get formControls() {
    return this.addTicketMasterForm.controls;
  }


}






