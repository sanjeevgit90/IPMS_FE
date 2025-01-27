import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { InvoiceService } from './invoice.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewInvoiceComponent } from './viewinvoice/viewinvoice.component';
import { AddInvoiceComponent } from './addinvoice/addinvoice.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  providers: [InvoiceService, AppGlobals, DialogService, SharedService]
})
export class InvoiceComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private invoiceService: InvoiceService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }

  displayedColumns: string[] = ['projectpin', 'customername', 'pono', 'invoicestatus', 'totalamount', 'action'];
  InvoiceRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Invoice List";
  enableInvoice: boolean = false;

  invoiceAdd: boolean = false;
  invoiceEdit: boolean = false;
  invoiceView: boolean = false;
  invoiceDelete: boolean = false;

  url = "";


  projectList: any = [];
  projectid: String = null;
  FilterData = {};

  displayedColumns1: string[] = ['selectionvalue'];
  ProjectData: MatTableDataSource<any>;
 
  applyFilterProject(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectData.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.InvoiceRecord.filter = filterValue.trim().toLowerCase();
  }


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



  getInvoiceByProject = function (name) {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectId = name;
    this.invoiceService.getInvoiceList(name, headers, this.FilterData).subscribe(resp => {
      debugger;
      this.InvoiceRecord = new MatTableDataSource(resp);
      this.InvoiceRecord.sort = this.sort;
      this.InvoiceRecord.paginator = this.paginator;
      this.totalRecords = this.InvoiceRecord.filteredData.length;
      this.enableInvoice = true;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //delete 

  onDelete = function (name) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var experienceId = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.invoiceService.deleteInvoice(experienceId, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = "Invoice is deleted successfully.";
            this.getActiveProject();
            this.getInvoiceByProject(this.projectId);
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {
                this.getInvoiceByProject(this.projectId);
                this.enableInvoice = true;
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
    this.invoiceService.submitForApproval(name, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Invoice is successfully submitted for Approval.";
      this.getActiveProject();
      this.getInvoiceByProject(this.projectId);
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.getInvoiceByProject(this.projectId);
          this.enableInvoice = true;
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });

  }
  viewInvoice = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(ViewInvoiceComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;

    })
  }

  addInvoice = function (id, flag) {
    debugger;
    this.data = {};
    if (id == null) {
      this.item = {};
      this.item.projectid = this.projectId;
      this.data = this.item;
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
    this.dialog.open(AddInvoiceComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;
      this.getInvoiceByProject(this.projectId);
      this.enableInvoice = true;
    })
  }

  ngOnInit(): void {

    //Role Rights
    this.invoiceAdd = this._global.UserRights.includes("Invoice_ADD");
    this.invoiceEdit = this._global.UserRights.includes("Invoice_EDIT");
    this.invoiceView = this._global.UserRights.includes("Invoice_VIEW");
    this.invoiceDelete = this._global.UserRights.includes("Invoice_DELETE");

    this.getActiveProject();
    this.url = this._global.baseUrl;

  }



}
