import { Component, OnInit, ViewChild, Inject, Optional, ɵbypassSanitizationTrustStyle } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { AssetMasterService } from './assetmaster.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AssetAuditComponent } from './assetaudit/assetaudit.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetFilterSession } from '../assetfilterdata';


@Component({
  selector: 'app-asset',
  templateUrl: './assetmaster.component.html',
  providers: [AssetMasterService, AppGlobals, DialogService, SharedService]
})
export class AssetMasterComponent implements OnInit {

  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private assetService: AssetMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }

  displayedColumns: string[] = ['assetname', 'location', 'district', 'subcategory','assetstatus', 'action'];

  exportColumns: string[] = ['assetname', 'serialno', 'assettag', 'category', 'subcategory', 'manufacturer',
    'model', 'productname', 'depreciation', 'eol', 'location', 'city', 'district', 'state', 'vendor', 'account', 'warrantytilldate',
    'purchasedate', 'orderno', 'deliverychallanno', 'assetstatus'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  AssetDataExport: any = [];
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  FilterData = {
    "assetname": null, "serialno": null, "assettag": null, "projectid": null, "category": null, "subcategory": null,
    "state": null, "district": null, "city": null, "policestation": null, "location": null
  };

  PageTitle = "Asset List";
  filterDiv: boolean = false;
  selectAsset: boolean = false;
  assetAdd: boolean = false;
  assetEdit: boolean = false;
  assetView: boolean = false;
  assetDelete: boolean = false;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AssetRecord.filter = filterValue.trim().toLowerCase();
  }

  addAssets = function () {
    this.router.navigate(['/addAsset']);
  }
  filterFunc = function () {
      this.filterDiv = true;
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("ASSETFILTERSESSION");
    this.result = false;
    this.district = sessionStorage.getItem("selectedDistrict");
    this.state = sessionStorage.getItem("selectedState");
    if (this.district != null) {
      this.FilterData.district = this.district.trim();
      this.FilterData.state = this.state.trim();
      this.disable = true;
      this.getActiveDistrictFromstate(this.FilterData.state);
      this.result = true;
    }
    if (this.district != null) {
      this.getActiveCityFromDistrict(this.district);
    }
    //this.search();
  }

  categoryList: any = [];
  subcategoryList: any = [];
  projectList: any = [];
  stateList: any = [];
  districtList: any = [];
  cityList: any = [];
  policestationList: any = [];
  locationList: any = [];

  // category List

  getActiveCategory = function () {

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCategory(headers).subscribe(resp => {

      this.categoryList = resp;
    }, (error: any) => {

      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // subcategory List from category

  getActiveSubCategoryfromcategory = function (stateName) {

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveSubCategoryfromcategory(headers, stateName).subscribe(resp => {

      this.subcategoryList = resp;
    }, (error: any) => {

      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // projectList
  getActiveProject = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      this.projectList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // State List

  getActiveState = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getStateList(headers).subscribe(resp => {
      this.stateList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // district List
  getActiveDistrictFromstate = function (state) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getDistrictList(headers, state).subscribe(resp => {
      this.districtList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // City List
  getActiveCityFromDistrict = function (name) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCityListFromDistrict(headers, name).subscribe(resp => {
      this.cityList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getActiveCity = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getCityList(headers, name).subscribe(resp => {
      this.cityList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // PoliceStation List
  getActivePoliceStationFromCity = function (name) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.getActiveLocationFromCity(name);
    this.sharedService.getActivePoliceStationFromCity(headers, name).subscribe(resp => {
      this.policestationList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Location List

  getActiveLocationFromPoliceStation = function (name) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveLocationFromPoliceStation(headers, name).subscribe(resp => {
      this.locationList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Location List
  getActiveLocationFromCity = function (name) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveLocationFromCity(headers, name).subscribe(resp => {
      this.locationList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    debugger;
    this.assetService.getAssetList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      debugger;
      let assetfilterSession = new AssetFilterSession();
      assetfilterSession.assetname = this.FilterData.assetname;
      assetfilterSession.category = this.FilterData.category;
      assetfilterSession.projectid = this.FilterData.projectid;
      assetfilterSession.state = this.FilterData.state;
      assetfilterSession.district = this.FilterData.district;
      assetfilterSession.city = this.FilterData.city;
      assetfilterSession.location = this.FilterData.location;
      sessionStorage.setItem('ASSETFILTERSESSION', JSON.stringify(assetfilterSession));
      this.result = !Object.values(assetfilterSession).every(o => o === null || o === undefined|| o === "");
      this.filterDiv = false;
      this.AssetDataExport = resp.content;
      this.AssetRecord = new MatTableDataSource(resp.content);
      this.AssetRecord.sort = this.sort;
      this.AssetRecord.paginator = this.paginator;
      this.totalRecords = resp.totalElements;
      this.showLoading = false;
    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  //delete Category

  onDelete = function (name) {

    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var experienceId = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.assetService.deleteAsset(experienceId, headers).subscribe(resp => {

            this.showLoading = false;
            this.successMessage = "Asset deleted successfully.";
            this.search();
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {
              })

          }, (error: any) => {

            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }

  AssetAuditRecord = [];

  openAuditData = function (name) {

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.assetService.assetAudit(name, headers).subscribe(resp => {

      this.AssetAuditRecord = resp;
      //  this.auditService.openAudit(this.AssetAuditRecord);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      dialogConfig.data = this.AssetAuditRecord;
      this.dialog.open(AssetAuditComponent, dialogConfig).afterClosed().subscribe(res => {
      })
      this.showLoading = false;
    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  openAudit = function (name) {

    this.openAuditData(name);


  }

  district: String = null;
  state: String = null;
  disable: boolean= false;

  ngOnInit(): void {
    this.getActiveState();
    this.getActiveCategory();
    this.getActiveProject();
    
    this.district = sessionStorage.getItem("selectedDistrict");
    this.state = sessionStorage.getItem("selectedState");
    if (this.district != null) {
      this.FilterData.district = this.district.trim();
      this.FilterData.state = this.state.trim();
      this.disable = true;
      this.getActiveDistrictFromstate(this.FilterData.state);
    }
    if (this.district != null) {
      this.getActiveCityFromDistrict(this.district);
    }
    //Role Rights
    this.assetAdd = this._global.UserRights.includes("Asset_Master_ADD");
    this.assetEdit = this._global.UserRights.includes("Asset_Master_EDIT");
    this.assetView = this._global.UserRights.includes("Asset_Master_VIEW");
    this.assetDelete = this._global.UserRights.includes("Asset_Master_DELETE");
   
    //Assign Filter
    let assetfilterSession = JSON.parse(sessionStorage.getItem('ASSETFILTERSESSION'));
    if (sessionStorage.getItem('ASSETFILTERSESSION') != null) {
      this.FilterData.assetname = assetfilterSession.assetname;
      this.FilterData.category = assetfilterSession.category;
      this.FilterData.projectid = assetfilterSession.projectid;
      this.FilterData.state = assetfilterSession.state;
      this.FilterData.district = assetfilterSession.district
      this.FilterData.city = assetfilterSession.city
      this.FilterData.location = assetfilterSession.location
      if (Object.keys(assetfilterSession).length === 0 && assetfilterSession.constructor === Object) {
        return;
      }
      else{
        this.search();
      }
    }
    if (assetfilterSession != null) { 
      this.result = !Object.values(assetfilterSession).every(o => o === null || o === "");
    } else {
      this.result = false;
    }

    // this.search();

  }



}
