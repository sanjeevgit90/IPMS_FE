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
  selector: 'app-monthly-payment',
  templateUrl: './monthly-payment.component.html',
  providers: [PoReportsService, AppGlobals, DialogService]

})
export class MonthlyPaymentComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poReportsService: PoReportsService,
    private _global: AppGlobals, private dialogService: DialogService
  ) { }

  displayedColumns: string[] = ['scheduleDate', 'poNumber', 'partyName', 'amount'];
  POMonthData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Month Wise Payment Report";
  add = true;
  edit = false;
  list = true;
  addPoMonthlyForm: FormGroup;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.POMonthData.filter = filterValue.trim().toLowerCase();
  }
  MonthlyData = {
    "year": null, "month": null
  };

    // Search function
    search = function () {
      debugger;
      const headers = { "Authorization": sessionStorage.getItem("token") };
      var error = "";
      if (this.MonthlyData.year == null) {
        error += "Year is required." + "\n";
      }
      if (this.MonthlyData.month == null) {
        error += "Month is required.";
      }
      if(error != "") {
        this.dialogService.openConfirmDialog(error);
        return;
      }
      this.showLoading = true;
      this.poReportsService.getPoMonthlyReport(this.MonthlyData, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.POMonthData = new MatTableDataSource(resp.content);
        console.log(resp);
        this.POMonthData.sort = this.sort;
        this.POMonthData.paginator = this.paginator;
        this.totalRecords = this.POMonthData.filteredData.length;
      }, (error: any) => {
        debugger;        
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  

    ngOnInit(): void {

      //Fromgroup collection
      this.addPoMonthlyForm = this.formBuilder.group({
        year: [null],
        month: [null]
      });
      //this.search();
    }
    get formControls() { return this.addPoMonthlyForm.controls; }
  }
  