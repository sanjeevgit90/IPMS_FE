import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { ProductMasterService } from '../productmaster.service';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  providers: [ProductMasterService, AppGlobals, DialogService, SharedService]
})
export class AddProductComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private productService: ProductMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }


  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;


  PageTitle = "Add Product";
  add = true;
  edit = false;
  list = true;

  ProductData = {
    "productname": null, "serialno": null, "barcode": null,
    "producttype": null, "description": null, "hsndescription": null,
    "baseuom": null, "ishazardous": false, "hazardousgoodtype": null,
    "category": null, "subcategory": null, "manufacturer": null,
    "model": null, "hsncode": null
  };

  hazardousChange() {
   
    if (this.ProductData.ishazardous == true) {
      this.addProductForm.get('hazardousgoodtype').enable();
    }
    else {
      this.addProductForm.get('hazardousgoodtype').disable();
    }
  }

  clearFields = function () {
    this.ProductData = {
      "productname": "", "serialno": "", "barcode": "",
      "producttype": "", "description": "", "hsndescription": "",
      "baseuom": "", "ishazardous": false, "hazardousgoodtype": "",
      "category": "", "subcategory": "", "manufacturer": "",
      "model": "", "hsncode": ""
    };
  }


  compareObjects(o1: any, o2: any): boolean {
    // console.log(o1 == o2);
    return o1 == o2;

    // return o1.name == o2.name && o1.id == o2.id;
  }

  hsnList: any = [];
  categoryList: any = [];
  subcategoryList: any = [];
  manufacturerList: any = [];
  modelList: any = [];
  baseUomList: any = [];
  ConstantData = { "type": "" };

  addProductForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.router.navigate(['/searchProduct']);
  }


  // hsnList
  getActiveHsn = function () {
    //debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveHsn(headers).subscribe(resp => {
     debugger;
      this.hsnList = resp;
    }, (error: any) => {
     
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // manufacturerList
  getActiveManufacturer = function () {
   
    const headers = { "Authorization": sessionStorage.getItem("token") };

    this.sharedService.getActiveManufacturer(headers).subscribe(resp => {
     
      this.manufacturerList = resp;
    }, (error: any) => {
     
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Model List

  getActiveModelfrommanufacturer = function (name) {
   
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveModelfrommanufacturer(headers, name).subscribe(resp => {
     
      this.modelList = resp;
    }, (error: any) => {
     
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // category List

  getActiveCategory = function () {
   
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCategory(headers).subscribe(resp => {
     
      this.categoryList = resp;
    }, (error: any) => {
     
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

  getAllConstants = function (flag) {
   
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.ConstantData.type = flag;
    this.sharedService.getAllConstant(this.ConstantData, headers).subscribe(resp => {
      debugger
      this.baseUomList = resp;
    }, (error: any) => {
     
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  addProduct = function (flag) {
   
    this.isSubmitted = true;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addProductForm.invalid) {
      return;
    }
    this.showLoading = true;
    this.productService.saveProductData(this.ProductData, headers, flag).subscribe(resp => {
     
      this.showLoading = false;
      this.successMessage = "Product " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.clearFields();
          this.router.navigate(['/searchProduct']);
        })

    }, (error: any) => {
     
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  disableAll = function () {
    this.addProductForm.get('productname').disable();
    this.addProductForm.get('serialno').disable();
    this.addProductForm.get('barcode').disable();
    this.addProductForm.get('producttype').disable();
    this.addProductForm.get('baseuom').disable();
    this.addProductForm.get('category').disable();
    this.addProductForm.get('subcategory').disable();
    this.addProductForm.get('manufacturer').disable();
    this.addProductForm.get('model').disable();
    this.addProductForm.get('hsncode').disable();
    this.addProductForm.get('ishazardous').disable();
    this.addProductForm.get('hazardousgoodtype').disable();
    this.addProductForm.get('hsndescription').disable();
    this.addProductForm.get('description').disable();
  }

  // Edit
  editon = function (id, flag) {
   
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.productService.productById(id, headers, flag).subscribe(resp => {
     
      this.showLoading = false;
      this.ProductData = resp;
      console.log(this.ProductData);
      if (flag == 'view') {
        this.edit = false;
        this.view = true;
        this.add = false;
      }
      else {
        this.edit = true;
        this.add = false;
        this.view = false;
      }

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.addProductForm = this.formBuilder.group({
      productname: [null, Validators.required],
      serialno: [null, Validators.required],
      barcode: [''],
      producttype: [null, Validators.required],
      baseuom: [null, Validators.required],
      category: [null, Validators.required],
      subcategory: [''],
      manufacturer: [''],
      model: [''],
      hsncode: [null, Validators.required],
      ishazardous: [false],
      hazardousgoodtype: [''],
      description: [''],
      hsndescription: ['']
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Product";
      this.editon(this.route.snapshot.params.id, 'edit');
    }
    else if (this.route.snapshot.params.page == 'view') {
      this.PageTitle = "View Product";
      this.disableAll();
      this.editon(this.route.snapshot.params.id, 'view');
    }


    this.getActiveHsn();
    this.getActiveCategory();
    this.getActiveManufacturer();
    this.getAllConstants("uom");
  }
  get formControls() {
    return this.addProductForm.controls;
  }

}