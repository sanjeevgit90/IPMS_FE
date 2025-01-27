import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { AssetTPAService } from './assetTPA.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AssetMisFilterSession } from '../assetfilterdata';

@Component({
  selector: 'app-assetTPA',
  templateUrl: './assetTPA.component.html',
  providers: [AssetTPAService, AppGlobals, DialogService, SharedService]
})
export class AssetTPAComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private assetService: AssetTPAService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['Serial', 'location', 'subcategory', 'manufacturer', 'serialno', 'assetstatus',
    'projectname'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  
  statusList = this._global.assetStatusList;
  FilterData = {
    "projectid": null, "category": null, "subcategory": null,
    "state": null, "district": null, "assetstatus": null
  };
  PageTitle = "Asset List";
  filterDiv: boolean = false;
  selectAsset: boolean = false;
  addAssets = function () {
    debugger;
    this.router.navigate(['/addAsset']);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AssetRecord.filter = filterValue.trim().toLowerCase();
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
      this.FilterData.district = this.district.trim().toLowerCase();
      this.FilterData.state = this.state.trim().toLowerCase();
      this.getActiveDistrictFromstate(this.state);
      this.disable = true;
    }
    if (this.district != null) {
      this.getActiveCityFromDistrict(this.district);
    }
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
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCategory(headers).subscribe(resp => {
      debugger;
      this.categoryList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // subcategory List from category
  getActiveSubCategoryfromcategory = function (stateName) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveSubCategoryfromcategory(headers, stateName).subscribe(resp => {
      debugger;
      this.subcategoryList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // projectList
  getActiveProject = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // State List
  getActiveState = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getStateList(headers).subscribe(resp => {
      debugger;
      this.stateList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // district List
  getActiveDistrictFromstate = function (state) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getDistrictList(headers, state).subscribe(resp => {
      debugger;
      this.districtList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // City List
  getActiveCityFromDistrict = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCityListFromDistrict(headers, name).subscribe(resp => {
      debugger;
      this.cityList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // PoliceStation List
  getActivePoliceStationFromCity = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.getActiveLocationFromCity(name);
    this.sharedService.getActivePoliceStationFromCity(headers, name).subscribe(resp => {
      debugger;
      this.policestationList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Location List
  getActiveLocationFromPoliceStation = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveLocationFromPoliceStation(headers, name).subscribe(resp => {
      debugger;
      this.locationList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Location List
  getActiveLocationFromCity = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveLocationFromCity(headers, name).subscribe(resp => {
      debugger;
      this.locationList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.assetService.getAssetList(this.FilterData, headers).subscribe(resp => {
      debugger;
      // Set Filter
      debugger;
      let assetMisfilterSession = new AssetMisFilterSession();
      assetMisfilterSession.category = this.FilterData.category;
      assetMisfilterSession.subcategory = this.FilterData.subcategory;
      assetMisfilterSession.projectid = this.FilterData.projectid;
      assetMisfilterSession.state = this.FilterData.state;
      assetMisfilterSession.district = this.FilterData.district;
      assetMisfilterSession.assetstatus = this.FilterData.assetstatus;
      sessionStorage.setItem('ASSETMISFILTERSESSION', JSON.stringify(assetMisfilterSession));
      this.result = !Object.values(assetMisfilterSession).every(o => o === null || o === undefined || o === "");
      this.filterDiv = false;

      this.AssetRecord = new MatTableDataSource(resp);
      this.AssetRecord.sort = this.sort;
      this.AssetRecord.paginator = this.paginator;
      this.totalRecords = this.AssetRecord.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  state = null;
  district = null;
  disable: boolean = false;

  ngOnInit(): void {
    debugger;
    this.getActiveCategory();
    this.getActiveProject();
    this.getActiveState();
    if (this.district != null) {
      this.getActiveCityFromDistrict(this.district);
    }
    //  this.search();
    this.district = sessionStorage.getItem("selectedDistrict");
    this.state = sessionStorage.getItem("selectedState");
    if (this.district != null) {
      this.FilterData.district = this.district.trim().toLowerCase();
      this.FilterData.state = this.state.trim().toLowerCase();
      this.getActiveDistrictFromstate(this.state);
      this.disable = true;
    }
    if (this.district != null) {
      this.getActiveCityFromDistrict(this.district);
    }

    //Assign Filter
    let assetMisfilterSession = JSON.parse(sessionStorage.getItem('ASSETMISFILTERSESSION'));
    if (sessionStorage.getItem('ASSETMISFILTERSESSION') != null) {
      this.FilterData.category = assetMisfilterSession.category;
      this.FilterData.subcategory = assetMisfilterSession.subcategory;
      this.FilterData.projectid = assetMisfilterSession.projectid;
      this.FilterData.state = assetMisfilterSession.state;
      this.FilterData.district = assetMisfilterSession.district;
      this.FilterData.assetstatus = assetMisfilterSession.assetstatus;
      if (Object.keys(assetMisfilterSession).length === 0 && assetMisfilterSession.constructor === Object) {
        return;
      }
      else {
        this.search();
      }
    }
    if (assetMisfilterSession != null) {
      this.result = !Object.values(assetMisfilterSession).every(o => o === null || o === "");
    } else {
      this.result = false;
    }
  }
}
