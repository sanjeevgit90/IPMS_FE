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
  selector: 'app-pending-payment',
  templateUrl: './pending-payment.component.html',
  providers: [PoReportsService, AppGlobals, DialogService]

})
export class PendingPaymentComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poReportsService: PoReportsService,
    private _global: AppGlobals, private dialogService: DialogService
  ) { }

  displayedColumns: string[] = ['scheduleDate', 'poNumber', 'partyName', 'amount'];
  POPendingPaymentData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Pending Payment Report";
  add = true;
  edit = false;
  list = true;
  addPoPendingForm: FormGroup;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.POPendingPaymentData.filter = filterValue.trim().toLowerCase();
  }
  POPendingData = {
    "toDate": null,
  };

    // Search function
    search = function () {
    
      const headers = { "Authorization": sessionStorage.getItem("token") };
      var error = "";
      if (this.POPendingData.toDate == null) {
        error += "Date is required.";
        this.dialogService.openConfirmDialog(error);
        return;
      }
      this.POPendingData.toDate = this.POPendingData.toDate.getTime();
      this.showLoading = true;
      this.poReportsService.getPoPendingReport(this.POPendingData, headers).subscribe(resp => {
        debugger;
        this.showLoading = false;
        this.POPendingPaymentData = new MatTableDataSource(resp.content);
        this.POPendingPaymentData.sort = this.sort;
        this.POPendingPaymentData.paginator = this.paginator;
        this.totalRecords = this.POPendingPaymentData.filteredData.length;
        this.POPendingData.toDate = (new Date(this.POPendingData.toDate));
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        this.POPendingData.toDate = (new Date(this.POPendingData.toDate));
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  

    ngOnInit(): void {

      //Fromgroup collection
      this.addPoPendingForm = this.formBuilder.group({
        toDate: [null]
      });
      //this.search();
    }
    get formControls() { return this.addPoPendingForm.controls; }
  }
  