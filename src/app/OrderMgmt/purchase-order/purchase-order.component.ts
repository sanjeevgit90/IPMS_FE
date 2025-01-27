import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { PurchaseOrderService } from '../../OrderMgmt/purchase-order/purchase-order.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PoTaskService } from '../../OrderMgmt/purchase-order-task/po-task.service';
import { PoFilterSession } from '../ordermgmtfilterdata';
//import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  providers: [PurchaseOrderService, AppGlobals, DialogService, SharedService, PoTaskService]
})
export class PurchaseOrderComponent implements OnInit {
  result: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private purchaseOrderService: PurchaseOrderService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private poTaskService: PoTaskService) { }

  displayedColumns: string[] = ['purchaseOrderNo', 'vendor', 'departmentName', 'workflowName', 'amount', 'action'];
  POListData: MatTableDataSource<any>;

  exportColumns: string[] = ['purchaseOrderNo', 'vendor', 'orderDate', 'departmentName', 'accName', 'workflowName', 'approvalStatus', 'amount'];
  exportPOData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('closebutton') closebutton;

  amendmentForm: FormGroup;
  isSubmitted = false;
  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  filterlbl: string = "Filter";

  FilterData = { "purchaseOrderNo": null, "accountName": null, "organisationId": null, "supplierName": null, "department": null ,"approvalStatus":null};
  poDuplicate = { "entityId": null, "isAmendedFlag": "NO" };
  TaskData = { "poId": null, "poRcFlag": null, "remark": null, "workflowType": null };

  poAdd: boolean = false;
  poEdit: boolean = false;
  poView: boolean = false;
  poDelete: boolean = false;

  PageTitle = "PO Master";
  filterDiv: boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.POListData.filter = filterValue.trim().toLowerCase();
  }

  addPO = function () {
    this.router.navigate(['/AddPO']);
  }

  filterFunc = function () {
    this.filterDiv = true;
  }

  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("FILTERSESSION");
    this.result = false;
    this.search();
  }

  // Search function
  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.purchaseOrderService.getAllPoFromView(this.FilterData, headers).subscribe(resp => {
      this.showLoading = false;
      // Set Filter
      debugger;

      this.exportPOData = resp.content;
      let filterSession = new PoFilterSession();
      filterSession.purchaseOrderNo = this.FilterData.purchaseOrderNo;
      filterSession.accountName = this.FilterData.accountName;
      filterSession.organisationId = this.FilterData.organisationId;
      filterSession.supplierName = this.FilterData.supplierName;
      filterSession.department = this.FilterData.department;
      sessionStorage.setItem('FILTERSESSION', JSON.stringify(filterSession));
      this.result = !Object.values(filterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.POListData = new MatTableDataSource(resp.content);
      this.POListData.sort = this.sort;
      this.POListData.paginator = this.paginator;
      this.totalRecords = this.POListData.filteredData.length;
    }, (error: any) => {
      this.showLoading = false;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Delete function
  deletePo = function (poId) {
    this.DeleteMsg = 'Are you sure you want to delete this order?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.purchaseOrderService.deletePurchaseOrder(poId, headers).subscribe(resp => {
            this.successMessage = 'PO deleted successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      })
  }

  // Delete function
  generateDuplicateOrder = function (poId, amendFlag) {
    this.poDuplicate.entityId = poId;
    if (amendFlag == null) {
      this.DeleteMsg = 'Are you sure you want to duplicate this order?';
      this.poDuplicate.isAmendedFlag = "NO";
    } else if (amendFlag == "AMEND") {
      this.DeleteMsg = 'Are you sure you want to create new PO for this order?';
      this.poDuplicate.isAmendedFlag = "YES";
    }
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.purchaseOrderService.generateDuplicatePo(this.poDuplicate, headers).subscribe(resp => {
            if (amendFlag == null) {
              this.successMessage = 'New order has been created';
            } else if (amendFlag == "AMEND") {
              this.successMessage = 'New order has been created for amendment';
            }
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      })
  }

  requestForAmendment = function (poId) {
    debugger;
    this.isSubmitted = true;
    if (this.amendmentForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.TaskData.poId = poId;
    this.TaskData.poRcFlag = "AMEND";
    this.TaskData.workflowType = "AMEND";
    this.showLoading = true;
    this.poTaskService.saveTask(this.TaskData, headers).subscribe(resp => {
      this.showLoading = false;
      this.closebutton.nativeElement.click();
      this.successMessage = 'PO requested for amendment';
      this.dialogService.openConfirmDialog(this.successMessage)
      this.search();
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr);
    });
  }

  // party List
  supplierPartyList: any = [];
  getAllParty = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    //this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      //this.showLoading = false;
      this.supplierPartyList = resp;
    }, (error: any) => {
      //this.showLoading = false;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
        return;
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // getting project list
  projectList: any = [];
  getAllProjects = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    //this.showLoading = true;
    this.sharedService.getProjectList(headers).subscribe(resp => {
      //this.showLoading = false;
      this.projectList = resp;
    }, (error: any) => {
      //this.showLoading = false;
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
    const headers = { "Authorization": sessionStorage.getItem("token") };
    //this.showLoading = true;
    this.sharedService.getOrganizationsList(headers).subscribe(resp => {
      this.orgList = resp;
      //this.showLoading = false;
    }, (error: any) => {
      //this.showLoading = false;
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
    //this.showLoading = true;
    this.sharedService.getDepartmentList(headers).subscribe(resp => {
      debugger;
      this.deptList = resp;
      //this.showLoading = false;
    }, (error: any) => {
      debugger;
      //this.showLoading = false;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  pushPoToOpenBravo = function (poId) {
    this.DeleteMsg = 'Are you sure you want to push this PO to open-bravo?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.purchaseOrderService.pushPoToOpenBravo(poId, headers).subscribe(resp => {
            this.showLoading = false;
            if (resp.status == "SUCCESS") {
              this.successMessage = 'PO pushed successfully.';
              this.dialogService.openConfirmDialog(this.successMessage)
            } else {
              const errStr = "ERROR\n" + resp.errorMessage;
              this.dialogService.openConfirmDialog(errStr);
            }
            this.search();
          }, (error: any) => {
            this.showLoading = false;
            const errStr = "ERROR\n" + error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      });
  }

  amendPoId:number = null;
  getPoId = function(poId:number) {
    this.amendPoId = poId;
    console.log(this.amendPoId);
  }

  ngOnInit(): void {
    this.amendmentForm = this.formBuilder.group({
      remark: [null, Validators.required],
    })
    //Role Rights
    this.poAdd = this._global.UserRights.includes("Purchase_Order_ADD");
    this.poEdit = this._global.UserRights.includes("Purchase_Order_EDIT");
    this.poView = this._global.UserRights.includes("Purchase_Order_VIEW");
    this.poDelete = this._global.UserRights.includes("Purchase_Order_DELETE");
    sessionStorage.setItem("tabFlag", "PO");
    //Assign Filter
    let filterSession = JSON.parse(sessionStorage.getItem('FILTERSESSION'));
    if (sessionStorage.getItem('FILTERSESSION') != null) {
      this.FilterData.purchaseOrderNo = filterSession.purchaseOrderNo;
      this.FilterData.accountName = filterSession.accountName;
      this.FilterData.organisationId = filterSession.organisationId;
      this.FilterData.supplierName = filterSession.supplierName;
      this.FilterData.department = filterSession.department;
      if (Object.keys(filterSession).length === 0 && filterSession.constructor === Object) {
        return;
      }
      else{
        this.search();
      }
    }
    if (filterSession != null) { 
      this.result = !Object.values(filterSession).every(o => o === null || o === "");
    } else {
      this.result = false;
    }
    //this.search();
    this.getAllProjects();
    this.getAllOrganizations();
    this.getAllParty();
    this.getAllDepartments();
    sessionStorage.removeItem("taskId");
  }

  get formControls() {
    return this.amendmentForm.controls;
  }
}
