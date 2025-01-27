import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { InterDistrictDCService } from '../interDC.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { SearchAssetComponent} from '../../DeliveryChallan/searchAsset/searchasset.component';
import { UpdateDCAssetComponent} from '../../DeliveryChallan/addasset/updateasset.component';
import { ActionComponent} from '../action/action.component';

export interface Element {
  assetname: string;
  serialno: string;
  category: string;
  productname: string;
}

@Component({
  selector: 'app-interdcAdd',
  templateUrl: './interdcAdd.component.html',
  providers: [InterDistrictDCService, AppGlobals, DialogService, SharedService]
})
export class AddInterDCComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private dcService: InterDistrictDCService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog:MatDialog) { }


  showLoading: boolean = false;
  disableEdit: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  displayedColumns: string[] = ['assetname', 'serialno', 'category', 'productname','count','action'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  @ViewChild('mytable') table: MatTable<Element>;

  PageTitle = "Add Inter District Delivery Challan";
  add = true;
  edit = false;
  list = true;

  DCData = {
    "dcdate":null, "dcno":null, "mobileno":null, "contactperson":null , "consigneename":null, 
    "consigneecontact":null, "projectname":null,
    "shippedto":null , "remark":null, "asset":[], "noofboxes": 0
  };

  projectList : any = [];
  locationList: any = [];
  
  addDCForm: FormGroup;
  isSubmitted = false;
  disableAdd:Boolean = true;

  back = function () {
    this.router.navigate(['/searchInterDC']);
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

  getActiveLocations = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getWarehouse(headers).subscribe(resp => {
      debugger;
      this.locationList = resp;
      this.showLoading = false;
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
      return;
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
    //  this.table.renderRows();
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
         // this.addAssetForm.reset();
          this.clearfields();
          this.router.navigate(['/searchInterDC']);
                 
        })

    }, (error: any) => {
      debugger;
      this.DCData.dcdate = (new Date(this.DCData.dcdate));
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

 clearfields = function () {
  this.DCData = {
    "dcdate":null, "dcno":null, "mobileno":null, "contactperson":null , "consigneename":null, 
    "consigneecontact":null, "projectname":null,
    "shippedto":null , "remark":null, "asset":[]
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
  this.data.flag ='INTERDC';
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
    this.disableAdd = false;
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

  sendToWarhouse= function(obj){
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.id = obj.entityId;
    this.dcService.sendToWarhouse(headers, this.id).subscribe(resp => {
      debugger;
   //   this.locationList = resp;
     this.successMessage = "Delivery Challan is processed successfully.";
     this.dialogService.openConfirmDialog(this.successMessage)
     .afterClosed().subscribe(res => {
      // this.addAssetForm.reset();
      this.router.navigate(['/searchInterDC']);
     })
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

action= function(id)
{
  debugger;
  this.data={};
 this.data.id=id;  
 this.data.flag='Interdc'
 const dialogConfig = new MatDialogConfig();
 dialogConfig.disableClose=true;
 dialogConfig.autoFocus=true;
 dialogConfig.width="70%";
 dialogConfig.data = this.data;
 this.dialog.open(ActionComponent,dialogConfig).afterClosed().subscribe(res => {    
  debugger;
  
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
      this.AssetRecord = this.DCData.assetRecord;
      for (let i =0; i< this.AssetRecord.length;i++){
        this.totalAssets = this.totalAssets +1;
      } 
      this.DCData.assetRecord = null;
      this.saveAsset = this.DCData.asset;
      this.DCData.noofboxes =1;
      this.table.renderRows();
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  disableText = function(){
    this.addDCForm.get('dcdate').disable();
    this.addDCForm.get('projectname').disable();
    this.addDCForm.get('mobileno').disable();
    this.addDCForm.get('contactperson').disable();
    this.addDCForm.get('consigneename').disable();
    this.addDCForm.get('consigneecontact').disable();
    this.addDCForm.get('shippedto').disable();
    this.addDCForm.get('remark').disable();
    this.addDCForm.get('totalAssets').disable();
  this.addDCForm.get('boxes').disable();
 }

  ngOnInit(): void {
    this.getActiveProject();
    this.getActiveLocations();
    debugger;
    this.addDCForm = this.formBuilder.group({
      dcno: [null],
      dcdate: [null, Validators.required],
      projectname: [null, Validators.required],
      mobileno: [null],
      contactperson: [null],
      consigneename: [null],
      consigneecontact: [null],
      shippedto: [null],
	    remark: [null],
      totalAssets:[null],
      boxes:[null, Validators.required]
    });
    debugger;

    if (this.route.snapshot.params.page == 'edit') {
      debugger;
      this.PageTitle = "Update Inter District Delivery Challan";
      this.editon(this.route.snapshot.params.id, 'edit');

    }

    if (this.route.snapshot.params.page == 'viewDC') {
      debugger;
      this.disableEdit= true;
      this.disableText();
      this.PageTitle = "Update Assets of Inter District Delivery Challan";
      this.editon(this.route.snapshot.params.id, 'edit');

    }

   
  }
  get formControls() {
    return this.addDCForm.controls;
  }

}

