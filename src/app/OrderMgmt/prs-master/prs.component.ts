import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { PRSService } from './prs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PrsFilterSession } from '../ordermgmtfilterdata';

@Component({
  selector: 'app-prs',
  templateUrl: './prs.component.html',
  providers: [PRSService, AppGlobals, DialogService, SharedService]
})
export class PRSComponent implements OnInit {
  result: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private prsService: PRSService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['prsNo', 'purchaseOrderNumber', 'partyName',
    'invoiceAmount', 'approvalStatus', 'action'];
  PrsListData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  FilterData = { "purchaseOrderNumber": null, "issueChequeTo": null, "prsNo": null };
  partyList: any = [];
  poList: any = [];
  prsAdd: boolean = false;
  prsEdit: boolean = false;
  prsView: boolean = false;
  prsDelete: boolean = false;
  PageTitle = "PRS Master";
  filterDiv: boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.PrsListData.filter = filterValue.trim().toLowerCase();
  }

  addPrs = function () {
    this.router.navigate(['/addPrs']);
  }

  filterFunc = function () {
    this.filterDiv = true;
    this.getActiveVendors();
  }

  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("PRSFILTERSESSION");
    this.result = false;
    this.search();
  }
  // Party List
  getActiveVendors = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      debugger;
      this.partyList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getPoList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getPoList(headers).subscribe(resp => {
      debugger;
      this.poList = resp;
      this.showLoading = false;
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
    this.prsService.getPrsList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      debugger;
      let prsfilterSession = new PrsFilterSession();
      prsfilterSession.prsNo = this.FilterData.prsNo;
      prsfilterSession.issueChequeTo = this.FilterData.issueChequeTo;
      prsfilterSession.purchaseOrderNumber = this.FilterData.purchaseOrderNumber;
      sessionStorage.setItem('PRSFILTERSESSION', JSON.stringify(prsfilterSession));
      this.result = !Object.values(prsfilterSession).every(o => o === null || o === undefined || o === "");
      this.filterDiv = false;
      this.PrsListData = new MatTableDataSource(resp.content);
      this.PrsListData.sort = this.sort;
      this.PrsListData.paginator = this.paginator;
      this.totalRecords = this.PrsListData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  saveTask = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.prsService.submitForApproval(name, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "PRS is successfully submitted for Approval.";
      this.search();
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

  onDelete = function (id) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var experienceId = id;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.prsService.onDelete(experienceId, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "PRS is deleted successfully.";
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

  submitForApproval = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.prsService.submitForApproval(name, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "PRS is successfully submitted for Approval.";
      this.search();
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

  ngOnInit(): void {
    //Role Rights
    this.prsAdd = this._global.UserRights.includes("PRS_Master_ADD");
    this.prsEdit = this._global.UserRights.includes("PRS_Master_EDIT");
    this.prsView = this._global.UserRights.includes("PRS_Master_VIEW");
    this.prsDelete = this._global.UserRights.includes("PRS_Master_DELETE");
    //Assign Filter
    let prsfilterSession = JSON.parse(sessionStorage.getItem('PRSFILTERSESSION'));
    if (sessionStorage.getItem('PRSFILTERSESSION') != null) {
      this.FilterData.prsNo = prsfilterSession.prsNo;
      this.FilterData.issueChequeTo = prsfilterSession.issueChequeTo;
      this.FilterData.purchaseOrderNumber = prsfilterSession.purchaseOrderNumber;
    }
    if (prsfilterSession != null) {
      this.result = !Object.values(prsfilterSession).every(o => o === null || o === "");
    } else {
      this.result = false;
    }
    this.search();
    sessionStorage.removeItem("prsTaskId");
  }
}