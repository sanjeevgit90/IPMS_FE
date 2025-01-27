import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { PoFulfilmentService } from './po-fulfilment.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-po-fulfilment',
  templateUrl: './po-fulfilment.component.html',
  providers: [PoFulfilmentService, AppGlobals, DialogService, SharedService]

})
export class PoFulfilmentComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private poFulfilmentService: PoFulfilmentService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['fulfilmentDate', 'delayReason', 'nextdeliveryDate', 'delayCategory', 'action'];
  PoFulfilmentMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "PO Fulfilment Delay";

  addPoFulfilment = function () {
    debugger;
    this.router.navigate(['searchPurchaseOrder/AddPoFulfilment', this.route.snapshot.params.id, 'add']);
  }

  goBack = function () {
    debugger;
    this.router.navigate(['searchPurchaseOrder']);
  }

  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.poFulfilmentService.getAllFulfilmentsByPo(this.route.snapshot.params.id, headers).subscribe(resp => {
      debugger;
      this.PoFulfilmentMasterData = new MatTableDataSource(resp);
      this.PoFulfilmentMasterData.sort = this.sort;
      this.PoFulfilmentMasterData.paginator = this.paginator;
      this.totalRecords = this.PoFulfilmentMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Delete function
  deleteFulfilment = function (id) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to delete this fulfilment delay?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.poFulfilmentService.deleteFulfilmentById(id, headers).subscribe(resp => {
            this.successMessage = 'Fulfilment delay deleted successfully';
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