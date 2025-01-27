import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../../global/app.global';
import { DialogService } from '../../../../service/dialog.service';
import { SharedService } from '../../../../service/shared.service';
import { TicketTaskService } from '../ticket-task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter } from '@angular/material/core';

import { FileuploadService } from '../../../../service/fileupload.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  providers: [TicketTaskService, AppGlobals, DialogService, SharedService, FileuploadService]

})
export class AddTaskComponent implements OnInit {
  maxDateDisabled: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketTaskService: TicketTaskService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private fileuploadService: FileuploadService) { }

  displayedColumns: string[] = ['checkbox', 'tripId', 'sourceAdd', 'destAdd', 'startTime', 'endTime', 'distance'];
  tripSearchResultsFinal: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  FilterData = {};

  hasRole: boolean = false;
  buttonDisabled = true;
  filterDiv: boolean = false;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  outsideToken = "";
  tripSearchResults = [];
  thirdPartyRequest = { "records": [] };
  ticketId = "";
  tempTrip = [];
  tripSearch = { "idList": [], "ticketNo": [] };
  item1 = {};
  item = {};
  item2 = {};
  trip = {};
  //this.tripSearch.idList=[];
  ticketCategoryList: any = [];
  subCategoryList: any = [];
  classificationList: any = [];
  vendorList: any = [];
  taskHistoryList: any = [];
  ticketAttachment: any = [];
  PageTitle = "Ticket Task";
  add = true;
  edit = false;
  list = true;
  TicketTaskData = {
    "approvalStatus": "", "resolutionDate": "", "assignName": null, "ticketCategory": "", "ticketSubcategory": "", "classifications": "",
    "attachment": "", "trip": "", "vehicleRegNo": "", "tripFromDate": "", "vendorname": "", "resolution": null, "selected": "", "ticketClosedTime": "",
    "assetname": "", "location": "", "duedate": "", "ticketStatus": "", "ticketNo": "", "firstname": "", "createdBy": "", "remark": ""

  };
  TaskData = {
    "entityId": null, "approvalStatus": null, "resolutionDate": null, "ticketCategory": null,
    "ticketSubcategory": null, "classifications": null, "captureImg": null, "trip": null, "ticketClosedTime": null,
    "resolution": null, "remark": null, "vendorname": null
  };
  TicketData = {
    "ticketNo": "", "otherProblemDescription": "", "location": "", "assettag": "",
    "category": "", "subCategory": "",
    "ticketType": "", "ticketTitle": "",
    "dueDate": "", "resolutionDate": "", "assetName": null, "contactEmail": "",
    "mobileNo": "", "assetid": null, "ticketStatus": null, "ticketClosedTime": "",
    "classifications": null, "toAddress": "",
    "department": null, "ticketCategory": null, "ticketSubcategory": null, "resolution": "", "draftFlag": null
  };
  assignToUser: String = null;

  userList = {};
  vehicleList = {};
  classifications: any = [];
  addTaskForm: FormGroup;
  isSubmitted = false;
  //ticketAttachment :any =[];
  tripResults: any = [];

  maxDateMethod() {
    let maxDate: string = new Date().toISOString();
    this.maxDateDisabled = this.getFormattedDate(maxDate);
    return;
  }

  getFormattedDate(datemilli) {
    let localdate = new Date(datemilli);
    return localdate.getFullYear() + "-" + (localdate.getMonth() + 1).toString().padStart(2, '0') + "-" + localdate.getDate().toString().padStart(2, '0') + "T" + localdate.getHours().toString().padStart(2, '0') + ":" + localdate.getMinutes().toString().padStart(2, '0')
  }

  back = function () {
    this.router.navigate(['/searchTicketAction']);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }


  getVehicleList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketTaskService.getVehicleList(headers).subscribe(resp => {
      debugger;
      this.VehicleMasterData = resp;
      this.showLoading = false;


    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAllCategory = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveCategoryList(headers).subscribe(resp => {
      debugger;
      this.ticketCategoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAllSubcategoryByCategory = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getSubcategoryByCategory(headers, name).subscribe(resp => {
      debugger;
      this.subCategoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  getVendorList = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketTaskService.getVendorList(headers, id).subscribe(resp => {
      debugger;
      this.vendorList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getClassificationByProject = function (project) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketTaskService.getClassificationByProject(headers, project).subscribe(resp => {
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




  //get all profile list
  getAllUser = function () {
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
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  getActiveVehicleList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveVehicleList(headers).subscribe(resp => {
      debugger;
      this.vehicleList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  statusChanged() {
    debugger;
    if (this.TicketTaskData.approvalStatus == 'ESCALATED') {
      this.addTaskForm.get('vendorname').enable();
    }
    else if (this.TicketTaskData.approvalStatus == 'RESOLVED') {
      this.addTaskForm.get('resolutionDate').enable();
    }
    else if (this.TicketTaskData.approvalStatus == 'CLOSED') {
      this.addTaskForm.get('ticketClosedTime').enable();
      this.addTaskForm.get('trip').enable();
    }
    else if ((this.TicketTaskData.approvalStatus == 'REASSIGNED') || (this.TicketTaskData.approvalStatus == 'FORWARDED')) {
      this.addTaskForm.get('assignName').enable();
    }
    else {
      this.addTaskForm.get('trip').disable();
      this.addTaskForm.get('vendorname').disable();
      this.addTaskForm.get('assignName').disable();
      this.addTaskForm.get('resolutionDate').disable();
      this.addTaskForm.get('ticketClosedTime').disable();
    }
  }

  // Add / update function
  addTask = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addTaskForm.invalid) {
      return;
    }
    if (this.classifications.length != 0) {
      this.classificationsChange(this.classifications);
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;

    if (this.ticketAttachment.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.ticketAttachment)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.TaskData.captureImg = this.fileuploadService.getFirstFilePath(this.ticketAttachment);
    }
    this.TaskData.approvalStatus = this.TicketTaskData.approvalStatus;
    if (this.TaskData.ticketClosedTime != null) {
      let closetime = new Date(this.TaskData.ticketClosedTime);
      let  currentDate = new Date(); 
      if (closetime.getTime() > currentDate.getTime()) {
        this.dialogService.openConfirmDialog("Ticket Closed Date Time should be less than Current Date Time ");
        return;
      }
      this.TaskData.ticketClosedTime = closetime.getTime();
    }
    if (this.TaskData.resolutionDate != null) {
      let resolutiontime = new Date(this.TaskData.resolutionDate);
      this.TaskData.resolutionDate = resolutiontime.getTime();
    }
    this.TaskData.entityId = this.TaskData1.entityId;
    this.TaskData.ticketNo = this.TaskData1.ticketNo;
    //this.TicketTaskData.latitude =12435;
    this.ticketTaskService.saveTask(this.TaskData, headers, this.assignToUser).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Ticket Task is processed successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addTaskForm.reset();
          this.TicketTaskData = {};
          this.closeTrip();
          this.router.navigate(['/searchTicketAction']);
          if (flag == "update") {
            this.edit = false;
            this.list = true;
          }
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr);
      this.TaskData.resolutionDate = (new Date(this.TaskData.resolutionDate));
      this.TaskData.ticketClosedTime = (new Date(this.TaskData.ticketClosedTime));
    });
  }

  getHistoryDataById = function (entityId) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketTaskService.getHistoryDataById(entityId, headers).subscribe(resp => {
      debugger;
      this.taskHistoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr);
    });
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
    this.TaskData.classifications = temp;
  }

  optionToggled = function (TripData, selected) {
    debugger;
    if (TripData.tripId == null) {
      alert("Trips without 'Trip ID' cannot be selected.");
      TripData.selected = (!selected);
      return;
    }
    if (this.sameDateFlag) {
      let item = {};
      this.item.id = TripData.entityId;
      this.item.tripId = TripData.tripId;
      this.item.parentId = TripData.parentId;
      this.item.groupId = TripData.groupId;
      this.item.latitude = TripData.latitude;
      this.item.longitude = TripData.longitude;
      this.item.startTime = TripData.startTime;
      this.item.endTime = TripData.endTime;
      this.item.maxSpeed = TripData.maxSpeed;
      this.item.urlString = TripData.urlString;
      this.item.polyline = TripData.polyLine;
      this.item.sourceLat = TripData.sourceLat;
      this.item.sourceLong = TripData.sourceLong;
      this.item.destinationLat = TripData.destLat;
      this.item.destinationLong = TripData.destLong;
      this.item.distanceValue = TripData.distanceValue;
      this.item.locationType = TripData.locationType;
      this.item.ignitionEvent = TripData.ignitionEvent;
      this.item.obdSerialId = TripData.obdSerialId;
      this.item.sourceAdd = TripData.sourceAdd;
      this.item.destAdd = TripData.destAdd;
      if (selected) {
        debugger;
        let item2 = {};
        this.item2.id = TripData.entityId;
        this.item2.tripId = TripData.tripId;
        this.item2.parentId = TripData.parentId;
        this.item2.vehicleNo = this.thirdPartyRequest.vehicleNo;

        this.tempTrip.push(item2);

        this.thirdPartyRequest.ticketId = this.TicketTaskData.entityId;
        this.thirdPartyRequest.records.push(item);
      } else {
        debugger;
        //vm.thirdPartyRequest.records.pop(item.id);
        this.removeByAttr(this.thirdPartyRequest.records, 'id', this.item.id);
        this.removeByAttr(this.tempTrip, 'id', this.item.id);
      }
    } else {
      if (selected) {
        debugger;
        var item1 = {};
        this.item1.id = TripData.entityId;
        this.item1.tripId = TripData.tripId;
        this.item1.parentId = TripData.parentId;
        this.item1.vehicleNo = TripData.vehicleNo;

        this.tempTrip.push(item1);

        this.tripSearch.ticketId = this.TicketData.entityId;
        this.tripSearch.idList.push(TripData.entityId);
        this.tripSearch.ticketNo.push(this.TicketData.ticketNo);
      } else {
        this.tripSearch.idList.pop(this.TripData.id);
        this.removeByAttr(this.tempTrip, 'id', this.TripData.id);
      }
    }
  }

  searchTrip = function (flag) {
    debugger;
    //this.tripSearchResults={};
    //this.tripSearchResults1={};
    this.request = {};
    this.recDeStaus = false;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sameDateFlag = false;

    this.TripData = [];
    this.TripData.sourceAdd = null;
    this.TripData.destAdd = null;

    if (this.TicketTaskData.tripFromDate == null) {
      (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      }
    }
    if ((this.TicketTaskData.vehicleRegNo == null) || (this.TicketTaskData.vehicleRegNo == "")) {
      (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      }
    }

    debugger;
    let fromDate = this.TicketTaskData.tripFromDate.getTime();
    let todayDate = new Date(new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear());
    let today = todayDate.getTime();

    if (fromDate == today) {
      this.sameDateFlag = true;
    }

    if (this.sameDateFlag) {
      this.request.vehicle = this.TicketTaskData.vehicleRegNo;
      this.request.startTime = fromDate;
      this.request.endTime = new Date(new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear() + " 23:59:59").getTime();
      this.request.parentId = this.parentId;

      this.showLoading = true;
      this.ticketTaskService.getAllDataFromOut(this.outsideToken, this.request).subscribe(resp => {
        debugger;
        this.showLoading = false;
        if (resp.status == "FAILURE") {
          (error: any) => {
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
            this.tripSearchResults = [];
          }
        } else {
          debugger;
          //this.tripSearchResults = {};
          this.tripSearchResults = [];


          //this.tripSearchResults.vehicleNo = "";
          this.tripSearchResults1 = resp.payLoad[0].records;

          this.tripSearchResults.vehicleNo = resp.payLoad[0].vehicleNo;
          this.thirdPartyRequest.vehicleNo = resp.payLoad[0].vehicleNo;
          if (this.tripSearchResults1.length != 0) {
            this.clearFlag2 = true;
          }

          var item = 0;
          for (var i = 0; i < this.tripSearchResults1.length; i++) {
            if (this.tripSearchResults1[i].hasOwnProperty("tripId")) {
              //debugger;

              this.tripSearchResults.push(this.tripSearchResults1[i]);
              this.tripSearchResults[item].sourceAdd = null;
              this.tripSearchResults[item].destAdd = null;
              item = item + 1;
            }
            //debugger;
          }
          debugger;
          // for(var i = 0; i < this.tripSearchResults.length; i++){
          //   debugger;
          //   this.ticketTaskService.fillAddressByLatLong(this.tripSearchResults[i].sourceLat, this.tripSearchResults[i].sourceLong).subscribe(resp => {
          //     debugger;
          //     this.tripSearchResults[i].sourceAdd = resp.payLoad;
          //   });
          //   this.ticketTaskService.fillAddressByLatLong(this.tripSearchResults[i].destLat, this.tripSearchResults[i].destLong).subscribe(resp => {
          //     debugger;
          //     this.tripSearchResults[i].destAdd = resp.payLoad;
          //   });
          // }


          this.tripSearchResultsFinal = new MatTableDataSource(this.tripSearchResults);
        }
        debugger;
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
    else {
      let tempDate = new Date(fromDate);
      let toDate = new Date(tempDate.getMonth() + 1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear() + " 23:59:59").getTime();
      debugger;
      this.request.vehicleNo = this.TicketTaskData.vehicleRegNo;
      this.request.startTime = fromDate;
      this.request.endTime = toDate;

      this.showLoading = true;
      this.ticketTaskService.tripList(headers, this.request).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.tripSearchResultsFinal = new MatTableDataSource(resp);
        if (this.tripSearchResultsFinal.length != 0) {
          this.clearFlag2 = true;
        }
        if (this.tripSearchResultsFinal.length == 0) {
          this.clearFlag2 = true;
          this.recDeStaus = true;
          return;
        }

      }, (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  }

  loginRequest = {};
  loginToThirdParty = function () {
    debugger;
    this.loginRequest.emailId = this._global.thirdPartyCredentials[0].userid;
    this.loginRequest.password = this._global.thirdPartyCredentials[0].password;
    this.ticketTaskService.loginToThirdParty(this.loginRequest, null).subscribe(resp => {
      debugger;
      this.outsideToken = resp.payLoad.authToken;
      this.parentId = resp.payLoad.parentId;
      this.loginRequest = {};
      this.showLoading = false;
    }, function (error) {
      this.loginRequest = {};
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  logoutToThirdParty = function () {
    this.ticketTaskService.logoutToThirdParty(this.loginRequest, this.authToken).subscribe(resp => {
    }, function (error) {
      this.loginRequest = {};
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }




  tripOption = function () {
    debugger;
    if (this.TaskData.trip == "ADD TRIPS")
      this.addTrip();

    else if (this.TaskData.trip == "NO VEHICLES USED")
      this.closeTrip();
  }

  addTrip = function () {
    debugger;
    this.addTripFlag = true;
    this.clearFlag2 = false;
    this.TripData = [];
    this.TripData.tripToDate = null;
    this.TripData.tripFromDate = null;
    this.trip.vehicle = null;
    this.loginToThirdParty();
    this.getVehicleList();
  }
  closeTrip = function () {
    this.addTripFlag = false;
    this.clearFlag2 = false;
    this.tripSearchResults = [];
    this.thirdPartyRequest.records = [];
    this.tripSearch.idList = [];
    this.trip.tripToDate = "";
    this.trip.tripFromDate = "";
    this.vehicle = "";
    this.showLoading = false;
    this.logoutToThirdParty();
  }

  getTripDataByTicket = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketId = id;
    this.showLoading = true;
    this.ticketTaskService.getTripDataByTicket(headers, this.ticketId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.tripResults = resp.data.searchResults;
      if (this.tripResults.length > 0)
        this.vehicleNo = this.tripResults[0].vehicleNo;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  removeTrip = function (removeTripId) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.removeTripId = removeTripId;
    this.showLoading = true;
    this.ticketTaskService.removeTripFromTicket(removeTripId, headers).subscribe(resp => {
      this.getTripDataByTicket(this.TripData.ticketId);
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }




  removeByAttr = function (arr, attr, value) {
    debugger;
    var i = arr.length;
    while (i--) {
      if (arr[i] && arr[i].hasOwnProperty(attr) && (arr.length > 2 && arr[i][attr] === value)) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }





  saveTripAndUpdateTicket = function () {
    debugger;
    this.TicketTaskData.ticketId = this.TicketData.entityId;

    if (this.TicketTaskData.approvalStatus == null) {
      this.dialogService.openConfirmDialog(" Please select one action.")
      return;
    }

    if (this.TicketTaskData.approvalStatus == "CLOSED") {
      if (this.TaskData.ticketClosedTime == null) {
        this.dialogService.openConfirmDialog(" Ticket Closed Time is required")
        return;
      }

      if (this.TaskData.trip == null || this.TaskData.trip == "") {
        this.dialogService.openConfirmDialog(" Please select trips.")
        return;
      }
    }

    if ((this.TicketTaskData.approvalStatus == 'RE-ASSIGNED') || (this.TicketTaskData.approvalStatus == 'FORWARDED')) {
      if (this.assignToUser == null) {
        this.dialogService.openConfirmDialog("Please select assigned to.")
        return;
      }
    }

    if (this.TicketTaskData.approvalStatus == "CLOSED") {
      if (this.TaskData.trip == "ADD TRIPS") {
        if ((this.thirdPartyRequest.records.length == 0) && (this.tripSearch.idList.length == 0) &&
          (this.tripResults.length == 0)) {
          this.dialogService.openConfirmDialog("Please add trips.")
          return;
        }
      }
    }

    if ((this.thirdPartyRequest.records.length != 0) || (this.tripSearch.idList.length != 0)) {
      if (this.sameDateFlag) {
        this.saveTripData(this.thirdPartyRequest);
      } else {
        this.updateTripData(this.tripSearch);
      }
    } else {
      this.updateTicket();
    }
  }


  saveTripData = function (thirdPartyRequest) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.thirdPartyRequest = thirdPartyRequest;
    this.showLoading = true;
    this.ticketTaskService.saveTripDataFromThirdParty(this.thirdPartyRequest, headers).subscribe(resp => {
      debugger;
      this.updateTicket("update");
    }, function (error) {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });

  }


  updateTripData = function (tripSearch) {
    debugger;
    this.tripSearch = tripSearch;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketTaskService.updateTripData(this.tripSearch, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.updateTicket("update");
      this.closeTrip();
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  //Update Ticket
  updateTicket = function (flag) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var errorMessage = "";
    this.TicketTaskData.ticketId = this.TicketData.entityId;

    if (this.TicketTaskData.approvalStatus == null) {
      this.dialogService.openConfirmDialog(" Please select one action.")
      return;
    }

    if (this.TicketTaskData.approvalStatus == "CLOSED") {
      if (this.TicketTaskData.ticketClosedTime == null) {
        this.dialogService.openConfirmDialog(" Ticket Closed Time is required")
        return;
      }

      if (this.TaskData.trip == null || this.TaskData.trip == "") {
        this.dialogService.openConfirmDialog(" Please select trips.")
        return;
      }

      if (this.TaskData.ticketCategory == null || this.TaskData.ticketCategory == "") {
        this.dialogService.openConfirmDialog("Please select Ticket Category")
        return;
      }

      if (this.TaskData.ticketSubcategory == null || this.TaskData.ticketSubcategory == "") {
        this.dialogService.openConfirmDialog("Please select Ticket Sub Category")
        return;
      }
    }

    if (this.TicketTaskData.approvalStatus == "RESOLVED") {
      if (this.TaskData.resolutionDate == null) {
        this.dialogService.openConfirmDialog("Please select Resolution Date")
        return;
      }
    }

    if ((this.TicketTaskData.approvalStatus == 'RE-ASSIGNED') || (this.TicketTaskData.approvalStatus == 'FORWARDED')) {
      if (this.assignToUser == null) {
        this.dialogService.openConfirmDialog("Please select assigned to.")
        return;
      }
    }
    this.addTask('update');
  }

  // Get data by id
  projectname;
  editon = function (entityId, flag) {
    debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var entityId = entityId;
    this.PageTitle = "Ticket Task Action";
    this.ticketTaskService.taskById(entityId, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TaskData1 = resp;
      this.getTicketById(this.TaskData1.ticketId);
      this.getHistoryDataById(this.TaskData1.ticketNo);
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  getTicketById = function (entityId, flag) {
    debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var entityId = entityId;
    this.ticketTaskService.ticketById(entityId, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.TicketData = resp;
      let createdDate = this.TicketData.dueDate;
      this.TicketData.dueDate = new Date(createdDate).toISOString().slice(0, 16);

      this.TicketData.resolutionDate = (new Date(this.TicketData.resolutionDate));
      this.TicketData.ticketClosedTime = (new Date(this.TicketData.ticketClosedTime));
      this.projectname = this.TicketData.accountName;
      this.getVendorList(this.projectname);
      this.getClassificationByProject(this.projectname);
      this.TaskData.ticketCategory = this.TicketData.ticketCategory;
      this.TaskData.ticketSubcategory = this.TicketData.ticketSubcategory;
      this.getAllSubcategoryByCategory(this.TaskData.ticketCategory);
      this.TaskData.resolution = this.TicketData.resolution;
      if (this.TicketData.classifications != null) {
        debugger;
        let classificationTemp = [];
        var splitted = this.TicketData.classifications.split(",");
        this.classifications = splitted;

      }

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  url :string;

  ngOnInit(): void {
    this.maxDateMethod();
    this.addTaskForm = this.formBuilder.group({
      approvalStatus: [null, Validators.required],
      resolutionDate: [null, Validators.required],
      assignName: [null, Validators.required],
      ticketCategory: [null],
      ticketSubcategory: [null],
      classifications: [null],
      trip: [null, Validators.required],
      vehicleRegNo: [null],
      tripFromDate: [null],
      vendorname: [null, Validators.required],
      resolution: [null],
      ticketClosedTime: [null, Validators.required],
      remark: [null, Validators.required],




    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Task";
      this.editon(this.route.snapshot.params.id, 'edit');
      //this.getHistoryDataById(this.TicketTaskData.ticketNo);

    }
    this.addTaskForm.get('trip').disable();
    this.addTaskForm.get('vendorname').disable();
    this.addTaskForm.get('assignName').disable();
    this.addTaskForm.get('resolutionDate').disable();
    this.addTaskForm.get('ticketClosedTime').disable();
    this.hasRole = this._global.UserRights.includes("ROLE_CHM") || this._global.UserRights.includes("ROLE_TEAM_LEADER");
    this.getAllUser();
    this.getActiveVehicleList();
    //this.searchTrip();
    this.getVehicleList();
    this.getAllCategory();
    this.url = this._global.baseUrl;

  }
  get formControls() {
    return this.addTaskForm.controls;
  }

}















