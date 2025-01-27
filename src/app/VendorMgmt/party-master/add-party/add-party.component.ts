import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { PartyMasterService } from '../../../VendorMgmt/party-master/party-master.service';
import { FileuploadService } from '../../../service/fileupload.service';

@Component({
  selector: 'app-add-party',
  templateUrl: './add-party.component.html',
  providers: [PartyMasterService, AppGlobals, DialogService, SharedService, FileuploadService]
})
export class AddPartyComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private partyMasterService: PartyMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private fileuploadService: FileuploadService) { }

    showLoading: boolean = false;

    totalRecords: any;
    itemPerPage = this._global.pageNumer;
    pageSizedisplay = this._global.pageSize;

    matSelectDuration = this._global.matSelectDurationTime;  
  
    PageTitle = "Add Party";
    add = true;
    edit = false;
    list = true;
  
    addPartyForm: FormGroup;
    isSubmitted = false;
  
    PartyEntityData = {
      "partyType": null, "partyNo": null, "partyName": null,
      "organizationId": null, "contactPersonName": null, "mobileNo": null,
      "landlineNo": null, "emailId": null, "dateOfIncorporation": null,
      "dateOfIncorporationAttachment": null, "natureOfServiceProviding": null, "smeRegNo": null,
      "contactId": null, "panNo": null, "panNoAttachment": null,
      "tanNo": null, "tanNoAttachment": null, "arnNo": null,
      "arnNoAttachment": null, "bankName": null, "bankNameAttachment": null,
      "branchNameandAddress": null, "accountType": null, "accountNo": null,
      "micrCode": null, "ifscNeftCode": null, "remarks": null, "organisationId": null
    };

    orgList = {};
    dateOfIncorporationAttachment: any = [];
    panNoAttachment: any = [];
    tanNoAttachment: any = [];
    arnNoAttachment: any = [];
    bankNameAttachment: any = [];
  
    cancel = function () {
      this.router.navigate(['/searchParty']);
    }

    compareObjects(o1: any, o2: any): boolean {
      //return o1.name === o2.name && o1.id === o2.id;
      return o1 == o2;
    }
  
    saveParty = function () {

      this.isSubmitted = true;
      const headers = { "Authorization": sessionStorage.getItem("token") };
      if (this.addPartyForm.invalid) {
        return;
      }
      //Check if all files are uploaded Successfully
      if(this.dateOfIncorporationAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.dateOfIncorporationAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.dateOfIncorporationAttachment = this.fileuploadService.getFirstFilePath(this.dateOfIncorporationAttachment);
      }
      if(this.panNoAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.panNoAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.panNoAttachment = this.fileuploadService.getFirstFilePath(this.panNoAttachment);
      }
      if(this.tanNoAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.tanNoAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.tanNoAttachment = this.fileuploadService.getFirstFilePath(this.tanNoAttachment);
      }
      if(this.arnNoAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.arnNoAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.arnNoAttachment = this.fileuploadService.getFirstFilePath(this.arnNoAttachment);
      }
      if(this.bankNameAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.bankNameAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.bankNameAttachment = this.fileuploadService.getFirstFilePath(this.bankNameAttachment);
      }

      this.PartyEntityData.dateOfIncorporation = this.PartyEntityData.dateOfIncorporation.getTime();
      this.showLoading = true;
      this.partyMasterService.saveParty(this.PartyEntityData, headers).subscribe(resp => {

        this.showLoading = false;
        this.successMessage = "Party created successfully.";
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(res => {
            this.addPartyForm.reset();
            this.router.navigate(['searchParty']);
          })
      }, (error: any) => {

        this.showLoading = false;
        this.PartyEntityData.dateOfIncorporation = (new Date(this.PartyEntityData.dateOfIncorporation));
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  
    updateParty = function () {
      
      this.isSubmitted = true;
      const headers = { "Authorization": sessionStorage.getItem("token") };
      if (this.addPartyForm.invalid) {
        return;
      }
      //Check if all files are uploaded Successfully
      if(this.dateOfIncorporationAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.dateOfIncorporationAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.dateOfIncorporationAttachment = this.fileuploadService.getFirstFilePath(this.dateOfIncorporationAttachment);
      }
      if(this.panNoAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.panNoAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.panNoAttachment = this.fileuploadService.getFirstFilePath(this.panNoAttachment);
      }
      if(this.tanNoAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.tanNoAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.tanNoAttachment = this.fileuploadService.getFirstFilePath(this.tanNoAttachment);
      }
      if(this.arnNoAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.arnNoAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.arnNoAttachment = this.fileuploadService.getFirstFilePath(this.arnNoAttachment);
      }
      if(this.bankNameAttachment.length>0){
        if (!this.fileuploadService.allFilesUploaded(this.bankNameAttachment)) {
          this.dialogService.openConfirmDialog("Files uploading...")
          return;
        }
        this.PartyEntityData.bankNameAttachment = this.fileuploadService.getFirstFilePath(this.bankNameAttachment);
      }

      this.PartyEntityData.dateOfIncorporation = this.PartyEntityData.dateOfIncorporation.getTime();
      this.showLoading = true;
      this.partyMasterService.updateParty(this.PartyEntityData, headers, this.PartyEntityData.entityId).subscribe(resp => {
        this.showLoading = false;
        this.successMessage = "Party updated successfully.";
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(res => {
            this.addPartyForm.reset();
            this.router.navigate(['searchParty']);
          })
      }, (error: any) => {
        this.showLoading = false;
        this.PartyEntityData.dateOfIncorporation = (new Date(this.PartyEntityData.dateOfIncorporation));
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }
  
    // Edit
    editon = function (id) {
      
      this.add = false;
      this.edit = true;
      const headers = { "Authorization": sessionStorage.getItem("token") };
      this.showLoading = true;
      var partyId = id;
      this.partyMasterService.getPartyById(partyId, headers).subscribe(resp => {
        
        this.showLoading = false;
        this.PartyEntityData = resp;
        this.PartyEntityData.dateOfIncorporation = (new Date(this.PartyEntityData.dateOfIncorporation));
        //this.getAllOrganizations();
        //sessionStorage.setItem('poId', this.PartyEntityData.entityId);
        if (this.PartyEntityData.dateOfIncorporationAttachment != null) {
          this.dateOfIncorporationAttachment = this.fileuploadService.getSingleFileArray(this.PartyEntityData.dateOfIncorporationAttachment);
        }
        if (this.PartyEntityData.panNoAttachment != null) {
          this.panNoAttachment = this.fileuploadService.getSingleFileArray(this.PartyEntityData.panNoAttachment);
        }
        if (this.PartyEntityData.tanNoAttachment != null) {
          this.tanNoAttachment = this.fileuploadService.getSingleFileArray(this.PartyEntityData.tanNoAttachment);
        }
        if (this.PartyEntityData.arnNoAttachment != null) {
          this.arnNoAttachment = this.fileuploadService.getSingleFileArray(this.PartyEntityData.arnNoAttachment);
        }
        if (this.PartyEntityData.bankNameAttachment != null) {
          this.bankNameAttachment = this.fileuploadService.getSingleFileArray(this.PartyEntityData.bankNameAttachment);
        }
      }, (error: any) => {
        this.showLoading = false;
        this.errorHandle = true;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }

    // State List
    getAllOrganizations = function () {
      
      const headers = { "Authorization": sessionStorage.getItem("token") };
      this.showLoading = true;
      this.sharedService.getOrganizationsList(headers).subscribe(resp => {
        
        this.orgList = resp;
        this.showLoading = false;
      }, (error: any) => {
        
        this.showLoading = false;
        const errStr = error.error.errorDetail[0];
        this.dialogService.openConfirmDialog(errStr)
      });
    }

    ngOnInit() {
      this.addPartyForm = this.formBuilder.group({
        partyType: [null, Validators.required],
        partyNo: [null, Validators.required],
        partyName: [null, Validators.required],
        organizationId: [null],
        contactPersonName: [null, Validators.required],
        mobileNo: [null, Validators.required],
        //mobileNo: [null, Validators.required, Validators.min(10000000000), Validators.max(9999999999)],
        landlineNo: [null],
        emailId: [null, Validators.required],
        dateOfIncorporation: [null, Validators.required],
        dateOfIncorporationAttachment: [null],
        natureOfServiceProviding: [null, Validators.required],
        smeRegNo: [null, Validators.required],
        contactId: [null],
        panNo: [null, Validators.required],
        panNoAttachment: [null],
        tanNo: [null, Validators.required],
        tanNoAttachment: [null],
        arnNo: [null],
        arnNoAttachment: [null],
        bankName: [null],
        bankNameAttachment: [null],
        branchNameandAddress: [null],
        accountType: [null],
        accountNo: [null],
        micrCode: [null],
        ifscNeftCode: [null],
        remarks: [null],
        organisationId: [null, Validators.required]
      });
  
      if (this.route.snapshot.params.page == 'edit') {
        this.PageTitle = "Update Party";
        this.editon(this.route.snapshot.params.id);
        //this.disabledField();
      }

      this.getAllOrganizations();
    }
  
    get formControls() {
      return this.addPartyForm.controls;
    }

}
