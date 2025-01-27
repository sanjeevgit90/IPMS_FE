import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { AssetMasterService } from './../../AssetMaster/assetmaster.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-asearchsset',
  templateUrl: './searchasset.component.html',
  providers: [AssetMasterService, AppGlobals, DialogService, SharedService]
})

export class SearchAssetComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private assetService: AssetMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog,
    public dialogRef: MatDialogRef<SearchAssetComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }
  displayedColumns: string[] = ['selectvalue', 'assetname', 'serialno', 'category', 'productname'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
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
  selectedAsset = [];
  saveAsset = [];
  asset = { "selectedAsset": [], "saveAsset": [] };
  
  filterFunc = function () {
    this.getActiveCategory();
    this.getActiveProject();
    this.getActiveState();
    if (this.FilterData.district != null) {
      this.getActiveCityFromDistrict(this.FilterData.district);
    }
    this.filterDiv = true;
  }

  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
  }

  categoryList: any = [];
  subcategoryList: any = [];
  projectList: any = [];
  stateList: any = [];
  districtList: any = [];
  cityList: any = [];
  policestationList: any = [];
  locationList: any = [];
  flag: any;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AssetRecord.filter = filterValue.trim().toLowerCase();
  }

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
    this.sharedService.getActivePoliceStationFromCity(headers, name).subscribe(resp => {
      debugger;
      this.policestationList = resp;
      this.getActiveLocationFromCity(name);
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
    this.assetService.getDCAssetList(this.FilterData, headers, this.flag).subscribe(resp => {
      debugger;
      this.AssetRecord = new MatTableDataSource(resp);
      this.AssetRecord.sort = this.sort;
      this.AssetRecord.paginator = this.paginator;
      this.totalRecords = this.AssetRecord.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  setValue = function (value, Obj) {
    debugger;
    this.item = {};
    this.item.entityId = Obj.entityId;
    this.item.assetname = Obj.assetname;
    this.item.serialno = Obj.serialno;
    this.item.category = Obj.category;
    this.item.productname = Obj.productname;
    this.item1 = {};
    this.item1.entityId = Obj.entityId;
    if (value == true) {
      debugger;
      this.selectedAsset.push(this.item);
      this.saveAsset.push(this.item1);
    }
    else {
      debugger;
      this.selectedAsset.pop(this.item);
      this.saveAsset.pop(this.item1);
    }
    this.asset.selectedAsset = this.selectedAsset;
    this.asset.saveAsset = this.saveAsset;
  }

  addSelected = function () {
    debugger;
    this.dialogRef.close({ event: 'ADD', data: this.asset });
  }

  back = function () {
    this.dialogRef.close(false);
  }

  district: String = null;
  state: String = null;
  disable: boolean = false;
  ngOnInit(): void {
    this.FilterData.projectid = this.data.projectname;
    if (this.data.flag != null) {
      this.flag = this.data.flag;
    }
    this.district = sessionStorage.getItem("selectedDistrict");
    this.state = sessionStorage.getItem("selectedState");
    if (this.district != null) {
      this.FilterData.district = this.district.trim().toLowerCase();
      this.FilterData.state = this.state.trim().toLowerCase();
      this.disable = true;
    }
    this.search();
  }
}