import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { VendorComparisonService } from '../vendor-comparison.service';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-add-vendor-comparison',
  templateUrl: './add-vendor-comparison.component.html',
  providers: [VendorComparisonService, AppGlobals, DialogService, SharedService]

})
export class AddVendorComparisonComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private vendorComparisonService: VendorComparisonService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;

  PageTitle = "Add Vendor Comparison";
  add = true;
  edit = false;
  list = true;

  VendorComparisonData = {
    "customerName": null, "amount": null, "deliveryTime": null,
    "paymentTerms": null, "quality": null, "remarks": null, "purchaseOrderNo": null
  };
  addVendorComparisonForm: FormGroup;
  isSubmitted = false;

  back = function () {
    if (this.route.snapshot.params.page == 'edit') {
      this.router.navigate(['searchPurchaseOrder/searchVendorComparison', this.VendorComparisonData.purchaseOrderNo, 'list']);
    } else if (this.route.snapshot.params.page == 'add') {
      this.router.navigate(['searchPurchaseOrder/searchVendorComparison', this.route.snapshot.params.id, 'list']);
    }
  }

  addVendorComparison = function (flag) {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addVendorComparisonForm.invalid) {
      return;
    }
    this.VendorComparisonData.deliveryTime = this.VendorComparisonData.deliveryTime.getTime();
    if (flag == "save") {
      this.VendorComparisonData.purchaseOrderNo = this.route.snapshot.params.id;
    }
    this.showLoading = true;
    this.vendorComparisonService.saveVendorComparison(this.VendorComparisonData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Vendor comparison " + flag + "d successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addVendorComparisonForm.reset();
          if (flag == "save") {
            this.router.navigate(['searchPurchaseOrder/searchVendorComparison', this.route.snapshot.params.id, 'list']);
          } else if (flag == "update") {
            this.router.navigate(['searchPurchaseOrder/searchVendorComparison', this.VendorComparisonData.purchaseOrderNo, 'list']);
          }
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
    this.vendorComparisonService.getVendorComparisonById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.VendorComparisonData = resp;
      this.VendorComparisonData.deliveryTime = (new Date(this.VendorComparisonData.deliveryTime));
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.addVendorComparisonForm = this.formBuilder.group({
      customerName: [null, Validators.required],
      amount: [null, Validators.required],
      deliveryTime: [null, Validators.required],
      paymentTerms: [null],
      quality: [null],
      remarks: [null]
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Vendor Comparison";
      this.editon(this.route.snapshot.params.id);
    }

  }
  get formControls() {
    return this.addVendorComparisonForm.controls;
  }

}