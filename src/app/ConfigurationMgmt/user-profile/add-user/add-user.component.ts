import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { UserProfileService } from '../user-profile.service';
import { SharedService } from '../../../service/shared.service';
import { FileuploadService } from '../../../service/fileupload.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  providers: [UserProfileService, AppGlobals, DialogService, SharedService, FileuploadService]
})
export class AddUserComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private userProfileService: UserProfileService,
    private _global: AppGlobals, private dialogService: DialogService,
    private sharedService: SharedService, private fileuploadService: FileuploadService) { }

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild('picker') picker: any;
  open() {
    this.picker.open();
  }
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  profilefiles: any = [];

  PageTitle = "Add User";
  add: boolean = true;
  edit: boolean = false;
  list: boolean = true;
  roleAdmin: boolean = false;
  roleAdminbtn: boolean = false;
  profilepic: boolean = true;
  compareOrg(o1: any, o2: any): boolean {
    return o1 == o2.entityId;
  }
  compareRole(o1: any, o2: any): boolean {
    return o1 == o2.rolename;
  }
  compareTlDist(o1: any, o2: any): boolean {
    return o1 == o2.id.geographyname;
  }
  UserProfileData = {
    "firstName": null, "lastName": null, "mobileNumber": null,
    "gender": null, "bloodGroup": null, "dob": null,
    "emailId": null, "emergencyContactMobile": null, "emergencyContactPerson": null,
    "address": null, "state": null, "district": null,
    "country": null, "designation": null, "doj": null,
    "employeeCode": null, "department": null, "organizations": null,
    "roles": [], "profileImage": null, "mappeddistrict": null,
  };
  tLState: string = null;
  TLdistrictList: any = [];
  stateList: any = [];
  districtList: any = [];
  departmentList: any = [];
  organizationsList: any = [];
  roleList: any = [];
  orgFormatData: any = [];
  roleFormatData: any = [];
  districtFormatData: any = [];
  tlFlag: boolean = false;
  addUserForm: FormGroup;
  isSubmitted: boolean = false;
  back = function () {
    this.router.navigate(['/searchUsers']);
  }
  backprofile = function () {
    this.router.navigate(['/profile']);
  }
  getAllTLDistrictByState = function (stateName) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDistrictList(headers, stateName).subscribe(resp => {
      this.TLdistrictList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Department List
  getAllDepartment = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDepartmentList(headers).subscribe(resp => {
      this.departmentList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Organizations List
  getAllOrganizations = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getOrganizationsList(headers).subscribe(resp => {
      this.organizationsList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Role List
  getAllRole = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getRoleList(headers).subscribe(resp => {
      this.roleList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // State List
  getAllState = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getStateList(headers).subscribe(resp => {
      debugger;
      this.stateList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // DistrictL List
  getAllDistrictByState = function (stateName) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDistrictList(headers, stateName).subscribe(resp => {
      this.districtList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  orgElements = [];
  SelectORG = function (items) {
    this.orgFormatData = [];
    for (let i = 0; i < items.length; i++) {
      this.item1 = {};
      this.item1.entityId = items[i];
      this.orgFormatData.push(this.item1);
    }
  }

  SelectRole = function (items) {
    this.disableTLStateDist();
    for (let i = 0; i < items.length; i++) {
      if (items[i] == "ROLE_TEAM_LEADER") {
        this.addUserForm.get('mappeddistrict').enable();
        this.addUserForm.get('tLState').enable();
        break;
      }
    }
    this.roleFormatData = [];
    for (let i = 0; i < items.length; i++) {
      this.item2 = {};
      this.item2.rolename = items[i];
      this.roleFormatData.push(this.item2);
      if (items[i] == 'ROLE_TEAM_LEADER') {
        this.tlFlag = true;
      }
      console.log(this.roleFormatData);
    }
  }
  GetRoleAsString = function (roleList) {
    let roleString = "";
    for (let i = 0; i < roleList.length; i++) {
      roleString = roleList[i].rolename + ",";
    }
  }
  SelectDistrict = function (items) {
    this.districtFormatData = [];
    for (let i = 0; i < items.length; i++) {
      this.item3 = {};
      this.itemtemp = {};
      this.itemtemp.geographyname = items[i];
      this.itemtemp.parentgeography = this.tLState;
      this.item3.id = this.itemtemp;
      this.districtFormatData.push(this.item3);
    }
  }
  addUser = function () {
    this.isSubmitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };

    //If mandatory then check for atleast one fileuploaded
    if (!this.fileuploadService.hasfile(this.profilefiles)) {
      this.dialogService.openConfirmDialog("Please uplaod profile pic")
      return;
    }
    //Check if all files are uploaded Successfully
    if (!this.fileuploadService.allFilesUploaded(this.profilefiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }

    this.UserProfileData.profileImage = this.fileuploadService.getFirstFilePath(this.profilefiles);
    this.UserProfileData.organizations = this.orgFormatData;
    this.UserProfileData.roles = this.roleFormatData;
    this.UserProfileData.mappeddistrict = this.districtFormatData;
    this.UserProfileData.confirmed = true;
    this.UserProfileData.userName = this.UserProfileData.emailId;
    this.UserProfileData.password = "admin";
    if (this.UserProfileData.dob != null) {
      this.UserProfileData.dob = this.UserProfileData.dob.getTime();
    }
    if (this.UserProfileData.doj != null) {
      this.UserProfileData.doj = this.UserProfileData.doj.getTime();
    }

    this.showLoading = true;
    this.userProfileService.saveUser(this.UserProfileData, headers).subscribe(resp => {
      this.showLoading = false;
      this.successMessage = "User added successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.router.navigate(['/searchUsers']);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  updateprofile = function () {
    this.isSubmitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    //If mandatory then check for atleast one fileuploaded
    if (!this.fileuploadService.hasfile(this.profilefiles)) {
      this.dialogService.openConfirmDialog("Please uplaod profile pic")
      return;
    }
    //Check if all files are uploaded Successfully
    if (!this.fileuploadService.allFilesUploaded(this.profilefiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.UserProfileData.profileImage = this.fileuploadService.getFirstFilePath(this.profilefiles);
    if (this.UserProfileData.dob != null) {
      this.UserProfileData.dob = this.UserProfileData.dob.getTime();
    }
    if (this.UserProfileData.doj != null) {
      this.UserProfileData.doj = this.UserProfileData.doj.getTime();
    }
    //  this.UserProfileData.mappeddistrict = null;

    this.showLoading = true;
    this.userProfileService.updateProfile(this.UserProfileData, headers).subscribe(resp => {
      this.showLoading = false;
      this.successMessage = "User profile update successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addUserForm.reset();
          this.router.navigate(['/profile']);
        })
    }, (error: any) => {
      this.showLoading = false;
      this.UserProfileData.dob = (new Date(this.UserProfileData.dob));
      this.UserProfileData.doj = (new Date(this.UserProfileData.doj));
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  updateroles = function () {
    this.isSubmitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.UserProfileData.dob != null) {
      this.UserProfileData.dob = this.UserProfileData.dob.getTime();
    }
    if (this.UserProfileData.doj != null) {
      this.UserProfileData.doj = this.UserProfileData.doj.getTime();
    }
    this.UserProfileData.organizations = this.orgFormatData;
    this.UserProfileData.roles = this.roleFormatData;
    this.UserProfileData.mappeddistrict = this.districtFormatData;

    this.showLoading = true;
    this.userProfileService.updateAdminRight(this.UserProfileData, headers).subscribe(resp => {
      this.showLoading = false;
      this.successMessage = "User role update successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addUserForm.reset();
          this.router.navigate(['/profile/', this.route.snapshot.params.id]);
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Edit
  editon = function (id, flag) {
    this.add = false;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var userId = id;
    this.userProfileService.findUserById(userId, headers, flag).subscribe(resp => {
      this.showLoading = false;
      debugger;
      this.UserProfileData = resp;
      if (this.UserProfileData.doj > 0) {
        this.UserProfileData.doj = (new Date(this.UserProfileData.doj));
      }
      else {
        this.UserProfileData.doj = null;
      }
      if (this.UserProfileData.dob > 0) {
        this.UserProfileData.dob = (new Date(this.UserProfileData.dob));
      }
      else {
        this.UserProfileData.dob = null;
      }
      this.orgFormatData = this.UserProfileData.organizations;
      this.roleFormatData = this.UserProfileData.roles;
      if (this.UserProfileData.mappeddistrict.length > 0) {
        this.districtFormatData = this.UserProfileData.mappeddistrict;
        this.tLState = this.districtFormatData[0].id.parentgeography;
      }
      for (let i = 0; i < this.roleFormatData.length; i++) {
        if (this.roleFormatData[i].rolename == "ROLE_TEAM_LEADER") {
          this.addUserForm.get('mappeddistrict').enable();
          this.addUserForm.get('tLState').enable();
          this.districtFormatData = this.UserProfileData.mappeddistrict;
          this.tLState = this.districtFormatData[0].id.parentgeography;
          break;
        }
        else {
          this.UserProfileData.mappeddistrict = null;
          this.tLState = null;
        }
      }
      if (this.UserProfileData.profileImage != null) {
        this.profilefiles = this.fileuploadService.getSingleFileArray(this.UserProfileData.profileImage);
      }
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.UserProfileData.doj = (new Date(this.UserProfileData.doj));
      this.UserProfileData.dob = (new Date(this.UserProfileData.dob));
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Disabled Function
  disabledField = function () {
    this.addUserForm.get('firstName').disable();
    this.addUserForm.get('lastName').disable();
    this.addUserForm.get('dob').disable();
    this.addUserForm.get('emailId').disable();
    this.addUserForm.get('doj').disable();
    this.addUserForm.get('employeeCode').disable();
    this.addUserForm.get('department').disable();
    this.addUserForm.get('organizations').disable();
    this.addUserForm.get('roles').disable();
    this.profilepic = true;
    this.disableTLStateDist();
  }
  // Disabled Function
  adminrole: boolean = false;
  AdmindisabledField = function () {
    this.addUserForm.get('firstName').disable();
    this.addUserForm.get('lastName').disable();
    this.addUserForm.get('mobileNumber').disable();
    this.addUserForm.get('gender').disable();
    this.addUserForm.get('bloodGroup').disable();
    this.addUserForm.get('dob').disable();
    this.addUserForm.get('emailId').disable();
    this.addUserForm.get('emergencyContactMobile').disable();
    this.addUserForm.get('emergencyContactPerson').disable();
    this.addUserForm.get('address').disable();
    this.addUserForm.get('state').disable();
    this.addUserForm.get('district').disable();
    this.addUserForm.get('country').disable();
    this.addUserForm.get('designation').disable();
    this.addUserForm.get('doj').disable();
    this.addUserForm.get('employeeCode').disable();
    this.addUserForm.get('department').disable();
    this.adminrole = true;
    this.profilepic = false;
  }
  disableTLStateDist() {
    this.addUserForm.get('mappeddistrict').disable();
    this.addUserForm.get('tLState').disable();
  }
  ngOnInit(): void {
    this.roleAdmin = this._global.UserRights.includes("ROLE_ADMIN");
    this.getAllState();
    this.getAllDepartment();
    this.getAllOrganizations();
    this.getAllRole();
    this.addUserForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      mobileNumber: [null, Validators.required],
      gender: [null, Validators.required],
      bloodGroup: [null, Validators.required],
      dob: [null, Validators.required],
      emailId: [null, Validators.required],
      emergencyContactMobile: [null, Validators.required],
      emergencyContactPerson: [null, Validators.required],
      address: [null, Validators.required],
      state: [null, Validators.required],
      district: [null, Validators.required],
      country: ['INDIA', Validators.required],
      designation: [null, Validators.required],
      doj: [null, Validators.required],
      employeeCode: [null, Validators.required],
      department: [null, Validators.required],
      organizations: [null],
      roles: [''],
      mappeddistrict: [null],
      tLState: [null],
    });
    this.disableTLStateDist();
    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update User";
      this.AdmindisabledField();
      this.edit = false;
      this.roleAdminbtn = true;
      this.editon(this.route.snapshot.params.id, 'edit');
    }
    if (this.route.snapshot.params.page == 'editprofile') {
      this.PageTitle = "Update Profile";
      this.edit = true;
      this.roleAdminbtn = false;
      this.disabledField();
      this.editon(this.route.snapshot.params.id, 'editprofile');
    }
  }
  get formControls() {
    return this.addUserForm.controls;
  }
}