import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { VehicleMasterService } from './vehicle-master.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VehicleFilterSession } from '../helpdeskfilterdata';
@Component({
  selector: 'app-vehicle-master',
  templateUrl: './vehicle-master.component.html',
  providers: [VehicleMasterService, AppGlobals, DialogService, SharedService]
})
export class VehicleMasterComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private vehicleMasterService: VehicleMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['vehicleType', 'vehicleName', 'vehicleRegNumber', 'vehiclepurchaseDate', 'vehicleInsurance', 'pollutionClearanceDone', 'action'];
  VehicleMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  FilterData = {
    "vehicleType": "", "vehicleName": "", "vehicleRegNumber": "",
    isdeleted: false
  };
  PageTitle = "Vehicle Details";
  filterDiv: boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.VehicleMasterData.filter = filterValue.trim().toLowerCase();
  }
  addVehicle = function () {
    this.router.navigate(['/VehicleMaster']);
  }
  filterFunc = function () {
    this.filterDiv = true;
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("VEHICLEFILTERSESSION");
    this.result = false;
    this.search();
  }
  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.FilterData.confirmed = true;
    this.vehicleMasterService.getVehicleList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      let vehicleFilterSession = new VehicleFilterSession();
      vehicleFilterSession.vehicleType = this.FilterData.vehicleType;
      vehicleFilterSession.vehicleName = this.FilterData.vehicleName;
      vehicleFilterSession.vehicleRegNumber = this.FilterData.vehicleRegNumber;
      sessionStorage.setItem('VEHICLEFILTERSESSION', JSON.stringify(vehicleFilterSession));
      this.result = !Object.values(vehicleFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.VehicleMasterData = new MatTableDataSource(resp);
      this.VehicleMasterData.sort = this.sort;
      this.VehicleMasterData.paginator = this.paginator;
      this.totalRecords = this.VehicleMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  deleteVehicle = function (vehicleRegNo) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = vehicleRegNo;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.vehicleMasterService.deleteVehicle(id, headers).subscribe(resp => {
            this.showLoading = false;
            this.successMessage = "Vehicle deleted successfully.";
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
  ngOnInit(): void {     
    //Assign Filter
    let vehicleFilterSession = JSON.parse(sessionStorage.getItem('VEHICLEFILTERSESSION'));
    if (sessionStorage.getItem('VEHICLEFILTERSESSION') != null) {
      this.FilterData.vehicleType = vehicleFilterSession.vehicleType;
      this.FilterData.vehicleName = vehicleFilterSession.vehicleName;
      this.FilterData.vehicleRegNumber = vehicleFilterSession.vehicleRegNumber;
    }
    if (vehicleFilterSession != null) {
      this.result = !Object.values(vehicleFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
  }
}