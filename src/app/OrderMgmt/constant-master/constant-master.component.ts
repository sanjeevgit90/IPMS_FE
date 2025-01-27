import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { ConstantMasterService } from '../../OrderMgmt/constant-master/constant-master.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-constant-master',
  templateUrl: './constant-master.component.html',
  providers: [ConstantMasterService, AppGlobals, DialogService, SharedService]
})
export class ConstantMasterComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private constantMasterService: ConstantMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['type', 'value', 'organisationName', 'action'];
  ConstantMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  constantAdd: boolean = false;
  constantEdit: boolean = false;
  constantView: boolean = false;
  constantDelete: boolean = false;
  PageTitle = "Constant Master";
  add = true;
  edit = false;
  list = true;
  ConstantData = {
    "type": null, "value": null, "organisationId": null
  };
  addConstantForm: FormGroup;
  isSubmitted = false;
  cancel = function () {
    this.list = true;
    this.edit = false;
    this.addConstantForm.reset();
    this.PageTitle = "Constant Master";
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ConstantMasterData.filter = filterValue.trim().toLowerCase();
  }

  // Add function
  addConstant = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addConstantForm.invalid) {
      return;
    }
    var error = "";
    if (this.ConstantData.type == null) {
      error += "Type is required.\n";
    }
    if (this.ConstantData.value == null) {
      error += "Value is required.\n";
    }
    if (this.ConstantData.organisationId == null) {
      error += "Organisation is required.\n";
    }
    if(error != "") {
      this.dialogService.openConfirmDialog(error);
      return;
    }
    this.showLoading = true;
    this.constantMasterService.saveConstant(this.ConstantData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Constant saved successfully.";
      this.search();
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.ConstantData = {};
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // update function
  updateConstant = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addConstantForm.invalid) {
      return;
    }
    var error = "";
    if (this.ConstantData.type == null) {
      error += "Type is required.\n";
    }
    if (this.ConstantData.value == null) {
      error += "Value is required.\n";
    }
    if (this.ConstantData.organisationId == null) {
      error += "Organisation is required.\n";
    }
    if(error != "") {
      this.dialogService.openConfirmDialog(error);
      return;
    }
    this.showLoading = true;
    this.constantMasterService.updateConstant(this.ConstantData, headers, this.ConstantData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Constant updated successfully.";
      this.search();
      this.dialogService.openConfirmDialog(this.successMessage).afterClosed().subscribe(res => {
        this.ConstantData = {};
        this.edit = false;
        this.list = true;
        this.PageTitle = "Constant Master"
      })
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
    this.constantMasterService.getAllConstant(this.ConstantData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ConstantMasterData = new MatTableDataSource(resp);
      this.ConstantMasterData.sort = this.sort;
      this.ConstantMasterData.paginator = this.paginator;
      this.totalRecords = this.ConstantMasterData.filteredData.length;
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

  // Get data by id
  editon = function (id) {
    debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PageTitle = "Update Constant";
    this.constantMasterService.getConstantById(headers, id).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ConstantData = resp;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // delete by id
  deleteon = function (id) {
    this.DeleteMsg = 'Are you sure you want to delete this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.constantMasterService.deleteConstantById(headers, id).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Constant deleted successfully.";
            this.search();
            this.dialogService.openConfirmDialog(this.successMessage);
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }

  // Org List
  orgList:any = [];
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

  ngOnInit(): void {
    //Role Rights
    this.constantAdd = this._global.UserRights.includes("Constant_Master_ADD");
    this.constantEdit = this._global.UserRights.includes("Constant_Master_EDIT");
    this.constantView = this._global.UserRights.includes("Constant_Master_VIEW");
    this.constantDelete = this._global.UserRights.includes("Constant_Master_DELETE");
    this.addConstantForm = this.formBuilder.group({
      type: [null, Validators.required],
      value: [null, Validators.required],
      organisationId: [null, Validators.required]
    });
    this.search();
    this.getAllOrganizations();
  }
  get formControls() { return this.addConstantForm.controls; }
}