import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { CityInstallationReportService } from './cityassetinstallation.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewCityInstallationReport } from './viewReport/viewCityInstallationReport.component';


@Component({
  selector: 'app-cityassetinstallation',
  templateUrl: './cityassetinstallation.component.html',
  providers: [CityInstallationReportService, AppGlobals, DialogService, SharedService]
})
export class CityInstallationComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private reportService: CityInstallationReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }

  displayedColumns: string[] = ['city', 'poreferenceno', 'pono', 'installationdate', 'contactperson', 'designation', 'action'];
  CityReportRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  FilterData = {
    "project": null, "city": null, "poreferenceno": null,
    "pono": null, "installationdate": null, "district": null, "state": null
  };
  //, "fromdate":null, "toDate":null};

  PageTitle = "City Asset Installation Report List";
  filterDiv: boolean = false;


  addReport = function () {
    debugger;
    this.router.navigate(['/addCityInstallationReport']);
  }

  filterFunc = function () {
    debugger;
    this.getActiveProject();
    this.filterDiv = true;
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim().toLowerCase();
      this.FilterData.state = state.trim().toLowerCase();
      this.getActiveCityFromDistrict( this.FilterData.state);
    }
  }
  projectList: any = [];



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

  search = function () {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.reportService.getReportList(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.CityReportRecord = new MatTableDataSource(resp);
      this.CityReportRecord.sort = this.sort;
      this.CityReportRecord.paginator = this.paginator;
      this.totalRecords = this.CityReportRecord.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  //delete 

  onDelete = function (name) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.reportService.deleteReport(id, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Report is deleted successfully.";
            this.search();
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {
              })

          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }

  viewReport = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    dialogConfig.data = this.data;
    this.dialog.open(ViewCityInstallationReport, dialogConfig).afterClosed().subscribe(res => {
      debugger;

    })
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
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    debugger;

    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.FilterData.district = district.trim().toLowerCase();
      this.FilterData.state = state.trim().toLowerCase();
    }
    this.search();
  }



}
