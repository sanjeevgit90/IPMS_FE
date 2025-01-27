import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CityInstallationReportService } from '../cityassetinstallation.service';

@Component({
  selector: 'app-addcityassetinstallation',
  templateUrl: './addcityassetinstallation.component.html',
  providers: [CityInstallationReportService, AppGlobals, DialogService, SharedService]
})
export class AddCityInstallationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private reportService: CityInstallationReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;

  displayedColumns: string[] = ['sno', 'product', 'count'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  enableCity: boolean = false;

  displayedColumns1: string[] = ['selectionvalue'];
  CityMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) citySort: MatSort;
  @ViewChild(MatPaginator, { static: true }) CityPaginator: MatPaginator;
  totalRecordsCity: any;
  PageTitle = "Generate City Installation Report";
  add = true;
  edit = false;
  list = true;

  ReportData = {
    "city": null, "poreferenceno": null, "pono": null, "podate": null, "customerdepartment": null, "district": null, "state": null,
    "project": null, "remark": null, "installationdate": null, "contactperson": null,
    "designation": null, "address": null, "telno": null, "installationMasterChild": [], "installationattachment": null
  };

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }
  projectList: any = [];
  cityList: any = [];
  searchCity = '';
  districtList: any = [];
  stateList: any = [];

  addCityForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.router.navigate(['/searchCityInstallationReport']);
  }

  enableReport: boolean = false;
  applyFilterCity(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.CityMasterData.filter = filterValue.trim().toLowerCase();
  }


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
  // projectList
  getActiveDistrictFromstate = function (state) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getDistrictList(headers, state).subscribe(resp => {
      debugger;
      this.districtList = resp;
      this.enableCity = true;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAssetDataFromCity = function (city) {
    debugger;
    this.ReportData.city = city;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.reportService.getAssetDataFromCity(city, headers).subscribe(resp => {
      debugger;
      this.AssetRecord = resp;
      //   this.table.renderRows();
      this.enableReport = true;
      this.getActiveProject();
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


  addReport = function (flag) {
    debugger;
    this.isSubmitted = true;
    this.ReportData.installationdate = this.ReportData.installationdate.getTime();
    this.ReportData.podate = this.ReportData.podate.getTime();

    if (this.AssetRecord != null) {
      this.ReportData.installationMasterChild = this.AssetRecord;
    }
    else {
      const errStr = "Can't Generate Report:No Data in Asset List";
      this.dialogService.openConfirmDialog(errStr)
      return;
    }

    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addCityForm.invalid) {
      return;
    }

    this.showLoading = true;
    this.reportService.saveReport(this.ReportData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Installation Report is " + flag + "d successfully.";
      this.AssetRecord = [];
      this.router.navigate(['/searchCityInstallationReport']);
      // this.table.renderRows();
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.clearfields();

        })

    }, (error: any) => {
      debugger;
      this.ReportData.installationdate = (new Date(this.ReportData.installationdate));
      this.ReportData.podate = (new Date(this.ReportData.podate));
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  clearfields = function () {
    this.ReportData = {
      "city": null, "poreferenceno": null, "pono": null, "podate": null, "customerdepartment": null,
      "project": [], "remark": null, "installationdate": null, "contactperson": null,
      "designation": null, "address": null, "telno": null, "installationMasterChild": [], "installationattachment": null
    };
  }


  // Edit

  editon = function (id, flag) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.getActiveProject();
    this.reportService.reportById(id, headers, flag).subscribe(resp => {
      debugger;
      this.enableReport = true;
      this.showLoading = false;
      this.ReportData = resp;
      if (this.ReportData.installationdate > 0)
      {
        this.ReportData.installationdate = (new Date(this.ReportData.installationdate));
      }
      else
      {
        this.ReportData.installationdate= null;
      }

      if (this.ReportData.podate > 0)
      {
        this.ReportData.podate = (new Date(this.ReportData.podate));
      }
      else
      {
        this.ReportData.podate= null;
      }
      this.AssetRecord = this.ReportData.installationMasterChild;
      //this.table.renderRows();
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  getActiveCityFromDistrict = function (district) {
    debugger;
    if (district == null) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCityListFromDistrict(headers, district).subscribe(resp => {
      debugger;
      this.cityList = resp;
      this.CityMasterData = new MatTableDataSource(resp);
      this.CityMasterData.sort = this.citySort;
      this.CityMasterData.paginator = this.cityPaginator;
      this.totalRecordsCity = this.CityMasterData.filteredData.length;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  disable: boolean = false;
  ngOnInit(): void {


    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.ReportData.district = district.trim().toLowerCase();
      this.ReportData.state = state.trim().toLowerCase();
      this.getActiveCityFromDistrict(district);
    }

    this.getActiveState();

    debugger;
    this.addCityForm = this.formBuilder.group({
      city: [null],
      poreferenceno: [null],
      pono: [null, Validators.required],
      project: [null, Validators.required],
      podate: [null, Validators.required],
      installationdate: [null, Validators.required],
      customerdepartment: [null],
      contactperson: [null],
      telno: [null],
      address: [null],
      designation: [null],
      remark: [null],
      installationattachment: [null],
      district: [null],
      state: [null]
    });
    debugger;

    if (this.route.snapshot.params.page == 'edit') {
      debugger;
      this.PageTitle = "Update City Asset Installation Report";
      this.editon(this.route.snapshot.params.id, 'edit');

    }


  }
  get formControls() {
    return this.addCityForm.controls;
  }


}
