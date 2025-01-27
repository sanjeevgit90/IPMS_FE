import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { RateContractService } from '../../../OrderMgmt/rate-contract/rate-contract.service';
import { FileuploadService } from '../../../service/fileupload.service';
import { ProjectMasterService } from '../../../ProjectMgmt/ProjectMaster/projectmaster.service';
import { OrganizationService } from '../../../ConfigurationMgmt/organization/organization.service';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-rc',
  templateUrl: './add-rc.component.html',
  providers: [RateContractService, AppGlobals, DialogService, SharedService, FileuploadService, ProjectMasterService, OrganizationService]
})
export class AddRcComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private rateContractService: RateContractService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private fileuploadService: FileuploadService, private projectMasterService: ProjectMasterService, private organizationService: OrganizationService) { }


  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;



  PageTitle = "Add RC";
  add = true;
  edit = false;
  list = true;
  view = false;

  addRcForm: FormGroup;
  isSubmitted = false;

  RCEntityData = {
    "entityId": null, "rateContractNo": null, "contractDate": null, "validTill": null,
    "department": null, "accountName": null, "organisationId": null,
    "contractType": null, "modeOfPayment": null, "dispatchThrough": null,
    "currency": null, "deliveryTerm": null, "suppliersReference": null,
    "maxLimit": 0, "otherReference": null, "supplierName": null, "supplierDetails": null,
    "billFromState": null, "billFromGstNo": null, "buyerName": null,
    "invoiceToAddress": null, "billToAddress": null, "shipToAddress": null,
    "termsConditions": null, "isHistoricData": null, "uploadedTermsAnnexure": null,
    "additionalTerms": null, "includeTerms": null, "signedCopyPath": null, "attachment": []
  };

  projectList: any = [];
  deptList: any = [];
  orgList: any = [];
  ConstantData = { "type": null, "organisationId": null };
  paymentModeList: any = [];
  deliveryTermList: any = [];
  paymentMethodList: any = [];
  isHistoricData = "NO";
  isSameState = null;
  applyGstFlag = null;
  currencyFlag = null;
  RcAttachments: any = [];
  signedCopyPath: any = [];

  //for setting yes or no to checkbox
  /* falseValue = "NO";
  trueValue = "YES";
  checkboxChange(checkbox: MatCheckbox, checked: boolean) {
    debugger;
    this.isHistoricData = checked ? this.trueValue : this.falseValue;
  } */

  checked: boolean = false;
  checkChange(checked: boolean) {
    debugger;
    this.checked = !checked;
    this.isHistoricData = this.checked ? "YES" : "NO";
    this.RCEntityData.currency = this.checked ? "INR" : null;
  }

  // Disable Function
  disabledField = function () {
    this.addRcForm.get('billFromGstNo').disable();
    this.addRcForm.get('billFromState').disable();
  }

  // Disabled Function
  disableFieldsForUploadSignCopy = function () {
    this.addRcForm.get('rateContractNo').disable();
    this.addRcForm.get('contractDate').disable();
    this.addRcForm.get('validTill').disable();
    this.addRcForm.get('contractType').disable();
    this.addRcForm.get('department').disable();
    this.addRcForm.get('accountName').disable();
    this.addRcForm.get('organisationId').disable();
    this.addRcForm.get('maxLimit').disable();
    this.addRcForm.get('modeOfPayment').disable();
    this.addRcForm.get('dispatchThrough').disable();
    this.addRcForm.get('currency').disable();
    this.addRcForm.get('deliveryTerm').disable();
    this.addRcForm.get('suppliersReference').disable();
    this.addRcForm.get('otherReference').disable();
    this.addRcForm.get('supplierName').disable();
    this.addRcForm.get('supplierDetails').disable();
    this.addRcForm.get('buyerName').disable();
    this.addRcForm.get('invoiceToAddress').disable();
    this.addRcForm.get('billToAddress').disable();
    this.addRcForm.get('shipToAddress').disable();
    this.addRcForm.get('termsConditions').disable();
    this.addRcForm.get('includeTerms').disable();
  }

  compareObjects(o1: any, o2: any): boolean {
    //return o1.name === o2.name && o1.id === o2.id;
    return o1 == o2;
  }

  cancel = function () {
    //this.router.navigate(['/searchRateContract']);
    if (this.route.snapshot.params.task == null) {
      this.router.navigate(['/searchRateContract']);
    } else {
      this.router.navigate(['/searchTask']);
    }
  }

  saveRC = function () {
    debugger;
    this.isSubmitted = true;
    //this.RCEntityData.isHistoricData = this.isHistoricData;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addRcForm.invalid) {
      return;
    }
    this.RCEntityData.contractDate = this.RCEntityData.contractDate.getTime();
    this.RCEntityData.validTill = this.RCEntityData.validTill.getTime();
    this.RCEntityData.isHistoricData = this.isHistoricData;
    this.RCEntityData.includeTerms = this.RCEntityData.includeTerms ? "YES" : "NO";
    this.showLoading = true;
    this.rateContractService.saveRC(this.RCEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Basic RC is created successfully. Please proceed further for adding products.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addRcForm.reset();
          this.router.navigate(['searchRateContract/editRateContract', resp.entityId, 'edit']);
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.RCEntityData.contractDate = (new Date(this.RCEntityData.contractDate));
      this.RCEntityData.validTill = (new Date(this.RCEntityData.validTill));
      this.RCEntityData.includeTerms = this.RCEntityData.includeTerms == "NO" ? false : true;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  updateRC = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addRcForm.invalid) {
      return;
    }

    if (this.route.snapshot.params.page == 'view') {
      //If mandatory then check for fileuploaded
      if (!this.fileuploadService.hasfile(this.signedCopyPath)) {
        this.dialogService.openConfirmDialog("Please uplaod signed copy")
        return;
      }
      //Check if all files are uploaded Successfully
      if (!this.fileuploadService.allFilesUploaded(this.signedCopyPath)) {
        this.dialogService.openConfirmDialog("Files are uploading...")
        return;
      }
      this.RCEntityData.signedCopyPath = this.fileuploadService.getFirstFilePath(this.signedCopyPath);
    } else {
      //If mandatory then check for atleast one fileuploaded
      if (!this.fileuploadService.hasfile(this.RcAttachments)) {
        this.dialogService.openConfirmDialog("Please uplaod atleast one attachment.")
        return;
      }
      //Check if all files are uploaded Successfully
      if (!this.fileuploadService.allFilesUploaded(this.RcAttachments)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.RCEntityData.attachment = this.fileuploadService.allUploadedFiles(this.RcAttachments);
    }
    this.RCEntityData.contractDate = this.RCEntityData.contractDate.getTime();
    this.RCEntityData.validTill = this.RCEntityData.validTill.getTime();
    this.RCEntityData.includeTerms = this.RCEntityData.includeTerms ? "YES" : "NO";
    //this.RCEntityData.isHistoricData = this.isHistoricData;
    this.showLoading = true;
    this.rateContractService.updateRC(this.RCEntityData, headers, this.RCEntityData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.RCEntityData.contractDate = (new Date(this.RCEntityData.contractDate));
      this.RCEntityData.validTill = (new Date(this.RCEntityData.validTill));
      this.RCEntityData.includeTerms = this.RCEntityData.includeTerms == "NO" ? false : true;
      sessionStorage.setItem("additionalTerms", this.RCEntityData.includeTerms);
      this.successMessage = "RC updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage);
      // .afterClosed().subscribe(res => {
      //   this.addRcForm.reset();
      // })
    }, (error: any) => {
      debugger;
      this.RCEntityData.contractDate = (new Date(this.RCEntityData.contractDate));
      this.RCEntityData.validTill = (new Date(this.RCEntityData.validTill));
      this.RCEntityData.includeTerms = this.RCEntityData.includeTerms == "NO" ? false : true;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Edit
  editon = function (id) {
    debugger;
    this.add = false;
    //this.edit = true;
    if (this.route.snapshot.params.page == 'edit') {
      this.edit = true;
    } else if (this.route.snapshot.params.page == 'view') {
      this.edit = false;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var poId = id;
    this.rateContractService.getRCById(poId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.RCEntityData = resp;
      this.RCEntityData.contractDate = (new Date(this.RCEntityData.contractDate));
      this.RCEntityData.validTill = (new Date(this.RCEntityData.validTill));
      this.RCEntityData.includeTerms = this.RCEntityData.includeTerms == "NO" ? false : true;
      sessionStorage.setItem("additionalTerms", this.RCEntityData.includeTerms);
      //sessionStorage.setItem('poId', this.RCEntityData.entityId);
      sessionStorage.setItem('currencyFlag', this.RCEntityData.currency);
      sessionStorage.setItem('isHistoricData', this.RCEntityData.isHistoricData);
      this.compareStateOfAddress(this.RCEntityData.supplierDetails, this.RCEntityData.billToAddress);
      if (this.RCEntityData.billFromGstNo != null) {
        if (this.RCEntityData.billFromGstNo == "NA") {
          sessionStorage.setItem('applyGstFlag', "NO");
        } else {
          sessionStorage.setItem('applyGstFlag', "YES");
        }
      }
      if (this.RCEntityData.attachment != null) {
        this.RcAttachments = this.fileuploadService.getMultipleFileArray(this.RCEntityData.attachment);
      }
      if (this.RCEntityData.signedCopyPath != null) {
        this.signedCopyPath = this.fileuploadService.getSingleFileArray(this.RCEntityData.signedCopyPath);
      }
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  // getting project list
  getAllProjects = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getProjectList(headers).subscribe(resp => {
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

  // getting project list
  getAllDepartments = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDepartmentList(headers).subscribe(resp => {
      debugger;
      this.deptList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // getting currency list
  currencyList: any = [];
  getAllCurrency = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getCurrencyList(headers).subscribe(resp => {
      debugger;
      this.currencyList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //get all constants
  getAllConstants = function (flag) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.ConstantData.type = flag;
    // if(flag=='PM')
    //   vm.constant.type = "PM";
    // else if(flag=='DT')
    //   vm.constant.type = "DT";
    // else if(flag=='PMethod')
    //   vm.constant.type = "PMethod";
    if (flag == 'PM')
      this.ConstantData.organisationId = this.RCEntityData.organisationId;
    this.sharedService.getAllConstant(this.ConstantData, headers).subscribe(resp => {
      debugger
      if (flag == "PM")
        this.paymentModeList = resp;
      else if (flag == "DT")
        this.deliveryTermList = resp;
      /*else if(flag=="PMethod")
        this.paymentMethodList = resp;*/
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Org List
  getAllOrganizations = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getOrganizationsList(headers).subscribe(resp => {
      debugger;
      this.orgList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // party List
  supplierPartyList: any = [];
  purchaserPartyList: any = [];
  getAllParty = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      //this.supplierPartyList = resp;
      this.purchaserPartyList = resp;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  getAllPartyByOrg = function (orgId) {
    debugger;
    if (orgId == null) return;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActivePartyByOrg(orgId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.supplierPartyList = resp;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // address List
  supplierAddressList: any = [];
  addressListPurchaser: any = [];
  getAddressByParty = function (partyId, flag) {
    debugger;
    if ((partyId == "") || (partyId == null))
      return
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getAllAddressOfParty(headers, partyId).subscribe(resp => {
      debugger;
      if (flag == "supplier") {
        this.supplierAddressList = resp;
      }
      else if (flag == "purchaser") {
        this.addressListPurchaser = resp;
      }
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // address List
  gstDetails: any = [];
  getGstByPartyAndAddress = function (partyId, addressId) {
    debugger;
    if (addressId == "" || addressId == null || partyId == "" || partyId == null)
      return
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getGstFromAddress(headers, partyId, addressId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.gstDetails = resp;
      //this.RCEntityData.billFromState = this.gstDetails.state;
      if (this.gstDetails != null) {
        if (this.gstDetails.gstNo != null) {
          this.RCEntityData.billFromGstNo = this.gstDetails.gstNo;
          sessionStorage.setItem('applyGstFlag', "YES");
        } else {
          this.RCEntityData.billFromGstNo = "NA";
          sessionStorage.setItem('applyGstFlag', "NO");
        }
      } else {
        this.RCEntityData.billFromGstNo = "NA";
        sessionStorage.setItem('applyGstFlag', "NO");
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // State List
  stateList: any = [];
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

  // Compare Addresses
  compareStateOfAddress = function (address1, address2) {
    debugger;
    if (address1 == null || address2 == null || address1 == "" || address2 == "") {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.compareStateOfAddress(headers, address1, address2).subscribe(resp => {
      debugger;
      this.isSameState = resp;
      sessionStorage.setItem('sameStateFlag', this.isSameState);
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  selectedAddress: any = [];
  getSelectedAddress = function (id) {
    debugger;
    if (id == null || id == "") {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getAddressById(headers, id).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.selectedAddress = resp;
      if (this.selectedAddress != null) {
        if (this.selectedAddress.state != null) {
          this.RCEntityData.billFromState = this.selectedAddress.state;
        } else {
          this.RCEntityData.billFromState = "NA";
        }
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  addressChange = function (suppPartyId, suppAddress, purchaserAddress) {
    debugger;
    this.getSelectedAddress(suppAddress);
    this.getGstByPartyAndAddress(suppPartyId, suppAddress);
    this.compareStateOfAddress(suppAddress, purchaserAddress);
  }

  // get selected project
  projectData: any = {};
  getProjectById = function (projId) {
    debugger;
    if (projId == null)
      return
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectMasterService.projectById(projId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.projectData = resp;
      if (this.projectData.organization != null) {
        this.getOrganisationById(this.projectData.organization);
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // get selected organisation
  starOrganisationFlag = true;
  organisationData: any = {};
  getOrganisationById = function (orgId) {
    debugger;
    if (orgId == null)
      return
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.organizationService.OrgById(orgId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.organisationData = resp;
      if (this.organisationData.entityId != null) {
        if (this.organisationData.orgName == "STAR ORGANIZATION") {
          this.starOrganisationFlag = false;
        } else {
          this.RCEntityData.organisationId = this.organisationData.entityId;
          this.starOrganisationFlag = true;
        }
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  organisationChange = function (orgId) {
    debugger;
    sessionStorage.setItem("rcOrgId", orgId);
    this.getAllConstants("PM");
    //this.getAllConstants("PMethod");
    this.getAllPartyByOrg(orgId);
  }

  ngOnInit() {
    this.addRcForm = this.formBuilder.group({
      rateContractNo: [null, Validators.required],
      contractDate: [null, Validators.required],
      validTill: [null, Validators.required],
      contractType: [null, Validators.required],
      department: [null, Validators.required],
      accountName: [null, Validators.required],
      organisationId: [null, Validators.required],
      modeOfPayment: [null, Validators.required],
      dispatchThrough: [null, Validators.required],
      currency: [null, Validators.required],
      deliveryTerm: [null, Validators.required],
      suppliersReference: [null, Validators.required],
      maxLimit: [0],
      otherReference: [null],
      supplierName: [null, Validators.required],
      supplierDetails: [null, Validators.required],
      billFromState: [null, Validators.required],
      billFromGstNo: [null, Validators.required],
      buyerName: [null, Validators.required],
      invoiceToAddress: [null, Validators.required],
      billToAddress: [null, Validators.required],
      shipToAddress: [null, Validators.required],
      termsConditions: [null, Validators.required],
      includeTerms: [null],
      signedCopyPath: [null]
    });

    sessionStorage.setItem("tabFlag", "RC");

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update RC";
      this.editon(this.route.snapshot.params.id);
      //this.disabledField();
    }
    if (this.route.snapshot.params.page == 'view') {
      this.PageTitle = "Update PO";
      this.editon(this.route.snapshot.params.id);
      this.view = true;
      this.disableFieldsForUploadSignCopy();
    }

    this.disabledField();
    this.getAllProjects();
    this.getAllOrganizations();
    this.getAllDepartments();
    this.getAllCurrency();
    //this.getAllConstants("PM");
    this.getAllConstants("DT");
    //this.getAllConstants("PMethod");
    this.getAllParty();
    this.getAllState();
  }

  get formControls() {
    return this.addRcForm.controls;
  }
}