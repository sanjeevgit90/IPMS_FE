import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { DeliveryChallanService } from '../dc.service';
import { SharedService } from '../../../service/shared.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { SearchAssetComponent} from '../searchAsset/searchasset.component';
import { UpdateDCAssetComponent} from '../addasset/updateasset.component';

export interface Element {
  assetname: string;
  serialno: string;
  category: string;
  productname: string;
}

@Component({
  selector: 'app-adddc',
  templateUrl: './adddc.component.html',
  providers: [DeliveryChallanService, AppGlobals, DialogService, SharedService]
})
export class AddDeliveryChallanComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private dcService: DeliveryChallanService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog:MatDialog) { }


  showLoading: boolean = false;
  disableEdit: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  displayedColumns: string[] = ['assetname', 'serialno', 'category', 'productname', 'count','action'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  @ViewChild('mytable') table: MatTable<Element>;

  PageTitle = "Add Delivery Challan";
  add = true;
  edit = false;
  list = true;

  DCData = {
    "consignor":null , "dcdate":null, "gstno":null, "fulladdress":null, "dcno":null,
    "mobileno":null, "contactperson":null , "consigneename":null, "consigneecontact":null, "projectname":null,
    "shippedto":null , "asset":[], "noofboxes": 0
  };

  state=null;
  
  projectList : any = [];
  partyList: any = [];
  addressList: any = [];
  gstList: any = [];

  party: any = [];

  addDCForm: FormGroup;
  isSubmitted = false;
  disableAdd :boolean= true;

  AssetEntityId=[];

  back = function () {
    this.router.navigate(['/searchDC']);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 == o2;
  }
 
   // projectList
  getActiveProject = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveProject(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Party List

  getActiveVendors = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveParty(headers).subscribe(resp => {
      debugger;
      this.partyList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Address List

  getAllAddressOfParty = function(id){
    this.userid=this.DCData.consignor;
    if (this.userid == null){
      return;
    }
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getAllAddressOfParty(headers, this.userid).subscribe(resp => {
      debugger;
      this.addressList = resp;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // gst List

  getGstFromAddress = function(id){
    debugger;
    if (id == null){
      return;
    }
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.getAddressDetails(id);
     this.sharedService.getGstFromAddress(headers, this.DCData.consignor, id).subscribe(resp => {
      debugger;
      this.gstData={};
      this.gstData= resp;
      if (this.gstData != null){ 
      if (this.gstData.gstNo != null){ 
        this.DCData.gstno = this.gstData.gstNo;
      }
    }
      else{
        this.DCData.gstno = 'NA';
      }
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Single List

  getAddressDetails = function(id){
    if (this.userid == null){
      return;
    }
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getAddressDetails(headers,id).subscribe(resp => {
      debugger;
      this.address = resp;
      
      if ( this.address.contactPerson != null){ 
        this.DCData.contactperson = this.address.contactPerson;
      }
      else{
        this.DCData.contactperson = 'NA';
      }
      if (this.address.contactNo != null){ 
        this.DCData.mobileno = this.address.contactNo;
      }
      else{
        this.DCData.mobileno = 'NA';
      }
     
    }, (error: any) => {
      debugger;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  

   addDC = function (flag) {
    debugger;
    this.isSubmitted = true;
    this.DCData.dcdate = this.DCData.dcdate.getTime();
   
    if (this.AssetRecord == null)
    {
      this.dialogService.openConfirmDialog("Add atleast one asset");
    }
    else
    {
      this.DCData.asset = this.saveAsset;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addDCForm.invalid) {
      return;
    }

    this.showLoading = true;
    this.dcService.saveDC(this.DCData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Delivery Challan " + flag + " successfully.";
      this.AssetRecord = [];
     // this.table.renderRows();
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
         // this.addAssetForm.reset();
          this.clearfields();
         
            this.router.navigate(['/searchDC']);
          
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      this.DCData.dcdate = (new Date(this.DCData.dcdate));
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

 clearfields = function () {
  this.DCData = {
    "consignor":null , "dcno":null , "dcdate":null, "gstno":null, "fulladdress":null, 
    "mobileno":null, "contactperson":null , "consigneename":null, "consigneecontact":null, "projectname":null,
    "challanattachment":null, "printflag":false, "shippedto":null , "asset":[]
  };
 }


totalAssets:any=0;
 // add asset
selectedAsset: any = [];
saveAsset:any =[];
 addAssets = function(id){
   debugger;
   this.data={};
  this.data.projectname=id; 
   this.data.flag ='DC';
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose=true;
  dialogConfig.autoFocus=true;
  dialogConfig.width="70%";
  dialogConfig.data = this.data;
  this.dialog.open(SearchAssetComponent,dialogConfig).afterClosed().subscribe(res => {    
   debugger;
   if (res.event == 'ADD')
   {
     this.tempAsset =res.data.saveAsset;
     for (let i =0; i< this.tempAsset.length;i++){
       this.saveAsset.push(this.tempAsset[i]);
    } 

    this.selectedAsset=res.data.selectedAsset;
    let data: Element[] = [];
   
    for (let i =0; i< this.selectedAsset.length;i++){
      if (this.AssetRecord) {
        data = (this.AssetRecord as Element[]);
      }
      this.totalAssets = this.totalAssets +1;
       data.push(this.selectedAsset[i]);
    } 
    this.disableAdd= false;
   this.AssetRecord = data;
   this.DCData.noofboxes =1;
   this.table.renderRows();
   
  }
   })
 }

 updateAsset=function(id)
 {
  debugger;
  this.data={};
 this.data.id=id;  
 const dialogConfig = new MatDialogConfig();
 dialogConfig.disableClose=true;
 dialogConfig.autoFocus=true;
 dialogConfig.width="70%";
 dialogConfig.data = this.data;
 this.dialog.open(UpdateDCAssetComponent,dialogConfig).afterClosed().subscribe(res => {    
  debugger;
  
  })
 }
 disableText = function(){
  this.addDCForm.get('consignor').disable();
  this.addDCForm.get('dcdate').disable();
  this.addDCForm.get('projectname').disable();
  this.addDCForm.get('fulladdress').disable();
  this.addDCForm.get('mobileno').disable();
  this.addDCForm.get('contactperson').disable();
  this.addDCForm.get('consigneename').disable();
  this.addDCForm.get('consigneecontact').disable();
  this.addDCForm.get('shippedto').disable();
  this.addDCForm.get('gstno').disable();
  this.addDCForm.get('totalAssets').disable();
  this.addDCForm.get('boxes').disable();
 }

 deleteAsset = function(obj)
  {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          this.saveAsset.splice(this.saveAsset.indexOf(obj), 1);
          this.dsData = this.AssetRecord as Element[];
          this.AssetRecord.splice(this.dsData.indexOf(obj), 1);
          this.totalAssets = this.totalAssets-1;
          this.table.renderRows();
        }
      })
  }

 
  // Edit

  editon = function (id, flag) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dcService.dcById(id, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.DCData = resp;
      if (this.DCData.dcdate > 0) {
        this.DCData.dcdate = (new Date(this.DCData.dcdate));  
      }
      else {
        this.DCData.dcdate = null;
      }
      
      this.getAllAddressOfParty(this.DCData.consignor) ;
      this.AssetRecord = this.DCData.assetRecord;
      for (let i =0; i< this.AssetRecord.length;i++){
        this.totalAssets = this.totalAssets +1;
      } 
      this.DCData.assetRecord = null;
      this.saveAsset = this.DCData.asset;
      this.table.renderRows();
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.getActiveProject();
    this.getActiveVendors();
debugger;
    this.addDCForm = this.formBuilder.group({
      consignor: [null, Validators.required],
      dcno: [null],
      dcdate: [null, Validators.required],
      projectname: [null, Validators.required],
      fulladdress: [null, Validators.required],
      mobileno: [null],
      contactperson: [null],
      consigneename: [null],
      consigneecontact: [null],
      shippedto: [null],
	  gstno: [null],
    totalAssets:[null],
    boxes:[null, Validators.required]
    });
    debugger;

    if (this.route.snapshot.params.page == 'edit') {
      debugger;
      this.PageTitle = "Update Delivery Challan";
      this.editon(this.route.snapshot.params.id, 'edit');

    }

    if (this.route.snapshot.params.page == 'viewDC') {
      debugger;
      this.disableEdit= true;
      this.PageTitle = "Update Assets of Delivery Challan";
      this.disableText();
      this.editon(this.route.snapshot.params.id, 'edit');

    }

   
  }
  get formControls() {
    return this.addDCForm.controls;
  }

}

