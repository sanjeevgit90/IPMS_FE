import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { PurchaseOrderService } from '../../../OrderMgmt/purchase-order/purchase-order.service';
import { RateContractService } from '../../../OrderMgmt/rate-contract/rate-contract.service';
import { ProjectMasterService } from '../../../ProjectMgmt/ProjectMaster/projectmaster.service';
import { FileuploadService } from '../../../service/fileupload.service';
import { OrganizationService } from '../../../ConfigurationMgmt/organization/organization.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-add-po',
  templateUrl: './add-po.component.html',
  providers: [PurchaseOrderService, AppGlobals, DialogService, SharedService, RateContractService, ProjectMasterService, OrganizationService, FileuploadService]
})
export class AddPoComponent implements OnInit {

  filteredProjectList: any = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private purchaseOrderService: PurchaseOrderService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private rateContractService: RateContractService,
    private projectMasterService: ProjectMasterService, private organizationService: OrganizationService, private fileuploadService: FileuploadService) { }

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Add PO";
  add = true;
  edit = false;
  list = true;
  view = false;

  addPoForm: FormGroup;
  isSubmitted = false;

  POEntityData = {
    "entityId": null, "purchaseOrderNo": null, "orderDate": null, "poMadeFrom": null,
    "rateContractId": null, "department": null, "accountName": null,
    "organisationId": null, "orderType": null, "modeOfPayment": null,
    "dispatchThrough": null, "currency": null, "deliveryTerm": null,
    "paymentMethod": null, "suppliersReference": null, "discountAmt": 0,
    "otherReference": null, "supplierName": null, "supplierDetails": null,
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
  PoAttachments: any = [];
  signedCopyPath: any = [];
  attachmentsFlag = false;
  matSelectDuration = this._global.matSelectDurationTime;

  //for setting yes or no to checkbox
  /* falseValue = "NO";
  trueValue = "YES";
  checkboxChange(checked: boolean) {
    debugger;
    this.isHistoricData = checked ? this.trueValue : this.falseValue;
  } */

  checked: boolean = false;
  checkChange(checked: boolean) {
    debugger;
    this.checked = !checked;
    this.isHistoricData = this.checked ? "YES" : "NO";
    this.POEntityData.currency = this.checked ? "INR" : null;
  }

  compareObjects(o1: any, o2: any): boolean {
    //return o1.name === o2.name && o1.id === o2.id;
    return o1 == o2;
  }

  // Disabled Function
  disabledField = function () {
    this.addPoForm.get('billFromGstNo').disable();
    this.addPoForm.get('billFromState').disable();
  }

  // Disabled Function
  disableFieldsForUploadSignCopy = function () {
    this.addPoForm.get('purchaseOrderNo').disable();
    this.addPoForm.get('orderDate').disable();
    this.addPoForm.get('poMadeFrom').disable();
    this.addPoForm.get('rateContractId').disable();
    this.addPoForm.get('department').disable();
    this.addPoForm.get('accountName').disable();
    this.addPoForm.get('organisationId').disable();
    this.addPoForm.get('orderType').disable();
    this.addPoForm.get('modeOfPayment').disable();
    this.addPoForm.get('dispatchThrough').disable();
    this.addPoForm.get('currency').disable();
    this.addPoForm.get('deliveryTerm').disable();
    this.addPoForm.get('paymentMethod').disable();
    this.addPoForm.get('suppliersReference').disable();
    this.addPoForm.get('discountAmt').disable();
    this.addPoForm.get('otherReference').disable();
    this.addPoForm.get('supplierName').disable();
    this.addPoForm.get('supplierDetails').disable();
    this.addPoForm.get('buyerName').disable();
    this.addPoForm.get('invoiceToAddress').disable();
    this.addPoForm.get('billToAddress').disable();
    this.addPoForm.get('shipToAddress').disable();
    this.addPoForm.get('termsConditions').disable();
    this.addPoForm.get('includeTerms').disable();
  }

  // Disabled Function
  disableFieldsForRc = function () {
    //this.addPoForm.get('purchaseOrderNo').disable();
    //this.addPoForm.get('orderDate').disable();
    if (this.route.snapshot.params.page == 'edit') {
      this.addPoForm.get('poMadeFrom').disable();
      this.addPoForm.get('rateContractId').disable();
    }
    //this.addPoForm.get('poMadeFrom').disable();
    //this.addPoForm.get('rateContractId').disable();
    //this.addPoForm.get('department').disable();
    this.addPoForm.get('accountName').disable();
    this.addPoForm.get('organisationId').disable();
    //this.addPoForm.get('orderType').disable();
    //this.addPoForm.get('modeOfPayment').disable();
    //this.addPoForm.get('dispatchThrough').disable();
    this.addPoForm.get('currency').disable();
    //this.addPoForm.get('deliveryTerm').disable();
    //this.addPoForm.get('paymentMethod').disable();
    //this.addPoForm.get('suppliersReference').disable();
    //this.addPoForm.get('discountAmt').disable();
    //this.addPoForm.get('otherReference').disable();
    this.addPoForm.get('supplierName').disable();
    this.addPoForm.get('supplierDetails').disable();
    this.addPoForm.get('buyerName').disable();
    //this.addPoForm.get('invoiceToAddress').disable();
    this.addPoForm.get('billToAddress').disable();
    //this.addPoForm.get('shipToAddress').disable();
    //this.addPoForm.get('termsConditions').disable();
    //this.addPoForm.get('includeTerms').disable();
  }

  // Disabled Function
  enableFieldsForRc = function () {
    this.addPoForm.get('accountName').enable();
    this.addPoForm.get('organisationId').enable();
    this.addPoForm.get('currency').enable();
    this.addPoForm.get('supplierName').enable();
    this.addPoForm.get('supplierDetails').enable();
    this.addPoForm.get('buyerName').enable();
    this.addPoForm.get('billToAddress').enable();
  }

  cancel = function () {
    if (this.route.snapshot.params.task == null) {
      this.router.navigate(['/searchPurchaseOrder']);
    } else {
      this.router.navigate(['/searchTask']);
    }
  }

  savePO = function () {
    debugger;
    this.isSubmitted = true;
    //this.POEntityData.isHistoricData = this.isHistoricData;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addPoForm.invalid) {
      return;
    }
    this.POEntityData.orderDate = this.POEntityData.orderDate.getTime();
    this.POEntityData.isHistoricData = this.isHistoricData;
    this.POEntityData.includeTerms = this.POEntityData.includeTerms ? "YES" : "NO";
    this.showLoading = true;
    this.purchaseOrderService.savePO(this.POEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Basic PO is created successfully. Please proceed further for adding products.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addPoForm.reset();
          this.router.navigate(['searchPurchaseOrder/UpdatePO', resp.entityId, 'edit']);
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.POEntityData.orderDate = (new Date(this.POEntityData.orderDate));
      this.POEntityData.includeTerms = this.POEntityData.includeTerms == "NO" ? false : true;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  additionalTerms: boolean = false;
  updatePO = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addPoForm.invalid) {
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
      this.POEntityData.signedCopyPath = this.fileuploadService.getFirstFilePath(this.signedCopyPath);
    } else {
      //If mandatory then check for atleast one fileuploaded
      if (!this.fileuploadService.hasfile(this.PoAttachments)) {
        this.dialogService.openConfirmDialog("Please uplaod atleast one attachment.")
        return;
      }
      //Check if all files are uploaded Successfully
      if (!this.fileuploadService.allFilesUploaded(this.PoAttachments)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.POEntityData.attachment = this.fileuploadService.allUploadedFiles(this.PoAttachments);
    }
    this.POEntityData.orderDate = this.POEntityData.orderDate.getTime();
    //this.POEntityData.isHistoricData = this.isHistoricData;
    this.POEntityData.includeTerms = this.POEntityData.includeTerms ? "YES" : "NO";
    this.showLoading = true;
    this.purchaseOrderService.updatePO(this.POEntityData, headers, this.POEntityData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.POEntityData.orderDate = (new Date(this.POEntityData.orderDate));
      this.POEntityData.includeTerms = this.POEntityData.includeTerms == "NO" ? false : true;
      sessionStorage.setItem("additionalTerms", this.POEntityData.includeTerms);
      this.successMessage = "PO updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage);
      // .afterClosed().subscribe(res => {
      //   this.addPoForm.reset();
      // })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.POEntityData.orderDate = (new Date(this.POEntityData.orderDate));
      this.POEntityData.includeTerms = this.POEntityData.includeTerms == "NO" ? false : true;
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
    this.purchaseOrderService.getPOById(poId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.POEntityData = resp;
      this.POEntityData.orderDate = (new Date(this.POEntityData.orderDate));
      this.POEntityData.includeTerms = this.POEntityData.includeTerms == "NO" ? false : true;
      sessionStorage.setItem("additionalTerms", this.POEntityData.includeTerms);
      sessionStorage.setItem('currencyFlag', this.POEntityData.currency);
      sessionStorage.setItem('isHistoricData', this.POEntityData.isHistoricData);
      this.compareStateOfAddress(this.POEntityData.supplierDetails, this.POEntityData.billToAddress);
      if (this.POEntityData.billFromGstNo != null) {
        if (this.POEntityData.billFromGstNo == "NA") {
          sessionStorage.setItem('applyGstFlag', "NO");
        } else {
          sessionStorage.setItem('applyGstFlag', "YES");
        }
      }
      if (this.POEntityData.attachment != null) {
        this.PoAttachments = this.fileuploadService.getMultipleFileArray(this.POEntityData.attachment);
      }
      if (this.POEntityData.signedCopyPath != null) {
        this.signedCopyPath = this.fileuploadService.getSingleFileArray(this.POEntityData.signedCopyPath);
      }
      this.checked = (this.POEntityData.isHistoricData == "YES") ? true : false;
      if (this.POEntityData.rateContractId != null) {
        sessionStorage.setItem("rcId", this.rateContractData.entityId);
      }
      if (!this.fileuploadService.hasfile(this.PoAttachments)) {
        //attachmentsFlag
        this.dialogService.openConfirmDialog("Please uplaod atleast one attachment.")
        return;
      }
      //this.getProjectById(this.POEntityData.accountName);
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
      var obj = JSON.parse(errStr);
      this.errorMessage = obj.message;
    });
  }

  changeRcSelection = function (poMadeFrom) {
    debugger;
    if (this.route.snapshot.params.page != 'edit' && this.route.snapshot.params.page != 'view') {
      sessionStorage.removeItem("rcId");
      this.POEntityData.rateContractId = null;
    }
    if (poMadeFrom == "RC") {
      this.disableFieldsForRc();
      this.getAllApprovedRcList();
    } else {
      this.enableFieldsForRc();
      this.rcList = [];
    }
  }

  // getting approved rc list
  rcList: any = [];
  getAllApprovedRcList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getApprovedRcList(headers).subscribe(resp => {
      debugger;
      this.rcList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
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

  // getting department list
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
      this.ConstantData.organisationId = this.POEntityData.organisationId;
    else if (flag == 'PMethod')
      this.ConstantData.organisationId = this.POEntityData.organisationId;
    this.sharedService.getAllConstant(this.ConstantData, headers).subscribe(resp => {
      debugger
      if (flag == "PM")
        this.paymentModeList = resp;
      else if (flag == "DT")
        this.deliveryTermList = resp;
      else if (flag == "PMethod")
        this.paymentMethodList = resp;
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
      //this.POEntityData.billFromState = this.gstDetails.state;
      if (this.gstDetails != null) {
        if (this.gstDetails.gstNo != null) {
          this.POEntityData.billFromGstNo = this.gstDetails.gstNo;
          sessionStorage.setItem('applyGstFlag', "YES");
        } else {
          this.POEntityData.billFromGstNo = "NA";
          sessionStorage.setItem('applyGstFlag', "NO");
        }
      } else {
        this.POEntityData.billFromGstNo = "NA";
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
          this.POEntityData.billFromState = this.selectedAddress.state;
        } else {
          this.POEntityData.billFromState = "NA";
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

  // get selected rate contract
  rateContractData: any = {};
  getRateContractById = function (rcId) {
    debugger;
    //sessionStorage.removeItem("rcId");
    if (rcId == null)
      return
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.rateContractService.getRCById(rcId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.rateContractData = resp;
      sessionStorage.setItem("rcId", this.rateContractData.entityId);

      this.POEntityData.department = this.rateContractData.department;
      this.POEntityData.accountName = this.rateContractData.accountName;
      this.POEntityData.organisationId = this.rateContractData.organisationId;
      this.POEntityData.modeOfPayment = this.rateContractData.modeOfPayment;
      this.POEntityData.dispatchThrough = this.rateContractData.dispatchThrough;
      this.POEntityData.currency = this.rateContractData.currency;
      this.POEntityData.deliveryTerm = this.rateContractData.deliveryTerm;
      this.POEntityData.suppliersReference = this.rateContractData.suppliersReference;
      this.POEntityData.supplierName = this.rateContractData.supplierName;
      this.POEntityData.supplierDetails = this.rateContractData.supplierDetails;


      this.POEntityData.buyerName = this.rateContractData.buyerName;
      this.POEntityData.invoiceToAddress = this.rateContractData.invoiceToAddress;
      this.POEntityData.billToAddress = this.rateContractData.billToAddress;
      this.POEntityData.shipToAddress = this.rateContractData.shipToAddress;

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // get selected project
  projectData: any = {};
  getProjectById = function (projId) {
    debugger;
    //return; // api is returning 404 error
    if (projId == null)
      return
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectMasterService.projectById(projId, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.projectData = resp;
      sessionStorage.setItem("poProjectType", this.projectData.projectType);
      //sessionStorage.setItem("poOrgId", this.projectData.organization); //writing in organisation change
      if (this.projectData.organization != null) {
        this.getOrganisationById(this.projectData.organization);
        //this.POEntityData.organisationId = this.projectData.organization;
      }
      /*
            //--------------------
            let organisationId = this.projectData.organization;
            this.organizationName = vm.project[0].organizationName;
            
            vm.getSelProject(id);
            
            if(organisationId != null){
              if(vm.organizationName == "STAR ORGANIZATION"){
                vm.starOrganisationFlag = true;
              } else {
                debugger;
                vm.purchaseOrder.organisationId = organisationId;
                vm.starOrganisationFlag = false;
                vm.organisationOnChange(vm.purchaseOrder.organisationId);
              }
            }
            //---------------------
      */
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // get selected organisation
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
          this.POEntityData.organisationId = this.organisationData.entityId;
          this.starOrganisationFlag = true;
        }
        sessionStorage.setItem("poOrgName", this.organisationData.orgName);
        /*if(this.organisationData.orgName != "STAR ORGANIZATION"){
          this.POEntityData.organisationId = this.organisationData.entityId;
        }*/
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
    /*$rootScope.organization = id;
    vm.getPartiesByOrganisation(id);
    vm.getPaymentTermsByOrganisation(id);
    vm.getPaymentMethodByOrganisation(id);*/
    sessionStorage.setItem("poOrgId", orgId);
    this.getAllConstants("PM");
    this.getAllConstants("PMethod");
    this.getAllPartyByOrg(orgId);
  }




  //------------------
  starOrganisationFlag = true;
  /*organizationName = "";
      
  getSelectedProject = function(id){
    
    vm.project = GetAllFactory.getProjectFromId(vm.accountListForOrder,$state.params.state,id);
    
    var organisationId = vm.project[0].id;
    vm.organizationName = vm.project[0].organizationName;
    
    vm.getSelProject(id);
    
    if(organisationId != null){
      if(vm.organizationName == "STAR ORGANIZATION"){
        vm.starOrganisationFlag = true;
        //vm.purchaseOrder.organisationId = null;
      } else {
        debugger;
        vm.purchaseOrder.organisationId = organisationId;
        vm.starOrganisationFlag = false;
        vm.organisationOnChange(vm.purchaseOrder.organisationId);
      }
    }
  }
      
  vm.getSelProject = function(id){
    debugger;
    vm.projectType = GetAllFactory.getProjectTypeFromId(vm.accountListForOrder,$state.params.state,id);
    
    var projectType = vm.projectType[0].id;
    var  projectTypeName = vm.projectType[0].projectTypeName;
    
    if (vm.organizationName =="Aurionpro Solutions Ltd")
    {
      debugger;
      $rootScope.project = null;
    }
    else
    {
      debugger;
      if (projectTypeName =="")
      {
        debugger;
        $rootScope.project = null;
      }
      else
      {
        debugger;
        $rootScope.project = projectType;
      }
    }
  }

  vm.organisationOnChange = function(id){
    $rootScope.organization = id;
    vm.getPartiesByOrganisation(id);
    vm.getPaymentTermsByOrganisation(id);
    vm.getPaymentMethodByOrganisation(id);
  }

  //-------------------
*/
  filterStates(val: string) {

    debugger;
    if (val != "") {
      this.getProjectById(val);
    }
    if (val) {
      let filterValue = val.toLowerCase();
      return this.projectList.filter(item => item.selectionvalue.toLowerCase().startsWith(filterValue));
    }

    return this.projectList;
  }
  ngOnInit() {
    this.addPoForm = this.formBuilder.group({
      purchaseOrderNo: [null, Validators.required],
      orderDate: [null, Validators.required],
      orderType: [null, Validators.required],
      poMadeFrom: [null],
      rateContractId: [null],
      department: [null, Validators.required],
      accountName: [null, Validators.required],
      organisationId: [null, Validators.required],
      modeOfPayment: [null, Validators.required],
      dispatchThrough: [null, Validators.required],
      currency: [null, Validators.required],
      deliveryTerm: [null, Validators.required],
      paymentMethod: [null],
      suppliersReference: [null, Validators.required],
      discountAmt: [0],
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

    this.filteredProjectList = this.addPoForm.controls['accountName'].valueChanges.pipe(
      startWith(''),
      map(value => this.filterStates(value))
    );

    sessionStorage.setItem("tabFlag", "PO");
    sessionStorage.removeItem("rcId");

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update PO";
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
    //this.getAllApprovedRcList();
  }

  get formControls() {
    return this.addPoForm.controls;
  }
}