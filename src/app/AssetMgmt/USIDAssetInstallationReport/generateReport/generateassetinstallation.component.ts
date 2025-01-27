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
import { USIDInstallationReportService } from '../USIDassetinstallation.service';


@Component({
  selector: 'app-generateassetinstallation',
  templateUrl: './generateassetinstallation.component.html',
  providers: [USIDInstallationReportService, AppGlobals, DialogService, SharedService]
})
export class AddUSIDInstallationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private reportService: USIDInstallationReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;

  displayedColumns: string[] = ['sno', 'product', 'manufacturer', 'model', 'serialno', 'count', 'status'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //  @ViewChild('mytable') table: MatTable<Element>;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "Generate USID Installation Report";
  add = true;
  edit = false;
  list = true;

  ReportData = {
    "location": null, "policestation": null, "locationaddress": null, "project": null, "district": null,
    "remark": null, "installationdate": null, "installationMasterChild": [], "installationattachment": null
  };
  cityList: any = [];

  enableLocation: boolean = false;
  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }
  projectList: any = [];
  locationList: any = [];
  searchLocation: String = '';

  addCityForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.router.navigate(['/searchInstallationReport']);
  }

  enableReport: boolean = false;


  displayedColumns1: string[] = ['selectionvalue'];
  CityMasterData: MatTableDataSource<any>;

  LocationMasterData: MatTableDataSource<any>;

  displayedColumns2: string[] = ['selectionvalue'];

  applyFilterCity(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.CityMasterData.filter = filterValue.trim().toLowerCase();
  }

  applyFilterLoc(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.LocationMasterData.filter = filterValue.trim().toLowerCase();
  }

  // projectList

  getActiveCity = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };

    this.sharedService.getCityList(headers).subscribe(resp => {
      debugger;
      this.cityList = resp;
      this.CityMasterData = new MatTableDataSource(resp);

    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getActiveLocationFromCity = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.ReportData.city = name;
    this.reportService.getLocationList(name, headers).subscribe(resp => {
      debugger;
      this.locationList = resp;
      this.LocationMasterData = new MatTableDataSource(resp);

      this.enableLocation = true;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getLocationData = function (location) {
    debugger;
    // this.RecordData.location= location;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.reportService.getLocationData(location, headers).subscribe(resp => {
      debugger;
      this.Data = resp;
      this.ReportData.location = this.Data.locationid;
      this.ReportData.locationaddress = this.Data.locationaddress + " " + this.Data.zip;
      this.ReportData.policestation = this.Data.policestation;
      this.ReportData.district = this.Data.district;
      this.ReportData.state = this.Data.state;
      // this.table.renderRows();
      this.enableReport = true;
      this.getActiveProject();
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAssetDataFromLocation = function (location) {
    debugger;
    this.ReportData.location = location;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.getLocationData(location);
    this.reportService.getAssetDataFromLocation(location, headers).subscribe(resp => {
      debugger;

      this.AssetRecord = resp;

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
      this.successMessage = "Installation Report is " + flag + "ed successfully.";
      this.AssetRecord = [];

      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.clearfields();

        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  clearfields = function () {
    this.ReportData = {
      "location": null, "policestation": null, "locationaddress": null, "project": null,
      "remark": null, "installationdate": null, "installationMasterChild": [], "installationattachment": null
    };
  }


  // Edit

  editon = function (id, flag) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.reportService.reportById(id, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.getActiveProject();
      this.enableReport = true;
      this.ReportData = resp;
      if (this.ReportData.installationdate > 0) {
        this.ReportData.installationdate = (new Date(this.ReportData.installationdate));
      }
      else {
        this.ReportData.installationdate = null;
      }
      
      this.AssetRecord = this.ReportData.installationMasterChild;

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

    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  ngOnInit(): void {
    var district = sessionStorage.getItem("selectedDistrict");
    if (district != null) {
      this.getActiveCityFromDistrict(district);
    }
    else {
      this.getActiveCity();
    }
    debugger;
    this.addCityForm = this.formBuilder.group({
      location: [null],
      project: [null, Validators.required],
      installationdate: [null, Validators.required],
      locationaddress: [null],
      policestation: [null],
      remark: [null],
      installationattachment: [null]
    });
    debugger;

    if (this.route.snapshot.params.page == 'edit') {
      debugger;
      this.PageTitle = "Update USID Asset Installation Report";
      this.editon(this.route.snapshot.params.id, 'edit');

    }


  }
  get formControls() {
    return this.addCityForm.controls;
  }


}
