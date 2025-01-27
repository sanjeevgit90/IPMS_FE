import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { AddressMasterService } from '../../address-master/address-master.service';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  providers: [AddressMasterService, AppGlobals, DialogService, SharedService]

})
export class AddAddressComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private addressMasterService: AddressMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }


  showLoading: boolean = false;

  totalRecords: any;


  PageTitle = "Add Party Address";
  add = true;
  edit = false;
  list = true;

  matSelectDuration = this._global.matSelectDurationTime;
  
  PartyAddressData = {
    "addressType": "", "address1": "", "address2": "",
    "landmark": "", "state": "", "district": "",
    "city": "", "country": "INDIA", "pinCode": "", "partyMasterParent": "", "contactPerson": "", "contactNo":""
  };

  PartyParent = { "entityId": "" };

  stateList: any = [];
  districtList: any = [];
  cityList: any = [];

  addAddressForm: FormGroup;
  isSubmitted = false;
  back = function () {
    //this.router.navigate(['/SearchPartyAddress']);
    if (this.route.snapshot.params.page == 'edit') {
      this.router.navigate(['searchParty/SearchPartyAddress/' + this.PartyAddressData.partyMasterParent.entityId + '/list']);
    } else if (this.route.snapshot.params.page == 'add') {
      this.router.navigate(['searchParty/SearchPartyAddress/' + this.route.snapshot.params.id + '/list']);
    }
  }

  // compareObjects(o1: any, o2: any): boolean {
  //   return o1.name === o2.name && o1.id === o2.id;
  // }

  // State List
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

  getActiveCityFromDistrict = function (districtName) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCityListFromDistrict(headers, districtName).subscribe(resp => {
      debugger;
      this.cityList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // district List

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

  addAddress = function (flag) {
    debugger;
    this.isSubmitted = true;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addAddressForm.invalid) {
      return;
    }
    if (flag != "update") {
      this.PartyParent.entityId = this.route.snapshot.params.id;
      this.PartyAddressData.partyMasterParent = this.PartyParent;
    }

    this.showLoading = true;
    this.addressMasterService.saveAddress(this.PartyAddressData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Party address " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addAddressForm.reset();
          if (flag == "update") {
            this.router.navigate(['searchParty/SearchPartyAddress/' + this.PartyAddressData.partyMasterParent.entityId + '/list']);
          }
        })

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // Edit
  editon = function (id, flag) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var addressId = id;
    this.addressMasterService.findAddressById(addressId, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.PartyAddressData = resp;
      this.getAllDistrictByState(this.PartyAddressData.state);
      this.getActiveCityFromDistrict(this.PartyAddressData.district);
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  ngOnInit(): void {
    this.addAddressForm = this.formBuilder.group({
      addressType: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      landmark: [''],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: [''],
      country: ['', Validators.required],
      pinCode: [''],
      contactPerson:[''],
      contactNo:['']

    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Address";
      this.editon(this.route.snapshot.params.id, 'edit');

    }

    this.getAllState();
  }
  get formControls() {
    return this.addAddressForm.controls;
  }

}
