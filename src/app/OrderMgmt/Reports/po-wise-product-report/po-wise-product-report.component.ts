import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { PoReportsService } from '../po-reports.service';
//import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-po-wise-product-report',
  templateUrl: './po-wise-product-report.component.html',
  providers: [PoReportsService, AppGlobals, DialogService]

})
export class PoWiseProductReportComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poReportsService: PoReportsService,
    private _global: AppGlobals, private dialogService: DialogService
  ) { }

  displayedColumns: string[] = ['poNumber','projectName','projectPin','partyName','orderDate','productName','hsnCode','rate','quantity','amount','cgstAmount','sgstAmount','igstAmount','totalDiscount','finalAmount','poGrandTotal'];
  PoWiseProductData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Po Wise Product Report";
  add = true;
  edit = false;
  list = true;
  addPoWiseProductForm: FormGroup;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.PoWiseProductData.filter = filterValue.trim().toLowerCase();
  }
  PoWiseData = {
    "poNumber": null, "projectName": null
  };

  FilterData = {
  };

    // Search function
    search = function () {
      debugger;
      const headers = { "Authorization": sessionStorage.getItem("token") };
      this.showLoading = true;
      this.poReportsService.getPowiseProductReport(this.PoWiseData, headers).subscribe(resp => {
        debugger;
        this.PoWiseProductData = new MatTableDataSource(resp);
        console.log(resp);
        this.PoWiseProductData.sort = this.sort;
        this.PoWiseProductData.paginator = this.paginator;
        this.totalRecords = this.PoWiseProductData.filteredData.length;
        this.showLoading = false;
      }, (error: any) => {
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  

    ngOnInit(): void {

      //Fromgroup collection
      this.addPoWiseProductForm = this.formBuilder.group({
        poNumber: [null],
        projectName: [null]
      });
      this.search();
    }
    get formControls() { return this.addPoWiseProductForm.controls; }
  }
  

