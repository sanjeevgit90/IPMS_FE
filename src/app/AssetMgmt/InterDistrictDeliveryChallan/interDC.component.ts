import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { InterDistrictDCService } from './interDC.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActionComponent } from './action/action.component';
import { CourierDetailsComponent } from './../DeliveryChallan/courierDetails/courierDetails.component';
import { DCFilterSession } from '../assetfilterdata';

@Component({
  selector: 'app-interDC',
  templateUrl: './interDC.component.html',
  providers: [InterDistrictDCService, AppGlobals, DialogService, SharedService]
})
export class InterDistrictDCComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private dcService: InterDistrictDCService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }
  displayedColumns: string[] = ['dcno', 'dcdate', 'consigneename', 'action'];
  DCRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  disableSendTo: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  FilterData = { "projectname": null, "dcno": null };
  //, "fromdate":null, "toDate":null};
  PageTitle = "Inter District Delivery Challan List";
  filterDiv: boolean = false;
  actionFlag: boolean = false;
  approvalFlag: boolean = false;
  interDistrictAdd: boolean = false;
  interDistrictEdit: boolean = false;
  interDistrictView: boolean = false;
  interDistrictDelete: boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DCRecord.filter = filterValue.trim().toLowerCase();
  }
  addDC = function () {
    this.router.navigate(['/addInterDC']);
  }
  filterFunc = function () {
    this.getActiveProject();
    this.filterDiv = true;
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("DCFILTERSESSION");
    this.result = false;
    this.search();
  }
  projectList = {};
  // projectList
  getActiveProject = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      this.projectList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dcService.getDCList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      debugger;
      let dcFilterSession = new DCFilterSession();
      dcFilterSession.dcno = this.FilterData.dcno;
      dcFilterSession.projectname = this.FilterData.projectname;
      sessionStorage.setItem('DCFILTERSESSION', JSON.stringify(dcFilterSession));
      this.result = !Object.values(dcFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
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
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.dcService.deleteDC(name, headers).subscribe(resp => {
            this.showLoading = false;
            this.successMessage = "Delivery Challan deleted successfully.";
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
  sendToWarhouse = function (obj) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dcService.sendToWarhouse(headers, obj).subscribe(resp => {
      //   this.locationList = resp;
      this.successMessage = "Delivery Challan is processed successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.search();
        })
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  action = function (id) {
    this.data = {};
    this.data.id = id;
    this.data.flag = 'Interdc'
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(ActionComponent, dialogConfig).afterClosed().subscribe(res => {
      this.search();
    })
  }


  openCourierdetails = function(id)
  {
    this.data={};
    this.data.id=id; 
     this.data.flag ='IDDC';
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
    this.interDistrictAdd = this._global.UserRights.includes("Inter_District_DC_ADD");
    this.interDistrictEdit = this._global.UserRights.includes("Inter_District_DC_EDIT");
    this.interDistrictView = this._global.UserRights.includes("Inter_District_DC_VIEW");
    this.interDistrictDelete = this._global.UserRights.includes("Inter_District_DC_DELETE");
    //Assign Filter
    let dcFilterSession = JSON.parse(sessionStorage.getItem('DCFILTERSESSION'));
    if (sessionStorage.getItem('DCFILTERSESSION') != null) {
      this.FilterData.dcno = dcFilterSession.dcno;
      this.FilterData.projectname = dcFilterSession.projectname;
    }
    if (dcFilterSession != null) {
      this.result = !Object.values(dcFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
    this.actionFlag = this._global.UserRights.includes("ROLE_ADMIN");
    this.approvalFlag = this._global.UserRights.includes("ROLE_TEAM_LEADER");
  }
}