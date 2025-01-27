import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { TicketClassificationService } from './ticket-classification.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ticket-classification',
  templateUrl: './ticket-classification.component.html',
  providers: [TicketClassificationService, AppGlobals, DialogService, SharedService]

})
export class TicketClassificationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketClassificationService: TicketClassificationService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['classificationValue', 'projectname', 'action'];

  ClassificationMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  ticketClassificationsAdd: boolean = false;
  ticketClassificationsEdit: boolean = false;
  ticketClassificationsView: boolean = false;
  ticketClassificationsDelete: boolean = false;
  FilterData = {

  };
  PageTitle = "Ticket Classification";
  filterDiv: boolean = false;
  add = true;
  edit = false;
  list = true;
  ClassificationData = {
    "classificationValue": "", "projectId": null
  };

  projectList: any = [];

  addTicketClassificationForm: FormGroup;
  isSubmitted = false;
  classificationList: any = [];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ClassificationMasterData.filter = filterValue.trim().toLowerCase();
  }

  filterFunc = function () {
    debugger;
    this.filterDiv = true;
  }

  // cancel = function () {
  //   this.list = true;
  //   this.edit = false;
  //   this.ClassificationData = {};
  //   this.filterDiv = false;
  //   this.FilterData = {};

  //   this.PageTitle = "Classification Master";
  // }


  cancel = function () {
    this.list = true;
    this.edit = false;
    this.ClassificationData = {};
    this.PageTitle = "Classification Master";
    this.enabledField();
  }


  // cancel = function () {
  //   debugger;
  //   this.filterDiv = false;
  //   this.FilterData = {};
  // }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name == o2.name && o1.id == o2.id;
  }

  //get all project list
  getProjectList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Add / update function
  addClassification = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addTicketClassificationForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketClassificationService.saveClassification(this.ClassificationData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Classification " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addTicketClassificationForm.reset();
          this.ClassificationData = {};

          this.search();
          this.getActiveClassification();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.enabledField();
          }
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  deleteClassificationData = function (name) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.ticketClassificationService.deleteClassificationData(id, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Classification deleted successfully.";
            this.search();
            // this.getActiveClassification();
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
      })
  }

  getActiveClassification = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.ticketClassificationService.getActiveClassification(headers).subscribe(resp => {
      debugger;
      this.classificationList = resp;

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    // this.FilterData.confirmed = true;

    this.ticketClassificationService.getClassificationList(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.ClassificationMasterData = new MatTableDataSource(resp);
      this.ClassificationMasterData.sort = this.sort;
      this.ClassificationMasterData.paginator = this.paginator;
      this.totalRecords = this.ClassificationMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get data by id
  editon = function (id) {
    debugger;
    this.disabledField();
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var classificationValue = id;
    this.PageTitle = "Update Classification";
    this.ticketClassificationService.classificationById(classificationValue, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ClassificationData = resp;
      //this.getProjectList(this.ClassificationData.projectname)

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Disabled Function
  disabledField = function () {
    this.addTicketClassificationForm.get('classificationValue').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addTicketClassificationForm.get('classificationValue').enable();
  }
  ngOnInit(): void {


    //Role Rights
    this.ticketClassificationsAdd = this._global.UserRights.includes("Ticket_Classifications_ADD");
    this.ticketClassificationsEdit = this._global.UserRights.includes("Ticket_Classifications_EDIT");
    this.ticketClassificationsView = this._global.UserRights.includes("Ticket_Classifications_VIEW");
    this.ticketClassificationsDelete = this._global.UserRights.includes("Ticket_Classifications_DELETE");



    this.addTicketClassificationForm = this.formBuilder.group({
      classificationValue: ['', Validators.required],
      projectId: ['', Validators.required]
    });
    this.search();
    this.getProjectList();
    this.getActiveClassification();

  }
  get formControls() { return this.addTicketClassificationForm.controls; }
}



