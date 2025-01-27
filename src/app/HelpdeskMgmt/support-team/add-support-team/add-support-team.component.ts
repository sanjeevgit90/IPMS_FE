import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { FileuploadService } from '../../../service/fileupload.service';
import { SupportTeamService } from '../support-team.service';



@Component({
  selector: 'app-add-support-team',
  templateUrl: './add-support-team.component.html',
  providers: [SupportTeamService,AppGlobals, DialogService, SharedService,FileuploadService]

})
export class AddSupportTeamComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private supportTeamService: SupportTeamService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,private fileuploadService: FileuploadService) { }

 showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "Add Support";

  supportIdFiles: any = [];
  supportAddressFiles: any = [];
  


  add = true;
  edit = false;
  list = true;
  SupportTeamData = {
    "firstName":"","lastName":"","vehicleSupportType":"","address":"","pincode":"",
    "state":"","district":"","usid":"",
    "serviceStartDate":"","idProof":"","addressProof":"",
    "employeeId":""
  };


  stateList:any = [];
  districtList:any = [];
  locationList:any = [];
  
  


  addSupportTeamForm: FormGroup;
  isSubmitted = false;
  

  back = function () {
    this.router.navigate(['/searchDriver']);
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

// Add / update function
addSupportTeam = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addSupportTeamForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };

     //If mandatory then check for atleast one fileuploaded
    //  if (!this.fileuploadService.hasfile(this.supportIdFiles)) {
    //   this.dialogService.openConfirmDialog("Please uplaod profile pic")
    //   return;
    // }

    // if (!this.fileuploadService.hasfile(this.supportAddressFiles)) {
    //   this.dialogService.openConfirmDialog("Please uplaod profile pic")
    //   return;
    // }
     //Check if all files are uploaded Successfully
  if (this.supportIdFiles.length>0){
     if (!this.fileuploadService.allFilesUploaded(this.supportIdFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.SupportTeamData = this.fileuploadService.getFirstFilePath(this.supportIdFiles);
  }
  if (this.supportAddressFiles.length>0){
   if (!this.fileuploadService.allFilesUploaded(this.supportAddressFiles)) {
      this.dialogService.openConfirmDialog("Files uploading...")
      return;
    }
    this.SupportTeamData.addressProof = this.fileuploadService.getFirstFilePath(this.supportAddressFiles);
  }
    
        this.SupportTeamData.serviceStartDate = this.SupportTeamData.serviceStartDate.getTime();
         this.showLoading = true;
    
    this.supportTeamService.saveSupportTeam(this.SupportTeamData,headers,flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Support Team " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {

          this.addSupportTeamForm.reset();
          if (flag == 'update' || 'save') {
            this.router.navigate(['/searchDriver']);
          }
          if (flag == "update") {
            this.edit = false;
            this.list = true;
          }
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.SupportTeamData.serviceStartDate = (new Date(this.SupportTeamData.serviceStartDate));
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
    this.PageTitle = "Update Support Team ";
    this.supportTeamService.getSupportTeamByEmployeeId(entityId, headers,flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.SupportTeamData = resp;

      this.SupportTeamData.serviceStartDate = (new Date(this.SupportTeamData.serviceStartDate));
        this.getAllState();
        this.getAllDistrictByState(this.SupportTeamData.state);
        this.getActiveLocationsFromDistrict(this.SupportTeamData.district)
      
        if (this.SupportTeamData.idProof != null) {
          this.supportIdFiles = this.fileuploadService.getSingleFileArray(this.SupportTeamData.idProof);
        } 

        if (this.SupportTeamData.addressProof != null) {
          this.supportAddressFiles = this.fileuploadService.getSingleFileArray(this.SupportTeamData.addressProof);
        } 
        
      
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.addSupportTeamForm = this.formBuilder.group({
      firstName:['', Validators.required],
      lastName:['', Validators.required],
      vehicleSupportType:['', Validators.required],
      address:[''],
      pincode:[''],
      state:[''],
      district:[''],
      usid:[''],
      serviceStartDate:['', Validators.required],
      idProof:[''],
      addressProof:[''],
      employeeId:['',Validators.required],
      
     
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Support Team";
      this.editon(this.route.snapshot.params.id, 'edit');

    }


    this.getAllState();
    
   
  }
  get formControls() { 
    return this.addSupportTeamForm.controls;
   }
  
}














