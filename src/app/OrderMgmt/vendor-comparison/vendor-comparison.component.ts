import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { VendorComparisonService } from './vendor-comparison.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-vendor-comparison',
  templateUrl: './vendor-comparison.component.html',
  providers: [VendorComparisonService, AppGlobals, DialogService, SharedService]

})
export class VendorComparisonComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private vendorComparisonService: VendorComparisonService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['customerName', 'amount', 'deliveryTime', 'paymentTerms', 'quality', 'remarks', 'action'];
  VendorComparisonMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Vendor Comparison";

  addVendorComparison = function () {
    debugger;
    this.router.navigate(['searchPurchaseOrder/AddVendorComparison', this.route.snapshot.params.id, 'add']);
  }

  goBack = function () {
    debugger;
    this.router.navigate(['searchPurchaseOrder']);
  }
  IsVendorComparison:any = [];
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.vendorComparisonService.getAllVendorComparisonsByPo(this.route.snapshot.params.id, headers).subscribe(resp => {
      debugger;
      this.IsVendorComparison = resp;
      this.VendorComparisonMasterData = new MatTableDataSource(resp);
      this.VendorComparisonMasterData.sort = this.sort;
      this.VendorComparisonMasterData.paginator = this.paginator;
      this.totalRecords = this.VendorComparisonMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Delete function
  deleteVendorComparison = function (id) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to delete this vendor comparison?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.vendorComparisonService.deleteVendorComparisonById(id, headers).subscribe(resp => {
            this.successMessage = 'Vendor comparison deleted successfully';
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