import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { VehicleServiceMasterService } from '../vehicle-service-master.service';
import { FileuploadService } from '../../../service/fileupload.service';


@Component({
  selector: 'app-add-vehicle-service',
  templateUrl: './add-vehicle-service.component.html',
  providers: [VehicleServiceMasterService, AppGlobals, DialogService, SharedService, FileuploadService]

})
export class AddVehicleServiceComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient,
    private vehicleServiceMasterService: VehicleServiceMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private fileuploadService: FileuploadService) { }

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "Vehicle Service Master";
  vehServiceFiles: any = [];

  add = true;
  edit = false;
  list = true;
  VehicleServiceData = {
    "vehicleRegistrationNumber": "", "servicePeriodFrom": "", "servicePeriodTo": "", "serviceInvoiceNumber": "", "serviceCentreName": "",
    "kilometerReading": "", "serviceStatus": "", "nextServiceDueDate": "", "serviceCostIncurred": "",
    "uploadedAttachment": null, "remark": "", "isAFreeService": "NO"
  };

  addVehicleServiceForm: FormGroup;
  isSubmitted = false;
  IsAFreeService = "NO";
  vehicleList: any = [];




  back = function () {
    this.router.navigate(['/searchService']);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }


  getActiveVehicleList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveVehicleList(headers).subscribe(resp => {
      debugger;
      this.vehicleList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  checked: boolean = false;
  checkChange(checked: boolean) {
    debugger;
    this.checked = !checked;
    this.IsAFreeService = this.checked ? "YES" : "NO";
    this.VehicleServiceData.isAFreeService = this.IsAFreeService;
    // this.POEntityData.currency = this.checked ? "INR" : null;
  }




  // Add / update function
  addVehicleService = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addVehicleServiceForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };

    if (this.vehServiceFiles.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.vehServiceFiles)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.VehicleServiceData.uploadedAttachment = this.fileuploadService.getFirstFilePath(this.vehServiceFiles);
    }
    this.VehicleServiceData.servicePeriodFrom = this.VehicleServiceData.servicePeriodFrom.getTime();
    this.VehicleServiceData.servicePeriodTo = this.VehicleServiceData.servicePeriodTo.getTime();
    this.VehicleServiceData.nextServiceDueDate = this.VehicleServiceData.nextServiceDueDate.getTime();
    this.showLoading = true;

    this.vehicleServiceMasterService.saveVehicleService(this.VehicleServiceData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Vehicle Service " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {

          this.addVehicleServiceForm.reset();
          if (flag == 'update' || 'save') {
            this.router.navigate(['/searchService']);
          }
          //this.VehicleServiceData = {};
          //this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
          }
        })

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr);
      this.VehicleServiceData.servicePeriodFrom = (new Date(this.VehicleServiceData.servicePeriodFrom));
      this.VehicleServiceData.servicePeriodTo = (new Date(this.VehicleServiceData.servicePeriodTo));
      this.VehicleServiceData.nextServiceDueDate = (new Date(this.VehicleServiceData.nextServiceDueDate));
    });
  }





  // Get data by id
  editon = function (id, flag) {
    debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var vehicleRegistrationNumber = id;
    this.PageTitle = "Update Vehicle Service Master";
    this.vehicleServiceMasterService.vehicleServiceByVehicleRegNo(vehicleRegistrationNumber, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.VehicleServiceData = resp;
      if (this.VehicleServiceData.isAFreeService != null) {
        if (this.VehicleServiceData.isAFreeService == "YES") {
          this.checked = true;
        }
        else {
          this.checked = false;
        }
      }
      this.VehicleServiceData.servicePeriodFrom = (new Date(this.VehicleServiceData.servicePeriodFrom));
      this.VehicleServiceData.servicePeriodTo = (new Date(this.VehicleServiceData.servicePeriodTo));
      this.VehicleServiceData.nextServiceDueDate = (new Date(this.VehicleServiceData.nextServiceDueDate));
      if (this.VehicleServiceData.uploadedAttachment != null) {
        this.vehServiceFiles = this.fileuploadService.getSingleFileArray(this.VehicleServiceData.uploadedAttachment);
      }
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.addVehicleServiceForm = this.formBuilder.group({
      vehicleRegistrationNumber: ['', Validators.required],
      servicePeriodFrom: ['', Validators.required],
      servicePeriodTo: ['', Validators.required],
      serviceInvoiceNumber: [''],
      serviceCentreName: ['', Validators.required],
      kilometerReading: ['', Validators.required],
      serviceStatus: [''],
      nextServiceDueDate: ['', Validators.required],
      serviceCostIncurred: [''],
      uploadedAttachment: [null],
      remark: [''],


    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Vehicle Service";
      this.editon(this.route.snapshot.params.id, 'edit');

    }

    //this.getEolList;
    this.getActiveVehicleList();

  }
  get formControls() {
    return this.addVehicleServiceForm.controls;
  }

}


















