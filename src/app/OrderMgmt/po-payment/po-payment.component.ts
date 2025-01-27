import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { PoPaymentService } from './po-payment.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-po-payment',
  templateUrl: './po-payment.component.html',
  providers: [PoPaymentService, AppGlobals, DialogService, SharedService]

})
export class PoPaymentComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private poPaymentService: PoPaymentService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['scheduleDate', 'amount', 'paymentMode', 'paymentDate', 'invoiceNumber', 'invoiceDate', 'action'];
  PoPaymentMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "PO Payment Schedule";

  addPoPayment = function () {
    debugger;
    this.router.navigate(['searchPurchaseOrder/AddPoPayment', this.route.snapshot.params.id, 'add']);
  }
  /* editPoPayment = function(id) { //on edit button click
    debugger;
    this.router.navigate(['searchPurchaseOrder/EditPoPayment',id,'edit']);
  } */
  goBack = function () {
    debugger;
    this.router.navigate(['searchPurchaseOrder']);
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
    this.poPaymentService.getAllPaymentsByPo(this.route.snapshot.params.id, headers).subscribe(resp => {
      debugger;
      this.PoPaymentMasterData = new MatTableDataSource(resp);
      this.PoPaymentMasterData.sort = this.sort;
      this.PoPaymentMasterData.paginator = this.paginator;
      this.totalRecords = this.PoPaymentMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Delete function
  deletePayment = function (id) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to delete this payment?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.poPaymentService.deletePaymentById(id, headers).subscribe(resp => {
            this.successMessage = 'Payment deleted successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      })
  }

  ngOnInit(): void {
    this.search();
  }
}