import { Component, OnInit, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { ProductMasterService } from './productmaster.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProductMasterMisFilterSession } from '../assetfilterdata';
@Component({
  selector: 'app-productmaster',
  templateUrl: './productmaster.component.html',
  providers: [ProductMasterService, AppGlobals, DialogService, SharedService]
})
export class ProductMasterComponent implements OnInit {
  result: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private productService: ProductMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['productname', 'serialno', 'barcode', 'producttype', 'action'];
  exportColumns: string[] = ['productname', 'serialno', 'barcode', 'producttype', 'category', 'subcategory', 'manufacturer',
    'model', 'description', 'hsncode', 'hsndescription', 'baseuom', 'ishazardous', 'hazardousgoodtype'];
  ProductRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  matSelectDuration = this._global.matSelectDurationTime;
  pageSizedisplay = this._global.pageSize;

  FilterData = { "productname": null, "serialno": null, "producttype": null, "category": null, "subcategory": null };
  PageTitle = "Product List";
  filterDiv: boolean = false;
  productAdd: boolean = false;
  productEdit: boolean = false;
  productView: boolean = false;
  productDelete: boolean = false;
  categoryList = {};
  subcategoryList = {};
  ProductDataExport: any = [];
  addProducts = function () {
    this.router.navigate(['/addProduct']);
  }
  filterFunc = function () {
    this.filterDiv = true;
    this.getActiveCategory();
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("PRODUCTMASTERFILTERSESSION");
    this.result = false;
    this.search();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProductRecord.filter = filterValue.trim().toLowerCase();
  }
  // category List
  getActiveCategory = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCategory(headers).subscribe(resp => {
      this.categoryList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // subcategory List from category

  getActiveSubCategoryfromcategory = function (stateName) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveSubCategoryfromcategory(headers, stateName).subscribe(resp => {
      this.subcategoryList = resp;
    }, (error: any) => {
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.productService.getProductList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      let productFilterSession = new ProductMasterMisFilterSession();
      productFilterSession.productname = this.FilterData.productname;
      productFilterSession.serialno = this.FilterData.serialno;
      productFilterSession.producttype = this.FilterData.producttype;
      productFilterSession.category = this.FilterData.category;
      productFilterSession.subcategory = this.FilterData.subcategory;
      sessionStorage.setItem('PRODUCTMASTERFILTERSESSION', JSON.stringify(productFilterSession));
      this.result = !Object.values(productFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.ProductDataExport = resp;
      this.ProductRecord = new MatTableDataSource(resp);
      this.ProductRecord.sort = this.sort;
      this.ProductRecord.paginator = this.paginator;
      this.totalRecords = this.ProductRecord.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  onDelete = function (id) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var experienceId = id;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.productService.deleteProduct(experienceId, headers).subscribe(resp => {
            this.successMessage = 'Product is deleted Successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search(this.route.snapshot.params.id);
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr)
          });
        }


      })
  }

  ngOnInit(): void {
    //Role Rights
    this.productAdd = this._global.UserRights.includes("Product_Master_ADD");
    this.productEdit = this._global.UserRights.includes("Product_Master_EDIT");
    this.productView = this._global.UserRights.includes("Product_Master_VIEW");
    this.productDelete = this._global.UserRights.includes("Product_Master_DELETE");
    //Assign Filter
    let productMasterFilterSession = JSON.parse(sessionStorage.getItem('PRODUCTMASTERFILTERSESSION'));
    if (sessionStorage.getItem('PRODUCTMASTERFILTERSESSION') != null) {
      this.FilterData.productname = productMasterFilterSession.productname;
      this.FilterData.serialno = productMasterFilterSession.serialno;
      this.FilterData.producttype = productMasterFilterSession.producttype;
      this.FilterData.category = productMasterFilterSession.category;
      this.FilterData.subcategory = productMasterFilterSession.subcategory;
    }
    if (productMasterFilterSession != null) {
      this.result = !Object.values(productMasterFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }

    this.search();

  }

}
