import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { LocationService } from './location.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MasterFilterSession } from '../UniqueSiteIdFilterData';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  providers: [LocationService, AppGlobals, DialogService, SharedService]
})
export class LocationComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private locationService: LocationService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['locationid', 'contactperson', 'phoneno', 'state', 'city', 'isprioritysite', 'action'];
  LocationMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  FilterData = { "locationid": "", "policestation": "" };
  PageTitle = "Unique Site ID Details";
  filterDiv: boolean = false;
  //User Rgiht Declaration
  locationEdit: boolean = false;
  locationView: boolean = false;
  locationAdd: boolean = false;
  locationDelete: boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.LocationMasterData.filter = filterValue.trim().toLowerCase();
  }
  UniqueSiteId = function () {
    this.router.navigate(['/addLocation']);
  }
  filterFunc = function () {
    this.filterDiv = true;
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("LOCATIONFILTERSESSION");
    this.result = false;
    this.search();
  }
  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.locationService.locationList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      let locationFilterSession = new MasterFilterSession();
      locationFilterSession.locationid = this.FilterData.locationid;
      locationFilterSession.policestation = this.FilterData.policestation;
      sessionStorage.setItem('LOCATIONFILTERSESSION', JSON.stringify(locationFilterSession));
      this.result = !Object.values(locationFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.LocationMasterData = new MatTableDataSource(resp);
      this.LocationMasterData.sort = this.sort;
      this.LocationMasterData.paginator = this.paginator;
      this.totalRecords = this.LocationMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Delete Function
  onDelete = function (id) {
    this.DeleteMsg = 'Are you sure you want to Delete this user?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.locationService.deleteLocationById(id, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }
  ngOnInit(): void {
    //Role Rights
    this.locationEdit = this._global.UserRights.includes("UniqueSiteID_Master_EDIT");
    this.locationView = this._global.UserRights.includes("UniqueSiteID_Master_VIEW");
    this.locationDelete = this._global.UserRights.includes("UniqueSiteID_Master_DELETE");
    this.locationAdd = this._global.UserRights.includes("UniqueSiteID_Master_ADD"); 
    //Assign Filter
    let locationFilterSession = JSON.parse(sessionStorage.getItem('LOCATIONFILTERSESSION'));
    if (sessionStorage.getItem('LOCATIONFILTERSESSION') != null) {
      this.FilterData.locationid = locationFilterSession.locationid;
      this.FilterData.policestation = locationFilterSession.policestation;
     }
    if (locationFilterSession != null) {
      this.result = !Object.values(locationFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
  }
}