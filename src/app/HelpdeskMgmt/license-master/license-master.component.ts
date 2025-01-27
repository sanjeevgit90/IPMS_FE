import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { LicenseMasterService } from './license-master.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-license-master',
  templateUrl: './license-master.component.html',
  providers: [LicenseMasterService, AppGlobals, DialogService, SharedService]
})

export class LicenseMasterComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private licenseMasterService: LicenseMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['licenseTag', 'licenseToName', 'serialNo', 'action'];
  LicenseMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "License List";
  filterDiv: boolean = false;
  licenceAdd: boolean = false;
  licenceEdit: boolean = false;
  licenceView: boolean = false;
  licenceDelete: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.LicenseMasterData.filter = filterValue.trim().toLowerCase();
  }

  addLicense = function () {  
    this.router.navigate(['/LicenseMaster']);
  }

  filterFunc = function () {
    this.filterDiv = true;
  }

  cancel = function () {  
    this.filterDiv = false;
    this.FilterData = {};
  }

  onDelete = function (licenseTag) {    
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.licenseMasterService.deleteLicenseByTag(licenseTag, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            this.showLoading = false;
            const errStr = error._body;
            var obj = JSON.parse(errStr);
            this.dialogService.openConfirmDialog(obj.message)
          });
        }
      })
  }

  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.licenseMasterService.getLicenseList(headers).subscribe(resp => {
      this.LicenseMasterData = new MatTableDataSource(resp);
      this.LicenseMasterData.sort = this.sort;
      this.LicenseMasterData.paginator = this.paginator;
      this.totalRecords = this.LicenseMasterData.filteredData.length;
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

  ngOnInit(): void {
    //Role Rights
    this.licenceAdd = this._global.UserRights.includes("Licence_Master_ADD");
    this.licenceEdit = this._global.UserRights.includes("Licence_Master_EDIT");
    this.licenceView = this._global.UserRights.includes("Licence_Master_VIEW");
    this.licenceDelete = this._global.UserRights.includes("Licence_Master_DELETE");
    this.search();
  }
}