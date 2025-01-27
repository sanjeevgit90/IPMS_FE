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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CollectionTaggingService } from './collectiontagging.service';
import { AddCollectionComponent } from './addcollection/addcollection.component';

@Component({
  selector: 'app-collectiontagging',
  templateUrl: './collectiontagging.component.html',
  providers: [CollectionTaggingService, AppGlobals, DialogService, SharedService]
})
export class CollectionTaggingComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private collectionService: CollectionTaggingService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    private dialog: MatDialog) { }

  displayedColumns: string[] = ['collectiondate', 'invoiceid', 'netamountcredieted', 'utrno', 'action'];
  CollectionRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Collection Tagging";

  projectList: any = [];

   url = '';
 
   displayedColumns1: string[] =  ['selectionvalue'];
   ProjectData: MatTableDataSource<any>;
   
  invoiceCollectionAdd: boolean = false;
  invoiceCollectionEdit: boolean = false;
  invoiceCollectionView: boolean = false;
  invoiceCollectionDelete: boolean = false;

  enableCollection: boolean = false;

  projectId: any;
  FilterData = {};

  applyFilterProject(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectData.filter = filterValue.trim().toLowerCase();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CollectionRecord.filter = filterValue.trim().toLowerCase();
  }


  // projectList
  getActiveProject = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };

    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
      this.ProjectData = new MatTableDataSource(resp);
     
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getCollectionByProject = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.projectId = name;
    this.collectionService.getCollectionList(headers, name, this.FilterData).subscribe(resp => {
      debugger;
      this.CollectionRecord = new MatTableDataSource(resp);
      this.CollectionRecord.sort = this.sort;
      this.CollectionRecord.paginator = this.paginator;
      this.totalRecords = this.CollectionRecord.filteredData.length;
      this.enableCollection = true;
    }, (error: any) => {
      debugger;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  addCollection = function (id, flag) {
    debugger;
    this.data = {};
    if (id == null) {
      this.data.projectid = this.projectId;
    }
    else {
      this.item = {};
      this.item.id = id;
      this.item.projectid = this.projectId;
      this.data = this.item;
    }

    this.data.flag = flag;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(AddCollectionComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;
      this.getCollectionByProject(this.projectId);
      this.enableCollection = true;
    })
  }

  deleteCollection = function (name) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var experienceId = name;
    var projectId = name.projectid;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.collectionService.deleteCollection(experienceId, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Collection is deleted successfully.";
            this.getActiveProject();
            this.getCollecionByProject(projectId);
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {

                this.getCollectionByProject(this.projectId);
                this.enableCollection = true;
              })

          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }

  submitForApproval = function (name) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.collectionService.submitForApproval(name, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Collection is successfully submitted for Approval.";

      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {

          this.getCollectionByProject(this.projectId);
          this.enableCollection = true;
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  ngOnInit(): void {

    //Role Rights
    this.invoiceCollectionAdd = this._global.UserRights.includes("Invoice_Collection_ADD");
    this.invoiceCollectionEdit = this._global.UserRights.includes("Invoice_Collection_EDIT");
    this.invoiceCollectionView = this._global.UserRights.includes("Invoice_Collection_VIEW");
    this.invoiceCollectionDelete = this._global.UserRights.includes("Invoice_Collection_DELETE");

    this.url = this._global.baseUrl;

    this.getActiveProject();
    this.url = this._global.baseUrl;
  }



}
