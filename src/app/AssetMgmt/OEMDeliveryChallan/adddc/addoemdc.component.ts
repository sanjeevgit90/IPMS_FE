import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { OEMDeliveryChallanService } from '../oemdc.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SearchAssetComponent } from '../../DeliveryChallan/searchAsset/searchasset.component';
import { OEMActionComponent } from './../assetaction/assetaction.component';

export interface Element {
  assetname: string;
  serialno: string;
  category: string;
  productname: string;
}

@Component({
  selector: 'app-addoemdc',
  templateUrl: './addoemdc.component.html',
  providers: [OEMDeliveryChallanService, AppGlobals, DialogService, SharedService]
})
export class AddOEMDCComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private dcService: OEMDeliveryChallanService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private dialog: MatDialog) { }


  showLoading: boolean = false;
  disableEdit: boolean = false;
  remove: boolean = true;


  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  displayedColumns: string[] = ['assetname', 'serialno', 'category', 'productname','count', 'action'];
  AssetRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  @ViewChild('mytable') table: MatTable<Element>;

  PageTitle = "Add Returnable Delivery Challan";
  add = true;
  edit = false;
  list = true;

  DCData = {
    "dcdate": null, "dcno": null, "consigneename": null, "consigneecontact": null, "projectname": null,
    "shippedto": null, "asset": [], "consignor":null , "fulladdress":null, "noofboxes": 0
  };

  projectList: any = [];
  partyList: any=[];
  addressList:any=[];

  addDCForm: FormGroup;
  isSubmitted = false;
  disableAdd: boolean = true;
  AssetEntityId = [];

  back = function () {
    this.router.navigate(['/searchOEMDC']);
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

  addDC = function (flag) {
    debugger;
    this.isSubmitted = true;
    this.DCData.dcdate = this.DCData.dcdate.getTime();

    if (this.AssetRecord == null) {
      this.dialogService.openConfirmDialog("Add atleast one asset");
    }
    else {
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
          this.router.navigate(['/searchOEMDC']);
          
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
      "dcdate": null, "dcno": null, "consigneename": null, "consigneecontact": null, "projectname": null,
      "shippedto": null, "asset": []
    };

  }
  totalAssets:any=0;
  // add asset
  // add asset
  selectedAsset: any = [];
  saveAsset: any = [];
  addAssets = function (id) {
    debugger;
    this.data = {};
    this.data.projectname = id;
    this.data.flag = 'OEM';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(SearchAssetComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;
      if (res.event == 'ADD') {
        this.tempAsset = res.data.saveAsset;
        for (let i = 0; i < this.tempAsset.length; i++) {
          this.saveAsset.push(this.tempAsset[i]);
        }
        this.selectedAsset = res.data.selectedAsset;
        let data: Element[] = [];

        for (let i = 0; i < this.selectedAsset.length; i++) {
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

  deleteAsset = function (obj) {
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

  action = function (id) {
    debugger;
    this.data = {};
    this.data.id = id;
    this.data.flag = 'add'
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = this.data;
    this.dialog.open(OEMActionComponent, dialogConfig).afterClosed().subscribe(res => {
      debugger;
      this.remove = false;
    })
  }
  sendToWarhouse = function (obj) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dcService.sendToWarhouse(headers, obj).subscribe(resp => {
      debugger;
      //   this.locationList = resp;
      this.successMessage = "Delivery Challan is processed successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.addAssetForm.reset();
          this.router.navigate(['/searchOEMDC']);

        })
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      const errStr = error.message;
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
      this.table.renderRows();
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  disableText = function () {
    this.addDCForm.get('dcdate').disable();
    this.addDCForm.get('projectname').disable();
    this.addDCForm.get('consigneename').disable();
    this.addDCForm.get('consigneecontact').disable();
    this.addDCForm.get('shippedto').disable();
    this.addDCForm.get('totalAssets').disable();
    this.addDCForm.get('boxes').disable();
    this.addDCForm.get('consignor').disable();
   this.addDCForm.get('fulladdress').disable();
  }

  ngOnInit(): void {
    this.getActiveProject();
    this.getActiveVendors();
    this.addDCForm = this.formBuilder.group({
      consignor: [null, Validators.required],
      fulladdress: [null, Validators.required],
      dcno: [null],
      dcdate: [null, Validators.required],
      projectname: [null, Validators.required],
      consigneename: [null],
      consigneecontact: [null],
      shippedto: [null],
      totalAssets:[null],
      boxes:[null, Validators.required]
    });
    debugger;

    if (this.route.snapshot.params.page == 'edit') {
      debugger;
      this.PageTitle = "Update Returnable Delivery Challan";
      this.editon(this.route.snapshot.params.id, 'edit');

    }

    if (this.route.snapshot.params.page == 'viewDC') {
      debugger;
      this.disableText();
      this.disableEdit = true;
      this.PageTitle = "Update Assets of Returnable Delivery Challan";
      this.editon(this.route.snapshot.params.id, 'edit');

    }


  }
  get formControls() {
    return this.addDCForm.controls;
  }

}

