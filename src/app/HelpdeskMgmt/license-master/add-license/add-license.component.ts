import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { LicenseMasterService } from '../license-master.service';

@Component({
  selector: 'app-add-license',
  templateUrl: './add-license.component.html',
 providers: [LicenseMasterService,AppGlobals, DialogService, SharedService]

})
export class AddLicenseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private licenseMasterService: LicenseMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

 showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;


  PageTitle = "License Master";
  add = true;
  edit = false;
  list = true;
  LicenseData = {
    "licenseTag":"","softwareName":"","serialNo":"","licenseToName":"","licenseToEmail":"","seats":"",
    "orderNo":"","category":"",
    "subCategory":"","purchaseDate":"","purchaseCost":"",
    "depreciation":"","warranty":"","eol":"","uploadedAttachment":null,"notes":""
  };
   
  categoryList : any = []; 
  subcategoryList : any = []; 
  uploadFiles : any = []; 
 
  eolList={};

  addLicenseMasterForm: FormGroup;
  isSubmitted = false;
  

  back = function () {
    this.router.navigate(['/searchLicense']);
  }



  getEolList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.eolList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // Add / update function
  addLicense = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addLicenseMasterForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
        this.LicenseData.purchaseDate = this.LicenseData.purchaseDate.getTime();
        this.LicenseData.warranty = this.LicenseData.warranty.getTime();
         this.showLoading = true;
     if (this.uploadFiles.length>0){
  
          if (!this.fileuploadService.allFilesUploaded(this.uploadFiles)) {
            this.dialogService.openConfirmDialog("Files uploading...")
            return;
          }
          this.LicenseData.uploadedAttachment = this.fileuploadService.getFirstFilePath(this.uploadFiles); 
    }
    this.licenseMasterService.saveLicense(this.LicenseData,headers,flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "License " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.LicenseData = {};
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.enabledField();
          }
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  getActiveCategory = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveCategory(headers).subscribe(resp => {
      debugger;
      this.categoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

   // subcategory List from category

   getActiveSubCategoryfromcategory = function (name) {
    debugger;
    
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveSubCategoryfromcategory(headers, name).subscribe(resp => {
      debugger;
      this.subcategoryList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }




  // getAllCategory = function () {
  //   debugger;
  //   const headers = { "Authorization": sessionStorage.getItem("token") };
  //   this.showLoading = true;
  //   this.sharedService.ActiveCategoryList(headers).subscribe(resp => {
  //     debugger;
  //     this.CategoryList = resp;
  //     this.showLoading = false;
  //   }, (error: any) => {
  //     debugger;
  //     this.showLoading = false;
  //     const errStr = error.message;
  //     this.dialogService.openConfirmDialog(errStr)
  //   });
  // }

  // getAllSubcategory = function () {
  //   debugger;
  //   const headers = { "Authorization": sessionStorage.getItem("token") };
  //   this.showLoading = true;
  //   this.sharedService.getActiveSubCategory(headers).subscribe(resp => {
  //     debugger;
  //     this.subCategoryList = resp;
  //     this.showLoading = false;
  //   }, (error: any) => {
  //     debugger;
  //     this.showLoading = false;
  //     const errStr = error.message;
  //     this.dialogService.openConfirmDialog(errStr)
  //   });
  // }
  


  


  

  // Get data by id
  editon = function (id,flag) {
    debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var licenseTag = id;
    this.PageTitle = "Update License Master";
    this.disabledField();
    this.licenseMasterService.licenseById(licenseTag,headers,flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.LicenseData = resp;
      if (this.LicenseData.uploadedAttachment != null) {
        this.uploadFiles = this.fileuploadService.getSingleFileArray(this.LicenseData.uploadedAttachment);
      } 
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

   // Disabled Function
   disabledField = function () {
    this.addLicenseMasterForm.get('licenseTag').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addLicenseMasterForm.get('licenseTag').enable();
  }

  ngOnInit(): void {
    this.addLicenseMasterForm = this.formBuilder.group({
      licenseTag:['', Validators.required],
      softwareName:['', Validators.required],
      serialNo:['', Validators.required],
      licenseToName:['', Validators.required],
      licenseToEmail:[''],
      seats:['', Validators.required],
      orderNo:['', Validators.required],
      category:['', Validators.required],
      subCategory:[''],
      purchaseDate:['',Validators.required],
      purchaseCost:['',Validators.required],
      depreciation:['',Validators.required],
      warranty:['',Validators.required],
      eol:[''],
      uploadedAttachment:[''],
      notes:[''],

     
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update License";
      this.editon(this.route.snapshot.params.id, 'edit');

    }
    this.getActiveCategory();
    
    this.getEolList;

  }
  get formControls() { 
    return this.addLicenseMasterForm.controls;
   }
  
}














