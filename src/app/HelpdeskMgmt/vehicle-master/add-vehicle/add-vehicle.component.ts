import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { VehicleMasterService } from '../vehicle-master.service';
import { FileuploadService } from '../../../service/fileupload.service';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  providers: [VehicleMasterService,AppGlobals, DialogService, SharedService,FileuploadService]

})
export class AddVehicleComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private vehicleMasterService: VehicleMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,private fileuploadService: FileuploadService) { }

 showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "Vehicle Master";

  vehRegFiles: any = [];
  vehInsFiles: any = [];
  vehPollFiles: any = [];
  vehOtherFiles: any = [];
  vehLetterFiles: any = [];
  vehInvoiceFiles: any = [];
  vehReleaseFiles: any = [];


  add = true;
  edit = false;
  list = true;
  VehicleData = {
    "vehicleType":null,"vehicleName":null,"vehicleMake":null,"vendorName":null,"vehicleCateory":null,
    "vehicleRegNumber":null,"vehiclepurchaseDate":null,"deliveryDate":null,
    "projectName":null,"vehicleInsurance":null,"pollutionClearanceDone":null,
    "state":null,"district":null,"usid":null,"remarks":null
  };


  stateList:any = [];
  districtList:any = [];
  projectList:any = [];
  manufactureList:any = [];
  categoryList:any = [];
  locationList:any = [];
  
  


  addVehicleMasterForm: FormGroup;
  isSubmitted = false;
  

  back = function () {
    this.router.navigate(['/searchVehicle']);
  }

  getAllState = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getStateList(headers).subscribe(resp => {
      debugger;
      this.stateList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // districtL List

  getAllDistrictByState = function (stateName) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDistrictList(headers, stateName).subscribe(resp => {
      debugger;
      this.districtList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  
  getProjectList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  
  getManfactureList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveManufacturer(headers).subscribe(resp => {
      debugger;
      this.manufactureList = resp;
      this.showLoading = false;
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


 
  
  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }


  getActiveLocationsFromDistrict = function (district) {
    // debugger;
     const headers = { "Authorization": sessionStorage.getItem("token") };
     this.showLoading = true;
     this.sharedService.getActiveLocationsFromDistrict(headers, district).subscribe(resp => {
     //  debugger;
       this.locationList = resp;
       this.showLoading = false;
     }, (error: any) => {
       debugger;
       this.showLoading = false;
       const errStr = error.error.errorDetail[0];
       this.dialogService.openConfirmDialog(errStr)
     });
   }



  // getLocationList = function () {
  //   debugger;
  //   const headers = { "Authorization": sessionStorage.getItem("token") };
  //   this.showLoading = true;
  //   this.sharedService.getActiveCategory(headers).subscribe(resp => {
  //     debugger;
  //     this.categoryList = resp;
  //     this.showLoading = false;
  //   }, (error: any) => {
  //     debugger;
  //     this.showLoading = false;
  //     const errStr = error.message;
  //     this.dialogService.openConfirmDialog(errStr)
  //   });
  // }

  // Add / update function
  addVehicle = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addVehicleMasterForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };

     //If mandatory then check for atleast one fileuploaded
    //  if (!this.fileuploadService.hasfile(this.vehRegFiles)) {
    //   this.dialogService.openConfirmDialog("Please uplaod profile pic")
    //   return;
    // }
     //Check if all files are uploaded Successfully
  if (this.vehRegFiles.length>0){
     if (!this.fileuploadService.allFilesUploaded(this.vehRegFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.VehicleData.regCertificate = this.fileuploadService.getFirstFilePath(this.vehRegFiles);
  }
  if (this.vehInsFiles.length>0){
   if (!this.fileuploadService.allFilesUploaded(this.vehInsFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.VehicleData.insuranceCertificate = this.fileuploadService.getFirstFilePath(this.vehInsFiles);
  }
  if (this.vehPollFiles.length>0){
  
    if (!this.fileuploadService.allFilesUploaded(this.vehPollFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.VehicleData.pollutionCertificate = this.fileuploadService.getFirstFilePath(this.vehPollFiles); 
  }
  if (this.vehOtherFiles.length>0){
  
    if (!this.fileuploadService.allFilesUploaded(this.vehOtherFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.VehicleData.otherDocuments = this.fileuploadService.getFirstFilePath(this.vehOtherFiles);
  }
  if (this.vehLetterFiles.length>0){
  
    if (!this.fileuploadService.allFilesUploaded(this.vehLetterFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.VehicleData.letterOfIntent = this.fileuploadService.getFirstFilePath(this.vehLetterFiles);

  }
  if (this.vehInvoiceFiles.length>0){
  
    if (!this.fileuploadService.allFilesUploaded(this.vehInvoiceFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.VehicleData.invoice = this.fileuploadService.getFirstFilePath(this.vehInvoiceFiles);
  }
  if (this.vehReleaseFiles.length>0){
    if (!this.fileuploadService.allFilesUploaded(this.vehReleaseFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.VehicleData.releaseDocument = this.fileuploadService.getFirstFilePath(this.vehReleaseFiles);
}
    
        this.VehicleData.vehiclepurchaseDate = this.VehicleData.vehiclepurchaseDate.getTime();
        this.VehicleData.deliveryDate = this.VehicleData.deliveryDate.getTime();
         this.showLoading = true;
    
    this.vehicleMasterService.saveVehicle(this.VehicleData,headers,flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Vehicle " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {

          this.addVehicleMasterForm.reset();
          if (flag == 'update' || 'save') {
            this.router.navigate(['/searchVehicle']);
          }
          //this.VehicleData = {};
          //this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
          }
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.VehicleData.vehiclepurchaseDate = (new Date(this.VehicleData.vehiclepurchaseDate));
      this.VehicleData.deliveryDate = (new Date(this.VehicleData.deliveryDate));
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  


  

  // Get data by id
  editon = function (id,flag) {
    debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var entityId = id;
    this.PageTitle = "Update Vehicle Master";
    this.disabledField();
    this.vehicleMasterService.vehicleById(entityId, headers,flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.VehicleData = resp;

      this.VehicleData.vehiclepurchaseDate = (new Date(this.VehicleData.vehiclepurchaseDate));
        this.VehicleData.deliveryDate = (new Date(this.VehicleData.deliveryDate));
        this.getAllState();
        this.getAllDistrictByState(this.VehicleData.state);
        this.getActiveLocationsFromDistrict(this.VehicleData.district)
      
       
    if ( this.VehicleData.regCertificate != null) {
      this.vehRegFiles = this.fileuploadService.getSingleFileArray( this.VehicleData.regCertificate);
    } 
 
  if ( this.VehicleData.insuranceCertificate != null) {
      this.vehInsFiles = this.fileuploadService.getSingleFileArray(this.VehicleData.insuranceCertificate);
    } 
  
   if ( this.VehicleData.pollutionCertificate != null) {
      this.vehPollFiles = this.fileuploadService.getSingleFileArray(this.VehicleData.pollutionCertificate);
    } 
   if ( this.VehicleData.otherDocuments  != null) {
      this.vehOtherFiles = this.fileuploadService.getSingleFileArray( this.VehicleData.otherDocuments );
    } 
if ( this.VehicleData.letterOfIntent  != null) {
      this.vehLetterFiles = this.fileuploadService.getSingleFileArray(this.VehicleData.letterOfIntent);
    } 
if ( this.VehicleData.invoice!= null) {
      this.vehInvoiceFiles = this.fileuploadService.getSingleFileArray(this.VehicleData.invoice);
    } 
if ( this.VehicleData.releaseDocument!= null) {
      this.vehReleaseFiles = this.fileuploadService.getSingleFileArray(this.VehicleData.releaseDocument);
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
    this.addVehicleMasterForm.get('vehicleRegNumber').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addVehicleMasterForm.get('vehicleRegNumber').enable();
  }

  ngOnInit(): void {
    this.addVehicleMasterForm = this.formBuilder.group({
      vehicleType:[null, Validators.required],
      vehicleName:[null, Validators.required],
      vehicleMake:[null, Validators.required],
      vendorName:[null, Validators.required],
      vehicleCateory:[null, Validators.required],
      vehicleRegNumber:[null, Validators.required],
      vehiclepurchaseDate:[null, Validators.required],
      deliveryDate:[null, Validators.required],
      projectName:[null],
      vehicleInsurance:[null,Validators.required],
      pollutionClearanceDone:[null,Validators.required],
      state:[null,Validators.required],
      district:[null,Validators.required],
      usid:[null,Validators.required],
      remarks:[null],
     
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Vehicle";
      this.editon(this.route.snapshot.params.id, 'edit');

    }


    this.getAllState();
    this.getProjectList(); 
    this.getManfactureList();
    this.getActiveCategory();
   // this.getLocationList
  }
  get formControls() { 
    return this.addVehicleMasterForm.controls;
   }
  
}













