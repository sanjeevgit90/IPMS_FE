import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { VendorPaymentsService } from '../payments.service';

@Component({
  selector: 'app-add-payments',
  templateUrl: './add-payments.component.html',
  providers: [VendorPaymentsService, AppGlobals, DialogService, SharedService]
})
export class AddVendorPaymentComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private prsService: VendorPaymentsService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }


  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Add Payments";
  add = true;
  edit = false;
  list = true;

  addPaymentForm: FormGroup;
  isSubmitted = false;

  prsId: any = null;

  PaymentData = {
    "paymentDate": null, "amount": null, "paymentReference": null, "remark": null, "prsId": null
  };


  cancel = function () {
    this.router.navigate(['/searchPayments', this.prsId]);
  }

  savePayments = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addPaymentForm.invalid) {
      return;
    }
    this.PaymentData.paymentDate = this.PaymentData.paymentDate.getTime();
    this.PaymentData.prsId = this.route.snapshot.params.prsid;
    this.showLoading = true;
    this.prsService.savePayments(this.PaymentData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Payment is saved successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.router.navigate(['/searchPayments', this.prsId]);
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      //const errStr = error.error.errorMessage;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  updatePayments = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addPaymentForm.invalid) {
      return;
    }
    this.PaymentData.paymentDate = this.PaymentData.paymentDate.getTime();
    this.showLoading = true;
    this.prsService.updatePayments(this.PaymentData, headers, this.PaymentData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Payment is updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.router.navigate(['/searchPayments', this.prsId]);
        })
    }, (error: any) => {
      this.showLoading = false;
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
    this.prsService.getPaymentById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.PaymentData = resp;
      this.PaymentData.paymentDate = (new Date(this.PaymentData.paymentDate));
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }



  ngOnInit() {
    this.addPaymentForm = this.formBuilder.group({
      paymentDate: [null, Validators.required],
      amount: [null, Validators.required],
      paymentReference: [null, Validators.required],
      remark: [null, Validators.required]
    });

    this.prsId = this.route.snapshot.params.prsid;
    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Payments";
      this.editon(this.route.snapshot.params.id);
      //this.disabledField();
    }
  }

  get formControls() {
    return this.addPaymentForm.controls;
  }
}