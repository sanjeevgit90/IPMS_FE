import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { PoPaymentService } from '../po-payment.service';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  providers: [PoPaymentService, AppGlobals, DialogService, SharedService]

})
export class AddPaymentComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poPaymentService: PoPaymentService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;

  PageTitle = "Add PO Payment";
  add = true;
  edit = false;
  list = true;

  PoPaymentData = {
    "scheduleDate": null, "amount": null, "paymentMode": null,
    "paymentDate": null, "ddNumber": null, "ddBank": null,
    "invoiceNumber": null, "invoiceDate": null, "cashBackReceived": null,
    "interestPaid": null, "purchaseOrderNo": null
  };
  addPoPaymentForm: FormGroup;
  isSubmitted = false;

  back = function () {
    //this.router.navigate(['searchPurchaseOrder/searchPoPayment']);
    if (this.route.snapshot.params.page == 'edit') {
      this.router.navigate(['searchPurchaseOrder/searchPoPayment', this.PoPaymentData.purchaseOrderNo, 'list']);
    } else if (this.route.snapshot.params.page == 'add') {
      this.router.navigate(['searchPurchaseOrder/searchPoPayment', this.route.snapshot.params.id, 'list']);
    }
  }

  addPoPaymnet = function (flag) {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addPoPaymentForm.invalid) {
      return;
    }
    this.PoPaymentData.scheduleDate = this.PoPaymentData.scheduleDate.getTime();
    if (this.PoPaymentData.paymentDate != null) {
      this.PoPaymentData.paymentDate = this.PoPaymentData.paymentDate.getTime();
    }
    if (this.PoPaymentData.invoiceDate != null) {
      this.PoPaymentData.invoiceDate = this.PoPaymentData.invoiceDate.getTime();
    }
    if (flag == "save") {
      this.PoPaymentData.purchaseOrderNo = this.route.snapshot.params.id;
    }
    this.showLoading = true;
    this.poPaymentService.savePayment(this.PoPaymentData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "PO Payment " + flag + "d successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addPoPaymentForm.reset();
          if (flag == "save") {
            this.router.navigate(['searchPurchaseOrder/searchPoPayment', this.route.snapshot.params.id, 'list']);
          } else if (flag == "update") {
            this.router.navigate(['searchPurchaseOrder/searchPoPayment', this.PoPaymentData.purchaseOrderNo, 'list']);
          }
          //this.router.navigate(['searchPurchaseOrder/searchPoPayment',this.route.snapshot.params.id,'list']);
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.PoPaymentData.scheduleDate = (new Date(this.PoPaymentData.scheduleDate));
      if (this.PoPaymentData.paymentDate != null || this.PoPaymentData.paymentDate != 0) {
        this.PoPaymentData.paymentDate = (new Date(this.PoPaymentData.paymentDate));
      }
      if (this.PoPaymentData.invoiceDate != null || this.PoPaymentData.paymentDate != 0) {
        this.PoPaymentData.invoiceDate = (new Date(this.PoPaymentData.invoiceDate));
      }
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Edit
  editon = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.poPaymentService.getPaymentById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.PoPaymentData = resp;
      this.PoPaymentData.scheduleDate = (new Date(this.PoPaymentData.scheduleDate));
      this.PoPaymentData.paymentDate = (new Date(this.PoPaymentData.paymentDate));
      this.PoPaymentData.invoiceDate = (new Date(this.PoPaymentData.invoiceDate));
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  ngOnInit(): void {
    this.addPoPaymentForm = this.formBuilder.group({
      scheduleDate: [null, Validators.required],
      amount: [null, Validators.required],
      paymentMode: [null],
      paymentDate: [null],
      ddNumber: [null],
      ddBank: [null],
      invoiceNumber: [null],
      invoiceDate: [null],
      cashBackReceived: [null],
      interestPaid: [null]
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update PO Payment";
      this.editon(this.route.snapshot.params.id);
    }

  }
  get formControls() {
    return this.addPoPaymentForm.controls;
  }

}

