import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { AssetMasterService } from './../AssetMaster/assetmaster.service';
import { UpdateDCAssetComponent} from './../DeliveryChallan/addasset/updateasset.component';

@Component({
  selector: 'app-citywiseasset',
  templateUrl: './citywiseasset.component.html',
  providers: [AssetMasterService, AppGlobals, DialogService, SharedService]
})
export class CityWiseAssetReportComponent implements OnInit {

  constructor( private router: Router, private route: ActivatedRoute, private http: HttpClient, private assetService: AssetMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog:MatDialog) { }
  
    displayedColumns: string[] = ['assetname', 'category', 'subcategory'];
    AssetRecord: MatTableDataSource<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


    displayedColumns1: string[] = ['selectionvalue'];
    CityMasterData: MatTableDataSource<any>;
   
    LocationMasterData: MatTableDataSource<any>;
   
    displayedColumns2: string[] = ['selectionvalue'];

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "City and Location Wise Asset Report";

   cityList : any = [];
   locationList: any = [];

   enableLocation: boolean = false;
   enableAsset: boolean= false;

   searchCity=null;
   searchLocation=null;
   FilterData={"locationid":null};

   applyFilterAsset(event: Event) {
    debugger;
   const filterValue = (event.target as HTMLInputElement).value;
   this.AssetRecord.filter = filterValue.trim().toLowerCase();
 }

   applyFilterCity(event: Event) {
     debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.CityMasterData.filter = filterValue.trim().toLowerCase();
  }

  applyFilterLoc(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.LocationMasterData.filter = filterValue.trim().toLowerCase();
  }
  
  citycount:any;
  usidcount:any;
  // projectList
  getActiveCity= function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
  
    this.sharedService.getCityList(headers).subscribe(resp => {
      debugger;
      this.cityList = resp;
      this.CityMasterData = new MatTableDataSource(resp);
      this.citycount = this.CityMasterData.filteredData.length;
     
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getActiveLocationFromCity = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveLocationFromCity(headers, name).subscribe(resp => {
      debugger;
      this.locationList = resp;
      this.LocationMasterData = new MatTableDataSource(resp);
     this.usidcount = this.LocationMasterData.filteredData.length;
      this.enableLocation=true;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAssetsFromLocation = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.FilterData.locationid= name;
    this.showLoading = true;
    this.assetService.getAssetList(this.FilterData, headers ).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.enableAsset=true;
      this.AssetRecord= new MatTableDataSource(resp.content);
      this.AssetRecord.sort = this.sort;
      this.AssetRecord.paginator = this.paginator;
      this.totalRecords = this.AssetRecord.filteredData.length;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  updateAsset=function(id)
 {
  debugger;
  this.data={};
 this.data.id=id;
 this.data.flag='view' ; 
 const dialogConfig = new MatDialogConfig();
 dialogConfig.disableClose=true;
 dialogConfig.autoFocus=true;
 dialogConfig.width="70%";
 dialogConfig.data = this.data;
 this.dialog.open(UpdateDCAssetComponent,dialogConfig).afterClosed().subscribe(res => {    
  debugger;
  
  })
 }

 
 getActiveCityFromDistrict = function (district) {
  debugger;
  if (district== null)
  {
    return;
  }
  const headers = { "Authorization": sessionStorage.getItem("token") };
  this.sharedService.getActiveCityListFromDistrict(headers, district).subscribe(resp => {
    debugger;
    this.cityList = resp;
    this.CityMasterData = new MatTableDataSource(resp);
    this.CityMasterData.sort = this.citySort;
    this.CityMasterData.paginator = this.cityPaginator;
  }, (error: any) => {
    debugger;
    const errStr = error.message;
    this.dialogService.openConfirmDialog(errStr)
  });
}

  ngOnInit(): void {
    debugger;
    var district =  sessionStorage.getItem("selectedDistrict"); 
    if (district != null)
    {
      this.getActiveCityFromDistrict(district);
    }
    else
    {   
      this.getActiveCity();
    }
  }

 

}
