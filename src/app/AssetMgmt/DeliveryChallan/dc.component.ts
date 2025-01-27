import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { DeliveryChallanService } from './dc.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewDeliveryChallanComponent } from './viewDC/viewDC.component';
import { CourierDetailsComponent } from './courierDetails/courierDetails.component';
import { DCFilterSession } from '../assetfilterdata';
@Component({
  selector: 'app-dc',
  templateUrl: './dc.component.html',
  providers: [DeliveryChallanService, AppGlobals, DialogService, SharedService]
})
export class DeliveryChallanComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private dcService: DeliveryChallanService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }
  displayedColumns: string[] = ['dcno', 'dcdate', 'consigneename', 'action'];
  DCRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  FilterData = { "projectname": null, "dcno": null };
  PageTitle = "Delivery Challan List";
  filterDiv: boolean = false;
  deliveryChallanAdd: boolean = false;
  deliveryChallanEdit: boolean = false;
  deliveryChallanView: boolean = false;
  deliveryChallanDelete: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DCRecord.filter = filterValue.trim().toLowerCase();
  }

  addDC = function () {
    this.router.navigate(['/addDC']);
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
  projectList: any = [];
  getActiveProject = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      this.projectList = resp;
    }, (error: any) => {
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
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
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  openCourierdetails = function(id)
  {
    this.data={};
    this.data.id=id; 
     this.data.flag ='DC';
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
  //delete 
  onDelete = function (name) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.dcService.deleteDC(id, headers).subscribe(resp => {
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

  viewDC = function (id) {
    this.data = {};
    this.data.id = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    dialogConfig.data = this.data;
    this.dialog.open(ViewDeliveryChallanComponent, dialogConfig).afterClosed().subscribe(res => {
    })
  }

  ngOnInit(): void {
    //Role Rights
    this.deliveryChallanAdd = this._global.UserRights.includes("Delivery_Challan_ADD");
    this.deliveryChallanEdit = this._global.UserRights.includes("Delivery_Challan_EDIT");
    this.deliveryChallanView = this._global.UserRights.includes("Delivery_Challan_VIEW");
    this.deliveryChallanDelete = this._global.UserRights.includes("Delivery_Challan_DELETE");
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
  }
}