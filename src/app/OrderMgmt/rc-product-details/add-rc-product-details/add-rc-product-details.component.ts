import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { RcProductDetailsService } from '../../../OrderMgmt/rc-product-details/rc-product-details.service';
import { HsnMasterService } from '../../../AssetMgmt/HsnMaster/hsn-master.service';

@Component({
  selector: 'app-add-rc-product-details',
  templateUrl: './add-rc-product-details.component.html',
  providers: [RcProductDetailsService, AppGlobals, DialogService, SharedService, HsnMasterService]
})
export class AddRcProductDetailsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private productDetailsService: RcProductDetailsService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private hsnMasterService: HsnMasterService) { }

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "Add Product Details";
  add = true;
  edit = false;
  list = true;

  addProductDetailsForm: FormGroup;
  isSubmitted = false;

  // isHistoricData = "NO";
  // applyGstFlag = "YES";
  // currency = "INR";
  // isSameState = "true";
  debugger;
  isHistoricData = sessionStorage.getItem('isHistoricData');
  applyGstFlag = sessionStorage.getItem('applyGstFlag');
  currency = sessionStorage.getItem('currencyFlag');
  isSameState = sessionStorage.getItem('sameStateFlag');

  ProductDetailsEntityData = {
    "productName": null, "hsnId": null, "rate": 0,
    "quantity": 1, "amount": 0, "discount": 0,
    "discountAmount": 0, "totalDiscount": 0, "totalAmount": 0,
    "description": null, "cgst": 0, "sgst": 0, "igst": 0,
    "cgstAmount": 0, "sgstAmount": 0, "igstAmount": 0,
    "serviceTax": 0, "vat": 0, "finalAmount": 0,
    "rateContract": null, "isHistoricData": sessionStorage.getItem('isHistoricData'), "applyGstFlag": sessionStorage.getItem('applyGstFlag'), "currency": sessionStorage.getItem('currencyFlag'), "stateFlag": sessionStorage.getItem('sameStateFlag')
  };

  RcParent = { "entityId": "" };

  compareObjects(o1: any, o2: any): boolean {
    //return o1.name === o2.name && o1.id === o2.id;
    return o1 == o2;
  }

  // Disabled Function
  disabledField = function () {
    this.addProductDetailsForm.get('quantity').disable();
    this.addProductDetailsForm.get('amount').disable();
    this.addProductDetailsForm.get('totalDiscount').disable();
    this.addProductDetailsForm.get('totalAmount').disable();
    this.addProductDetailsForm.get('cgst').disable();
    this.addProductDetailsForm.get('sgst').disable();
    this.addProductDetailsForm.get('igst').disable();
    this.addProductDetailsForm.get('cgstAmount').disable();
    this.addProductDetailsForm.get('sgstAmount').disable();
    this.addProductDetailsForm.get('igstAmount').disable();
    this.addProductDetailsForm.get('finalAmount').disable();
  }

  cancel = function () {
    //this.router.navigate(['/SearchProductDetails']);
    if (this.route.snapshot.params.page == 'edit') {
      //this.router.navigate(['searchRateContract/searchRcProductDetails/' + this.ProductDetailsEntityData.rateContract.entityId + '/list']);
      if (this.route.snapshot.params.task == null) {
        this.router.navigate(['searchRateContract/searchRcProductDetails', this.ProductDetailsEntityData.rateContract.entityId, 'list']);
      } else {
        this.router.navigate(['searchTask/searchRcProductDetails', this.ProductDetailsEntityData.rateContract.entityId, 'list', this.route.snapshot.params.task]);
      }
    } else if (this.route.snapshot.params.page == 'add') {
      //this.router.navigate(['searchRateContract/searchRcProductDetails/' + this.route.snapshot.params.id + '/list']);
      if (this.route.snapshot.params.task == null) {
        this.router.navigate(['searchRateContract/searchRcProductDetails', this.route.snapshot.params.id, 'list']);
      } else {
        this.router.navigate(['searchTask/searchRcProductDetails', this.route.snapshot.params.id, 'list', this.route.snapshot.params.task]);
      }
    }
  }

  saveProductDetails = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    const errStr = null;
    if (this.addProductDetailsForm.invalid) {
      return;
    }
    if ((this.ProductDetailsEntityData.discount != 0) && (this.ProductDetailsEntityData.discountAmount != 0)) {
      this.errStr = "Enter either discount or discount amount";
      this.dialogService.openConfirmDialog(this.errStr);
      return;
    }
    this.RcParent.entityId = this.route.snapshot.params.id;
    this.ProductDetailsEntityData.rateContract = this.RcParent;
    this.ProductDetailsEntityData.isHistoricData = sessionStorage.getItem('isHistoricData');
    this.ProductDetailsEntityData.applyGstFlag = sessionStorage.getItem('applyGstFlag');
    this.ProductDetailsEntityData.currency = sessionStorage.getItem('currencyFlag');
    this.ProductDetailsEntityData.stateFlag = sessionStorage.getItem('sameStateFlag');
    this.showLoading = true;
    this.productDetailsService.saveProductDetails(this.ProductDetailsEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Product saved successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addProductDetailsForm.reset();
          //this.router.navigate(['searchRateContract/searchRcProductDetails/',this.route.snapshot.params.id,'list']);
          if (this.route.snapshot.params.task == null) {
            this.router.navigate(['searchRateContract/searchRcProductDetails/', this.route.snapshot.params.id, 'list']);
          } else {
            this.router.navigate(['searchTask/searchRcProductDetails', this.route.snapshot.params.id, 'list', this.route.snapshot.params.task]);
          }
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  updateProductDetails = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    const errStr = null;
    if (this.addProductDetailsForm.invalid) {
      return;
    }
    if ((this.ProductDetailsEntityData.discount != 0) && (this.ProductDetailsEntityData.discountAmount != 0)) {
      this.errStr = "Enter either discount or discount amount";
      this.dialogService.openConfirmDialog(this.errStr);
      return;
    }
    this.ProductDetailsEntityData.isHistoricData = sessionStorage.getItem('isHistoricData');
    this.ProductDetailsEntityData.applyGstFlag = sessionStorage.getItem('applyGstFlag');
    this.ProductDetailsEntityData.currency = sessionStorage.getItem('currencyFlag');
    this.ProductDetailsEntityData.stateFlag = sessionStorage.getItem('sameStateFlag');
    this.showLoading = true;
    this.productDetailsService.updateProductDetails(this.ProductDetailsEntityData, headers, this.ProductDetailsEntityData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Product updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addProductDetailsForm.reset();
          //this.router.navigate(['searchRateContract/searchRcProductDetails/',this.ProductDetailsEntityData.rateContract.entityId,'list']);
          if (this.route.snapshot.params.task == null) {
            this.router.navigate(['searchRateContract/searchRcProductDetails', this.ProductDetailsEntityData.rateContract.entityId, 'list']);
          } else {
            this.router.navigate(['searchTask/searchRcProductDetails', this.ProductDetailsEntityData.rateContract.entityId, 'list', this.route.snapshot.params.task]);
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
    var productId = id;
    this.productDetailsService.getProductDetailsById(productId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ProductDetailsEntityData = resp;

    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  // product List
  productList: any = [];
  getProductList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    //this.sharedService.getAllProduct(headers).subscribe(resp => {
    this.sharedService.getAllProductByOrg(sessionStorage.getItem("rcOrgId"),headers).subscribe(resp => {
      debugger;
      this.productList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // hsn List
  hsnList: any = [];
  getHsnList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getAllHsn(headers).subscribe(resp => {
      debugger;
      this.hsnList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //Get selected hsn by code
  getPerticularHSN = function (code) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (code == null) {
      //this.ProductDetailsEntityData.hsnId = null;
      this.ProductDetailsEntityData.cgst = null;
      this.ProductDetailsEntityData.sgst = null;
      this.ProductDetailsEntityData.igst = null;
      return;
    }
    this.hsnMasterService.getHsnByCodeValue(code, headers).subscribe(resp => {
      debugger;
      //this.ProductDetailsEntityData.hsnId = resp.hsnCode;
      this.ProductDetailsEntityData.cgst = resp.cgst;
      this.ProductDetailsEntityData.sgst = resp.sgst;
      this.ProductDetailsEntityData.igst = resp.igst;
      if ((this.ProductDetailsEntityData.rate != null) || (this.ProductDetailsEntityData.quantity != null)) { this.cal(); }
      //vm.hsnCode= this.ProductDetailsEntityData.hsnId;
      //if(vm.hsnCode != vm.hsnCodeFromDB)
      //vm.needToUpdate = true;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  cal = function () {
    debugger;
    this.ProductDetailsEntityData.amount = +(this.ProductDetailsEntityData.rate * this.ProductDetailsEntityData.quantity).toFixed(2);
    this.ProductDetailsEntityData.totalDiscount = 0;
    this.ProductDetailsEntityData.totalDiscount += +((this.ProductDetailsEntityData.discount / 100) * this.ProductDetailsEntityData.amount).toFixed(2);
    if (this.ProductDetailsEntityData.discountAmount != null) {
      this.ProductDetailsEntityData.totalDiscount += +parseFloat(this.ProductDetailsEntityData.discountAmount).toFixed(2);
    }
    this.ProductDetailsEntityData.totalAmount = this.ProductDetailsEntityData.amount - this.ProductDetailsEntityData.totalDiscount;

    if (this.currency == "INR") {

      if (this.isHistoricData == "NO") {
        if (this.applyGstFlag == "YES") {
          if (this.isSameState == "true") {
            this.ProductDetailsEntityData.cgstAmount = +((this.ProductDetailsEntityData.cgst / 100) * this.ProductDetailsEntityData.totalAmount).toFixed(2);
            this.ProductDetailsEntityData.sgstAmount = +((this.ProductDetailsEntityData.sgst / 100) * this.ProductDetailsEntityData.totalAmount).toFixed(2);
            this.ProductDetailsEntityData.igstAmount = parseFloat("0");
            this.ProductDetailsEntityData.finalAmount = +parseFloat(this.ProductDetailsEntityData.totalAmount + this.ProductDetailsEntityData.cgstAmount + this.ProductDetailsEntityData.sgstAmount).toFixed(2);
            //vm.finalAmount = this.ProductDetailsEntityData.totalAmount + ((this.ProductDetailsEntityData.cgst + this.ProductDetailsEntityData.sgst) / 100 * this.ProductDetailsEntityData.totalAmount);
          } else {
            this.ProductDetailsEntityData.igstAmount = +((this.ProductDetailsEntityData.igst / 100) * this.ProductDetailsEntityData.totalAmount).toFixed(2);
            this.ProductDetailsEntityData.cgstAmount = parseFloat("0");
            this.ProductDetailsEntityData.sgstAmount = parseFloat("0");
            this.ProductDetailsEntityData.finalAmount = +parseFloat(this.ProductDetailsEntityData.totalAmount + this.ProductDetailsEntityData.igstAmount).toFixed(2);
            //vm.finalAmount = this.ProductDetailsEntityData.totalAmount + ((this.ProductDetailsEntityData.igst) / 100 * this.ProductDetailsEntityData.totalAmount);
          }
        } else {
          this.ProductDetailsEntityData.cgstAmount = parseFloat("0");
          this.ProductDetailsEntityData.sgstAmount = parseFloat("0");
          this.ProductDetailsEntityData.igstAmount = parseFloat("0");
          this.ProductDetailsEntityData.finalAmount = +parseFloat(this.ProductDetailsEntityData.totalAmount).toFixed(2);
          //vm.finalAmount = this.ProductDetailsEntityData.totalAmount;
        }
        /*
        if($state.params.isSameState=="true") {
        this.ProductDetailsEntityData.cgstAmount=(this.ProductDetailsEntityData.cgst/100)*this.ProductDetailsEntityData.totalAmount;
        this.ProductDetailsEntityData.sgstAmount=(this.ProductDetailsEntityData.sgst/100)*this.ProductDetailsEntityData.totalAmount;
        this.ProductDetailsEntityData.finalAmount=parseFloat(this.ProductDetailsEntityData.totalAmount+this.ProductDetailsEntityData.cgstAmount+this.ProductDetailsEntityData.sgstAmount);
        vm.finalAmount=this.ProductDetailsEntityData.totalAmount+((this.ProductDetailsEntityData.cgst+this.ProductDetailsEntityData.sgst)/100*this.ProductDetailsEntityData.totalAmount);
        getHSN          }else { 
        this.ProductDetailsEntityData.igstAmount=(this.ProductDetailsEntityData.igst/100)*this.ProductDetailsEntityData.totalAmount;
        this.ProductDetailsEntityData.finalAmount=parseFloat(this.ProductDetailsEntityData.totalAmount+this.ProductDetailsEntityData.igstAmount);
        vm.finalAmount=this.ProductDetailsEntityData.totalAmount+((this.ProductDetailsEntityData.igst)/100*this.ProductDetailsEntityData.totalAmount);
        }*/
      } else if (this.isHistoricData == "YES") {
        this.ProductDetailsEntityData.cgstAmount = parseFloat("0");
        this.ProductDetailsEntityData.sgstAmount = parseFloat("0");
        this.ProductDetailsEntityData.igstAmount = parseFloat("0");
        this.ProductDetailsEntityData.finalAmount = +parseFloat(this.ProductDetailsEntityData.totalAmount + this.ProductDetailsEntityData.serviceTax + this.ProductDetailsEntityData.vat).toFixed(2);
      }
    }
    else {
      this.ProductDetailsEntityData.igstAmount = +((this.ProductDetailsEntityData.igst / 100) * this.ProductDetailsEntityData.totalAmount).toFixed(2);
      this.ProductDetailsEntityData.finalAmount = +(this.ProductDetailsEntityData.totalAmount + this.ProductDetailsEntityData.igstAmount).toFixed(2);
    }
  }



  ngOnInit() {
    this.addProductDetailsForm = this.formBuilder.group({
      productName: [null, Validators.required],
      hsnId: [null, Validators.required],
      rate: [0, Validators.required],
      quantity: [1, Validators.required],
      amount: [0, Validators.required],
      discount: [0],
      discountAmount: [0],
      totalDiscount: [0],
      totalAmount: [0],
      description: [null],
      cgst: [0],
      sgst: [0],
      igst: [0],
      cgstAmount: [0],
      sgstAmount: [0],
      igstAmount: [0],
      serviceTax: [0],
      vat: [0],
      finalAmount: [0]
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Product Details";
      this.editon(this.route.snapshot.params.id);
      //this.disabledField();
    }
    this.debugger;
    /* this.isHistoricData = sessionStorage.getItem('isHistoricData');
    this.applyGstFlag = sessionStorage.getItem('applyGstFlag');
    this.currency = sessionStorage.getItem('currencyFlag');
    this.isSameState = sessionStorage.getItem('sameStateFlag'); */

    this.disabledField();
    this.getProductList();
    this.getHsnList();
  }

  get formControls() {
    return this.addProductDetailsForm.controls;
  }

}