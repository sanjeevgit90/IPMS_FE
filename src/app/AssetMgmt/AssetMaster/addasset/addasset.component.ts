import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { AssetMasterService } from '../assetmaster.service';
import { SharedService } from '../../../service/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addasset',
  templateUrl: './addasset.component.html',
  providers: [AssetMasterService, AppGlobals, DialogService, SharedService]
})
export class AddAssetComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private assetService: AssetMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }


  showLoading: boolean = false;
  disable = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;



  PageTitle = "Add Asset";
  add = true;
  edit = false;
  list = true;

  view = false;

  AssetData = {
    "assetname": null, "serialno": null, "assettag": null,
    "deliverychallanno": null, "depreciation": null, "eol": null,
    "location": null, "notes": null, "orderno": null,
    "productid": null, "projectname": null, "purchasedate": null,
    "assetstatus": null, "vendorname": null, "warrantytilldate": null, "entityId": null,"isprimary":false
  };

  state = null;
  district = null;
  city = null;
  policestation = null;
  category = null;
  subcategory = null;

  categoryList: any = [];
  subcategoryList: any = [];
  projectList: any = [];
  productList: any = [];
  partyList: any = [];
  eolList: any = [];
  depreciationList: any = [];
  stateList: any = [];
  districtList: any = [];
  cityList: any = [];
  policestationList: any = [];
  locationList: any = [];

  statusList = this._global.assetStatusList;
  addAssetForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.router.navigate(['/searchAsset']);
  }

  compareObjects(o1: any, o2: any): boolean {
   // return o1.name == o2.name && o1.id == o2.id;
   return o1 == o2;
  }
  compareUser(o1: any, o2: any): boolean {
    return o1 == o2;
  }
  // category List

  getActiveCategory = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveCategory(headers).subscribe(resp => {
      debugger;
      this.categoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // subcategory List from category

  getActiveSubCategoryfromcategory = function (Name) {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveSubCategoryfromcategory(headers, Name).subscribe(resp => {
      debugger;
      this.subcategoryList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // productList
  getActiveProduct = function (name) {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveProductfromsubcategory(headers, name).subscribe(resp => {
      debugger;
      this.productList = resp;
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
    this.showLoading = true;
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
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

  // EOL List

  getActiveEol = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveEol(headers).subscribe(resp => {
      debugger;
      this.eolList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Depreciation List

  getActiveDepreciation = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveDepreciation(headers).subscribe(resp => {
      debugger;
      this.depreciationList = resp;
      this.showLoading = false;
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
    this.showLoading = true;
    this.sharedService.getStateList(headers).subscribe(resp => {
      debugger;
      this.stateList = resp;
      this.showLoading = false;
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

  getActiveCityFromDistrict = function (district) {
    debugger;
    if (district == null) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCityListFromDistrict(headers, district).subscribe(resp => {
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
    if (name == null) {
      return;
    }
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
    if (name == null) {
      return;
    }
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
    if (name == null) {
      return;
    }
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


  addAsset = function (flag) {
    debugger;
    this.isSubmitted = true;
    this.AssetData.purchasedate = this.AssetData.purchasedate.getTime();
    this.AssetData.warrantytilldate = this.AssetData.warrantytilldate.getTime();

    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addAssetForm.invalid) {
      return;
    }

    this.showLoading = true;
    this.assetService.saveAssetData(this.AssetData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Asset " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.router.navigate(['/searchAsset']);
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.AssetData.warrantytilldate = (new Date(this.AssetData.warrantytilldate));
      this.AssetData.purchasedate = (new Date(this.AssetData.purchasedate));
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  clearfields = function () {
    this.AssetData = {
      "assetname": null, "serialno": null, "assettag": null,
      "deliverychallanno": null, "depreciation": null, "eol": null,
      "location": null, "notes": null, "orderno": null,
      "productid": null, "projectname": null, "purchasedate": null,
      "assetstatus": null, "vendorname": null, "warrantytilldate": null, "entityId": null
    };
    this.state = null;
    this.district = null;
    this.city = null;
    this.policestation = null;
    this.category = null;
    this.subcategory = null;
  }
  // Edit

  editon = function (id, flag) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.assetService.assetById(id, headers, flag).subscribe(resp => {
      debugger;

      this.tempRes = resp;
      this.AssetData.entityId = this.tempRes.entityId;
      this.AssetData.assetname = this.tempRes.assetname;
      this.AssetData.serialno = this.tempRes.serialno;
      this.AssetData.assettag = this.tempRes.assettag;
      this.AssetData.deliverychallanno = this.tempRes.deliverychallanno;
      this.AssetData.depreciation = this.tempRes.depreciation;
      this.AssetData.eol = this.tempRes.eol;
      this.AssetData.notes = this.tempRes.notes;
      this.AssetData.orderno = this.tempRes.orderno;
      this.AssetData.productid = this.tempRes.productid;
      this.AssetData.projectname = this.tempRes.projectid;
      this.AssetData.assetstatus = this.tempRes.assetstatus;
      this.AssetData.vendorname = this.tempRes.vendorname;
      this.AssetData.isprimary = this.tempRes.isprimary;

      if (this.tempRes.warrantytilldate > 0) {
        this.AssetData.warrantytilldate = (new Date(this.tempRes.warrantytilldate));
      }
      else {
        this.AssetData.warrantytilldate = null;
      }

      if (this.tempRes.purchasedate > 0) {
        this.AssetData.purchasedate = (new Date(this.tempRes.purchasedate));
      }
      else {
        this.AssetData.purchasedate = null;
      }



      this.getActiveSubCategoryfromcategory(this.tempRes.category);
      this.getActiveProduct(this.tempRes.subcategory);
      this.getActiveDistrictFromstate(this.tempRes.state);
      this.getActiveCityFromDistrict(this.tempRes.district);
      this.getActivePoliceStationFromCity(this.tempRes.city);
      this.getActiveLocationFromCity(this.tempRes.city);
      this.AssetData.location = this.tempRes.location;
      this.category = this.tempRes.category;
      this.subcategory = this.tempRes.subcategory;
      this.state = this.tempRes.state;
      this.district = this.tempRes.district;
      this.city = this.tempRes.city;
      this.policestation = this.tempRes.policestation
      if (flag == 'view') {
        debugger;
        this.edit = false;
        this.add = false;
      }
      else if (flag == 'add') {
        this.add = true;
        this.edit = false;
      }
      else {
        this.edit = true;
        this.add = false;
      }
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  disableAll = function () {
    this.addAssetForm.get('assetname').disable();
    this.addAssetForm.get('serialno').disable();
    this.addAssetForm.get('assettag').disable();
    this.addAssetForm.get('productid').disable();
    this.addAssetForm.get('depreciation').disable();
    this.addAssetForm.get('category').disable();
    this.addAssetForm.get('subcategory').disable();
    this.addAssetForm.get('eol').disable();
    this.addAssetForm.get('projectname').disable();
    this.addAssetForm.get('vendorname').disable();
    this.addAssetForm.get('purchasedate').disable();
    this.addAssetForm.get('warrantytilldate').disable();
    this.addAssetForm.get('location').disable();
    this.addAssetForm.get('state').disable();
    this.addAssetForm.get('district').disable();
    this.addAssetForm.get('city').disable();
    this.addAssetForm.get('policestation').disable();
    this.addAssetForm.get('orderno').disable();
    this.addAssetForm.get('deliverychallanno').disable();
    this.addAssetForm.get('notes').disable();
    this.addAssetForm.get('assetstatus').disable();
    this.addAssetForm.get('isprimary').disable();
  }

  disableForTeamLeader = function () {
    this.addAssetForm.get('assetname').disable();
    this.addAssetForm.get('serialno').disable();
    this.addAssetForm.get('productid').disable();
    this.addAssetForm.get('depreciation').disable();
    this.addAssetForm.get('category').disable();
    this.addAssetForm.get('subcategory').disable();
    this.addAssetForm.get('eol').disable();
    this.addAssetForm.get('projectname').disable();
    this.addAssetForm.get('vendorname').disable();
    this.addAssetForm.get('purchasedate').disable();
    this.addAssetForm.get('warrantytilldate').disable();
    this.addAssetForm.get('state').disable();
    this.addAssetForm.get('district').disable();
    this.addAssetForm.get('orderno').disable();
    this.addAssetForm.get('deliverychallanno').disable();
    this.addAssetForm.get('isprimary').disable();
  }

  hideState: boolean = false;

  ngOnInit(): void {
    this.getActiveCategory();
    this.getActiveEol();
    this.getActiveDepreciation();
    this.getActiveProject();
    this.getActiveState();
    this.getActiveVendors();

    this.addAssetForm = this.formBuilder.group({
      assetname: [null, Validators.required],
      serialno: [null, Validators.required],
      assettag: [null],
      productid: [null, Validators.required],
      depreciation: [null],
      category: [null, Validators.required],
      subcategory: [null, Validators.required],
      eol: [null, Validators.required],
      projectname: [null, Validators.required],
      vendorname: [null, Validators.required],
      purchasedate: [null, Validators.required],
      warrantytilldate: [null, Validators.required],
      assetstatus: [null, Validators.required],
      location: [null, Validators.required],
      state: [null, Validators.required],
      district: [null, Validators.required],
      city: [null, Validators.required],
      policestation: [null],
      orderno: [null],
      deliverychallanno: [null],
      notes: [null],
      isprimary: [false],
    });


    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Asset";
      this.editon(this.route.snapshot.params.id, 'edit');
    }
    else
      if (this.route.snapshot.params.page == 'view') {
        this.PageTitle = "View Asset";
        this.disableAll();
        this.editon(this.route.snapshot.params.id, 'view');

      }

    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");

    if (district != null) {
      this.district = district;
      this.state = state;
      this.getActiveDistrictFromstate(state);
      this.getActiveCityFromDistrict(district);
      this.disableForTeamLeader();
    }


  }
  get formControls() {
    return this.addAssetForm.controls;
  }

}

