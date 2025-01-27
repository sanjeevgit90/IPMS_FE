import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { CityService } from './city.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  providers: [CityService, AppGlobals, DialogService, SharedService]

})
export class CityComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private cityService: CityService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['cityname', 'citycode', 'state', 'district', 'action'];
  CityMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;


  showLoading: boolean = false;
  FilterData = {
    "citycode": null
  };
  filterDiv: boolean = false;
  filterFunc = function () {
    debugger;
    this.filterDiv = true;
  }
  closeFilter = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }


  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "City Master";
  add: boolean = true;
  edit: boolean = false;
  list: boolean = true;
  cityAdd: boolean = false;
  cityEdit: boolean = false;
  cityDelete: boolean = false;
  CityData = {
    "citycode": ""
  };
  stateList: any = [];
  districtList: any = [];
  formatData = {};
  CityName = "";
  StateName = "";
  DistrictName = "";

  addCityForm: FormGroup;
  isSubmitted = false;

  
  applyFilter(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.CityMasterData.filter = filterValue.trim().toLowerCase();
  }


  cancel = function () {
    this.list = true;
    this.edit = false;
    this.formDirective.resetForm();
    this.isSubmitted = false;
    this.PageTitle = "City Master";
    this.enabledField();
  }




  onDelete = function (name, district, state) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';

    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.cityService.deleteCityByid(name, district, state, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.formDirective.resetForm();
            this.isSubmitted = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }


      })
  }

  // State List

  getAllState = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getStateList(headers).subscribe(resp => {
      debugger;
      this.stateList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // State List

  getAllDistrictByState = function (stateName) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDistrictList(headers, stateName).subscribe(resp => {
      debugger;
      this.districtList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  addCity = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addCityForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.formatData.cityname = this.CityName;
    this.formatData.state = this.StateName;
    this.formatData.district = this.DistrictName;
    this.CityData.id = this.formatData;
    this.showLoading = true;
    this.cityService.saveCity(this.CityData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "City " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.GeographyData = {};
          //this.addCityForm.reset()
          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "City Master";
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

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.cityService.getCityList(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.CityMasterData = new MatTableDataSource(resp);
      this.CityMasterData.filterPredicate = (data: any, filter) => {
        const dataStr =JSON.stringify(data).toLowerCase();
        return dataStr.indexOf(filter) != -1; 
      }

      this.CityMasterData.sort = this.sort;
      this.CityMasterData.paginator = this.paginator;
      this.totalRecords = this.CityMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get data by id
  editon = function (name, district, state) {
    debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PageTitle = "Update City";
    this.disabledField();
    this.cityService.CityById(name, district, state, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.CityData = resp;
      this.CityName = this.CityData.id.cityname;
      this.StateName = this.CityData.id.state;
      this.DistrictName = this.CityData.id.district;

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Disabled Function
  disabledField = function () {
    this.addCityForm.get('cityname').disable();
    this.addCityForm.get('state').disable();
    this.addCityForm.get('district').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addCityForm.get('cityname').enable();
    this.addCityForm.get('state').enable();
    this.addCityForm.get('district').enable();
  }

  ngOnInit(): void {


    //Role Rights
    this.cityEdit = this._global.UserRights.includes("City_Master_EDIT");
    this.cityDelete = this._global.UserRights.includes("City_Master_DELETE");
    this.cityAdd = this._global.UserRights.includes("City_Master_ADD");


    this.addCityForm = this.formBuilder.group({
      cityname: ['', Validators.required],
      citycode: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required]
    });
    this.getAllState();
    this.search();
  }
  get formControls() { return this.addCityForm.controls; }
}
