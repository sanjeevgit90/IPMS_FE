import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { OEMDeliveryChallanService } from './oemdc.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OEMActionComponent } from './assetaction/assetaction.component';
import { CourierDetailsComponent } from './../DeliveryChallan/courierDetails/courierDetails.component';
import { ViewOEMDCComponent } from './viewDC/viewOEMDC.component';


@Component({
  selector: 'app-oemdc',
  templateUrl: './oemdc.component.html',
  providers: [OEMDeliveryChallanService, AppGlobals, DialogService, SharedService]
})
export class OEMDCComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private dcService: OEMDeliveryChallanService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }

  displayedColumns: string[] = ['dcno', 'dcdate', 'consigneename', 'action'];
  DCRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  actionFlag: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  oemDeliveryChallanAdd: boolean = false;
  oemDeliveryChallanEdit: boolean = false;
  oemDeliveryChallanView: boolean = false;
  oemDeliveryChallanDelete: boolean = false;

  approvalFlag: boolean = false;

  FilterData = { "projectname": null, "dcno": null };
  //, "fromdate":null, "toDate":null};

  PageTitle = "Returnable Delivery Challan List";
  filterDiv: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DCRecord.filter = filterValue.trim().toLowerCase();
  }

  addDC = function () {
    debugger;
    this.router.navigate(['/addOEMDC']);
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
    this.dcService.getDCList(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.DCRecord = new MatTableDataSource(resp);
      this.DCRecord.sort = this.sort;
      this.DCRecord.paginator = this.paginator;
      this.totalRecords = this.DCRecord.filteredData.length;
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
          this.dcService.deleteDC(id, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Delivery Challan deleted successfully.";
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
  sendToWarhouse = function (obj) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dcService.sendToWarhouse(headers, obj).subscribe(resp => {
      debugger;
      //   this.locationList = resp;
      this.successMessage = "Delivery Challan is processed successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.search();

        })
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  action = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    this.data.flag = 'search'
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(OEMActionComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;

    })
  }

  viewDC = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    dialogConfig.data = this.data;
    this.dialog.open(ViewOEMDCComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;

    })
  }

  openCourierdetails = function(id)
  {
    this.data={};
    this.data.id=id; 
     this.data.flag ='OEMDC';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose=true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="70%";
    dialogConfig.data = this.data;
    this.dialog.open(CourierDetailsComponent,dialogConfig).afterClosed().subscribe(res => {    
     debugger;
    // this.search();
        })
   }

  ngOnInit(): void {
    //Role Rights
    this.oemDeliveryChallanAdd = this._global.UserRights.includes("OEM_Delivery_Challan_ADD");
    this.oemDeliveryChallanEdit = this._global.UserRights.includes("OEM_Delivery_Challan_EDIT");
    this.oemDeliveryChallanView = this._global.UserRights.includes("OEM_Delivery_Challan_VIEW");
    this.oemDeliveryChallanDelete = this._global.UserRights.includes("OEM_Delivery_Challan_DELETE");


    this.search();
    this.actionFlag = this._global.UserRights.includes("ROLE_OEM");
    this.approvalFlag = this._global.UserRights.includes("ROLE_ADMIN");
  }



}
