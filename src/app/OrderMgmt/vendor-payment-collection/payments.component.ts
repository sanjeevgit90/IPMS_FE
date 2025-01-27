import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { VendorPaymentsService } from './payments.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  providers: [VendorPaymentsService, AppGlobals, DialogService, SharedService]
})
export class VendorPaymentsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private vendorPaymentsService: VendorPaymentsService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

    displayedColumns: string[] = ['paymentDate' , 'amount' , 'paymentReference','action'];
    PaymentListData: MatTableDataSource<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


    showLoading: boolean = false;
  
    totalRecords: any;
    itemPerPage = this._global.pageNumer;
    pageSizedisplay = this._global.pageSize;
  
    FilterData = {"prsId":null};

    prsId:any = null;
    
    PageTitle = "Vendor Payments Master";
    filterDiv:boolean = false;
    addPayment = function() {
      debugger;
      this.router.navigate(['/addPayment', this.prsId]);
    }

    back = function () {
      this.router.navigate(['/searchPrs']);
    }
  
    filterFunc = function() {
      debugger;
      this.filterDiv = true;
     
    }
    cancel = function() {
      debugger;
      this.filterDiv = false;
      this.FilterData = {};
    }
 

    // Search function
    search = function (prsId) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.vendorPaymentsService.getPaymentListByPrs(prsId, headers).subscribe(resp => {
      debugger;
      this.PaymentListData = new MatTableDataSource(resp);
      this.PaymentListData.sort = this.sort;
      this.PaymentListData.paginator = this.paginator;
      this.totalRecords = this.PaymentListData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

 

  onDelete = function (id) {
    this.DeleteMsg = 'Are you sure you want to delete this record?';
    var experienceId = id;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.vendorPaymentsService.onDelete(experienceId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Payment is deleted successfully.";
      this.search(this.prsId);
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
 
  ngOnInit(): void {
    this.prsId = this.route.snapshot.params.prsid;
    //this.FilterData.prsId = this.prsId;
    this.search(this.prsId);
  }


}
