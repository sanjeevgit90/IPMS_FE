import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { TicketProblemReportService } from './ticket-problem-report.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ticket-problem-report',
  templateUrl: './ticket-problem-report.component.html',
  providers: [TicketProblemReportService, AppGlobals, DialogService, SharedService]

})
export class TicketProblemReportComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketProblemReportService: TicketProblemReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['problemReportValue', 'projectname', 'action'];

  ProblemReportMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  showLoading: boolean = false;

  ticketproblemReportedAdd: boolean = false;
  ticketproblemReportedEdit: boolean = false;
  ticketproblemReportedView: boolean = false;
  ticketproblemReportedDelete: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  FilterData = {};


  PageTitle = "Problem Report Master";
  add = true;
  edit = false;
  list = true;
  ProblemReportData = {
    "problemReportValue": "", "projectId": null
  };

  projectList: any = [];

  addTicketProblemReportForm: FormGroup;
  isSubmitted = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProblemReportMasterData.filter = filterValue.trim().toLowerCase();
  }


  cancel = function () {
    this.list = true;
    this.edit = false;
     this.ProblemReportData = {};

    this.formDirective.resetForm();
    this.isSubmitted = false;
    this.PageTitle = "Problem Report Master";
    this.enabledField();
  }

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
  addProblemReport = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addTicketProblemReportForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketProblemReportService.saveProblemReport(this.ProblemReportData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Problem Report " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.ProblemReportData = {};
          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Problem Report Master";
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

  deleteProblemData = function (name) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.ticketProblemReportService.deleteProblemData(id, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Problem Report deleted successfully.";
            this.search();
            // this.getActiveClassification();
            this.formDirective.resetForm();
            this.isSubmitted = false;
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

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketProblemReportService.getproblemReportList(headers, this.FilterData).subscribe(resp => {
      debugger;
      this.ProblemReportMasterData = new MatTableDataSource(resp);
      this.ProblemReportMasterData.sort = this.sort;
      this.ProblemReportMasterData.paginator = this.paginator;
      this.totalRecords = this.ProblemReportMasterData.filteredData.length;
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
    var problemReportValue = id;
    this.PageTitle = "Update Problem Report";
    this.ticketProblemReportService.problemReportById(problemReportValue, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ProblemReportData = resp;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // Disabled Function
  disabledField = function () {
    this.addTicketProblemReportForm.get('problemReportValue').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addTicketProblemReportForm.get('problemReportValue').enable();
  }

  ngOnInit(): void {


    //Role Rights
    this.ticketproblemReportedAdd = this._global.UserRights.includes("Ticket_Problem_Reported_ADD");
    this.ticketproblemReportedEdit = this._global.UserRights.includes("Ticket_Problem_Reported_EDIT");
    this.ticketproblemReportedView = this._global.UserRights.includes("Ticket_Problem_Reported_VIEW");
    this.ticketproblemReportedDelete = this._global.UserRights.includes("Ticket_Problem_Reported_DELETE");


    this.addTicketProblemReportForm = this.formBuilder.group({
      problemReportValue: ['', Validators.required],
      projectId: ['', Validators.required]
    });
    this.search();
    this.getProjectList();

  }
  get formControls() { return this.addTicketProblemReportForm.controls; }
}

