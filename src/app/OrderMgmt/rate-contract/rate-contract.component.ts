import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { RateContractService } from '../../OrderMgmt/rate-contract/rate-contract.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RcFilterSession } from '../ordermgmtfilterdata';

@Component({
  selector: 'app-rate-contract',
  templateUrl: './rate-contract.component.html',
  providers: [RateContractService, AppGlobals, DialogService, SharedService]
})
export class RateContractComponent implements OnInit {
  result: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private rateContractService: RateContractService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['rateContractNo', 'contractDate', 'departmentName', 'accName', 'approvalStatus', 'action'];
  RCListData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  FilterData = { "rateContractNo": null, "accountName": null, "organisationId": null, "supplierName": null, "department": null };

  PageTitle = "RC Master";

  rcAdd: boolean = false;
  rcEdit: boolean = false;
  rcView: boolean = false;
  rcDelete: boolean = false;

  filterDiv: boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.RCListData.filter = filterValue.trim().toLowerCase();
  }

  addRC = function () {
    debugger;
    this.router.navigate(['/registerRateContract']);
  }

  filterFunc = function () {
    this.filterDiv = true;
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("FILTERSESSION");
    this.result = false;
    this.search();
  }
  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.rateContractService.getAllRcFromView(this.FilterData, headers).subscribe(resp => {
      debugger;
      // Set Filter
      let RcfilterSession = new RcFilterSession();
      RcfilterSession.rateContractNo = this.FilterData.rateContractNo;
      RcfilterSession.accountName = this.FilterData.accountName;
      RcfilterSession.organisationId = this.FilterData.organisationId;
      RcfilterSession.supplierName = this.FilterData.supplierName;
      RcfilterSession.department = this.FilterData.department;
      sessionStorage.setItem('RCFILTERSESSION', JSON.stringify(RcfilterSession));
      this.result = !Object.values(RcfilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.RCListData = new MatTableDataSource(resp.content);
      this.RCListData.sort = this.sort;
      this.RCListData.paginator = this.paginator;
      this.totalRecords = this.RCListData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      if (error.statusText == "Unknown Error") {
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //deleting rc
  deleteRc = function (rcId) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to delete this rate contract?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.rateContractService.deleteRateContract(rcId, headers).subscribe(resp => {
            this.successMessage = 'RC deleted successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      })
  }

  // Delete function
  poDuplicate = { "entityId": null };
  generateDuplicateOrder = function (poId) {
    debugger;
    this.poDuplicate.entityId = poId;
    this.DeleteMsg = 'Are you sure you want to duplicate this rate contract?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.rateContractService.generateDuplicateRc(this.poDuplicate, headers).subscribe(resp => {
            this.successMessage = 'New rate contract has been created';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      })
  }

  // party List
  supplierPartyList: any = [];
  getAllParty = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.supplierPartyList = resp;
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

  // getting project list
  projectList: any = [];
  getAllProjects = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getProjectList(headers).subscribe(resp => {
      this.showLoading = false;
      this.projectList = resp;
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

  // Org List
  orgList: any = [];
  getAllOrganizations = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getOrganizationsList(headers).subscribe(resp => {
      debugger;
      this.orgList = resp;
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

  // getting department list
  deptList: any = [];
  getAllDepartments = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDepartmentList(headers).subscribe(resp => {
      debugger;
      this.deptList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    //Role Rights
    this.rcAdd = this._global.UserRights.includes("Rate_Contract_ADD");
    this.rcEdit = this._global.UserRights.includes("Rate_Contract_EDIT");
    this.rcView = this._global.UserRights.includes("Rate_Contract_VIEW");
    this.rcDelete = this._global.UserRights.includes("Rate_Contract_DELETE");
    sessionStorage.setItem("tabFlag", "RC");
    //Assign Filter
    let RcfilterSession = JSON.parse(sessionStorage.getItem('RCFILTERSESSION'));
    if (sessionStorage.getItem('RCFILTERSESSION') != null) {
      this.FilterData.rateContractNo = RcfilterSession.rateContractNo;
      this.FilterData.accountName = RcfilterSession.accountName;
      this.FilterData.organisationId = RcfilterSession.organisationId;
      this.FilterData.supplierName = RcfilterSession.supplierName;
      this.FilterData.department = RcfilterSession.department;
    }
    if (RcfilterSession != null) {
      this.result = !Object.values(RcfilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
    this.getAllProjects();
    this.getAllOrganizations();
    this.getAllParty();
    sessionStorage.removeItem("taskId");
  }
}