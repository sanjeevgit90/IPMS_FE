import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { VehicleServiceMasterService } from './vehicle-service-master.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-vehicle-service-master',
  templateUrl: './vehicle-service-master.component.html',
  providers: [VehicleServiceMasterService, AppGlobals, DialogService, SharedService]
})
export class VehicleServiceMasterComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private vehicleServiceMasterService: VehicleServiceMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['vehicleRegistrationNumber', 'servicePeriodFrom', 'servicePeriodTo', 'serviceStatus', 'nextServiceDueDate', 'action'];

  VehicleServiceMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  FilterData = {
    "vehicleRegistrationNumber": "",
    isdeleted: false
  };

  //isdeleted:false

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.VehicleServiceMasterData.filter = filterValue.trim().toLowerCase();
  }

  PageTitle = " Service Details";
  filterDiv: boolean = false;
  addVehicleService = function () {
    debugger;
    this.router.navigate(['/VehicleServiceMaster']);
  }

  filterFunc = function () {
    debugger;
    this.filterDiv = true;
  }
  cancel = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }

  search = function () {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.vehicleServiceMasterService.getVehicleServiceList(headers).subscribe(resp => {
      debugger;
      this.VehicleServiceMasterData = new MatTableDataSource(resp);
      this.VehicleServiceMasterData.sort = this.sort;
      this.VehicleServiceMasterData.paginator = this.paginator;
      this.totalRecords = this.VehicleServiceMasterData.filteredData.length;
      this.showLoading = false;


    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  deleteVehicleService = function (vehicleRegNo) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = vehicleRegNo;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.vehicleServiceMasterService.deleteVehicleService(id, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Vehicle deleted successfully.";
            this.search();
            // this.getActiveClassification();
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



  ngOnInit(): void {
    this.search();
  }

}


