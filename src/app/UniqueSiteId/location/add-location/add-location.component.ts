import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../location.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  providers: [LocationService, AppGlobals, DialogService, SharedService]
})
export class AddLocationComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private locationService: LocationService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;
  PageTitle = "Location Master";
  addLocationForm: FormGroup;
  isSubmitted = false;
  successMessage: string;
  add: boolean = true;
  edit: boolean = false;
  list: boolean = true;
  disablefield:boolean=false;  
  matSelectDuration = this._global.matSelectDurationTime;  
  


  back = function () {
    this.router.navigate(['/searchLocation']);
  }
  addlocation(flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addLocationForm.invalid) {
      return;
    }
    this.showLoading = true;
    console.log(this.addLocationForm.value);

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.addLocationForm.value.surveydate = this.addLocationForm.value.surveydate.getTime();
    this.addLocationForm.value.approvaldate = this.addLocationForm.value.approvaldate.getTime();
    this.locationService.saveLocation(this.addLocationForm.value, headers, flag).subscribe(res => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Unique Site ID " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
      this.router.navigate(['/searchLocation']);  
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Edit
  editon = function (locationId, flag) {
    debugger;
    this.add = false;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.locationService.findlocationById(locationId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.addLocationForm.value = resp;
      //this.getActiveDistrictFromstate(this.addLocationForm.value.state);
      this.addLocationForm.patchValue({
      locationid: this.addLocationForm.value.locationid,
      state: this.addLocationForm.value.state,
      district: this.addLocationForm.value.district,
      city: this.addLocationForm.value.city,
      policestation: this.addLocationForm.value.policestation,
      locationaddress: this.addLocationForm.value.locationaddress,
      surveydate: (new Date(this.addLocationForm.value.surveydate)),
      approvaldate: (new Date(this.addLocationForm.value.approvaldate)),
      
      zip: this.addLocationForm.value.zip,
      country: this.addLocationForm.value.country,
      latitude: this.addLocationForm.value.latitude,
      longitude: this.addLocationForm.value.longitude,
      contactperson: this.addLocationForm.value.contactperson,
      emailid: this.addLocationForm.value.emailid,
      phoneno: this.addLocationForm.value.phoneno,
      isprioritysite: this.addLocationForm.value.isprioritysite,
      warehouse: this.addLocationForm.value.warehouse
      });

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // State List
  stateList: any = [];

  getActiveState = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getStateList(headers).subscribe(resp => {
      debugger;
      this.stateList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // district List
  districtList: any = [];
  getActiveDistrictFromstate = function (state) {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getDistrictList(headers, state).subscribe(resp => {
      debugger;
      this.districtList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // City List
  cityList: any = [];
  getActiveCityFromDistrict = function (district) {
    debugger;
    if (district == null) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCityListFromDistrict(headers, district).subscribe(resp => {
      debugger;
      this.cityList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // PoliceStation List
  policestationList: any = [];
  getActivePoliceStationFromCity = function (name) {
    debugger;
    if (name == null) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActivePoliceStationFromCity(headers, name).subscribe(resp => {
      debugger;
      this.policestationList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Disabled Function
  disabledField = function () {
    this.disablefield =true;
  }

  ngOnInit(): void {

    if (this.route.snapshot.params.page == 'edit') {
      this.disabledField();
      this.edit = true;
      this.PageTitle = "Update Unique Site Id";
      this.editon(this.route.snapshot.params.id, 'edit');
    }

    if (this.route.snapshot.params.page == 'view') {
      this.edit = false;
      this.PageTitle = "View Unique Site Id";
      this.editon(this.route.snapshot.params.id, 'view');
    }

    this.getActiveState();

    this.addLocationForm = new FormGroup({
      locationid: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      policestation: new FormControl('', Validators.required),
      locationaddress: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      country: new FormControl('INDIA'),
      latitude: new FormControl('0'),
      longitude: new FormControl('0'),
      contactperson: new FormControl(''),
      warehouse: new FormControl(Boolean),
      //contact_person:new FormControl('', Validators.required),
      phoneno: new FormControl(''),
      emailid: new FormControl(''),
      isprioritysite: new FormControl(Boolean),
      surveydate: new FormControl('', Validators.required),
      approvaldate: new FormControl('', Validators.required)

      //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      //email: new FormControl('', [Validators.required, Validators.email]),

    })
  }

  get formControls() {
    return this.addLocationForm.controls;
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.addLocationForm.controls[controlName].hasError(errorName);
  }

}
