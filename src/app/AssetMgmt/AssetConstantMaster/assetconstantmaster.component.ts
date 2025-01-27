import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { AssetConstantMasterService } from './assetconstantmaster.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ConstantFilterSession } from '../assetfilterdata';
@Component({
  selector: 'app-assetconstantmaster',
  templateUrl: './assetconstantmaster.component.html',
  providers: [AssetConstantMasterService, AppGlobals, DialogService, SharedService]
})

export class AssetConstantMasterComponent implements OnInit {
  result: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private constantMasterService: AssetConstantMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  // search screen start
  displayedColumns: string[] = ['constantname', 'term', 'constantnamefor', 'action'];
  AssetConstantRecordData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  disableFlag = false;
  PageTitle = "Asset Constant Master";
  add = true;
  edit = false;
  list = true;
  AssetConstantAdd: boolean = false;
  AssetConstantEdit: boolean = false;
  AssetConstantView: boolean = false;
  AssetConstantDelete: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AssetConstantRecordData.filter = filterValue.trim().toLowerCase();
  }
  AssetConstantMasterData = {
    "constantname": null, "term": null, "constantnamefor": null
  };
  addConstantForm: FormGroup;
  isSubmitted = false;
  cancel = function () {
    this.list = true;
    this.edit = false;
    this.formDirective.resetForm();
    this.isSubmitted = false;
    this.PageTitle = "Asset Constant Master";
    this.enabledField();
  }

  FilterData = { "constantname": null };
  filterDiv: boolean = false;

  filterFunc = function () {
    this.filterDiv = true;
  }

  cancelSearch = function () {
    this.filterDiv = false;
    this.enabledField();
    this.formDirective.resetForm();
    this.isSubmitted = false;
    sessionStorage.removeItem("CONSTANTFILTERSESSION");
    this.result = false;
    this.search();
  }

  // Add / update function
  addAssetConstantData = function (flag) {
    this.isSubmitted = true;
    if (this.addConstantForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.constantMasterService.saveData(this.AssetConstantMasterData, headers, flag).subscribe(resp => {
      this.showLoading = false;
      this.successMessage = "Asset Constant " + flag + " successfully.";
      this.search();
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.formDirective.resetForm();
          this.isSubmitted = false;
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Asset Constant Master";
            this.enabledField();
          }
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Search function
  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.constantMasterService.getConstantList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      let constantFilterSession = new ConstantFilterSession();
      constantFilterSession.constantname = this.FilterData.constantname;
      sessionStorage.setItem('CONSTANTFILTERSESSION', JSON.stringify(constantFilterSession));
      this.result = !Object.values(constantFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.AssetConstantRecordData = new MatTableDataSource(resp);
      this.AssetConstantRecordData.sort = this.sort;
      this.AssetConstantRecordData.paginator = this.paginator;
      this.totalRecords = this.AssetConstantRecordData.filteredData.length;
      this.showLoading = false;
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

  // Get data by id
  editon = function (name) {
    this.list = false;
    this.edit = true;
    this.disabledField();
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PageTitle = "Update Asset Constant";
    this.constantMasterService.constantByName(name, headers).subscribe(resp => {
      this.showLoading = false;
      this.AssetConstantMasterData = resp;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  onDelete = function (name) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.constantMasterService.deleteAssetConstant(name, headers).subscribe(resp => {
            this.showLoading = false;
            this.successMessage = "Asset Constant deleted successfully.";
            this.search();
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

  clearFields = function () {
    this.AssetConstantMasterData = {
      "constantname": null, "term": null, "constantnamefor": null
    };
  }
  // Disabled Function
  disabledField = function () {
    this.addConstantForm.get('constantname').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addConstantForm.get('constantname').enable();
  }

  ngOnInit(): void {
    //Role Rights
    this.AssetConstantAdd = this._global.UserRights.includes("AssetConstantMaster_ADD");
    this.AssetConstantEdit = this._global.UserRights.includes("AssetConstantMaster_EDIT");
    this.AssetConstantView = this._global.UserRights.includes("AssetConstantMaster_VIEW");
    this.AssetConstantDelete = this._global.UserRights.includes("AssetConstantMaster_DELETE");
    this.addConstantForm = this.formBuilder.group({
      constantname: [null, Validators.required],
      term: [null, Validators.required],
      constantnamefor: [null, Validators.required]
    });

    //Assign Filter
    let constantFilterSession = JSON.parse(sessionStorage.getItem('CONSTANTFILTERSESSION'));
    if (sessionStorage.getItem('CONSTANTFILTERSESSION') != null) {
      this.FilterData.constantname = constantFilterSession.constantname;
    }
    if (constantFilterSession != null) {
      this.result = !Object.values(constantFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
  }
  get formControls() { return this.addConstantForm.controls; }
}