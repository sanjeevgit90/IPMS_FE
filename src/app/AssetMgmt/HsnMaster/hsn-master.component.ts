import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { HsnMasterService } from './hsn-master.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-hsn-master',
  templateUrl: './hsn-master.component.html',
  providers: [HsnMasterService, AppGlobals, DialogService, SharedService]
})
export class HsnMasterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private hsnMasterService: HsnMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['hsncode', 'cgst', 'sgst', 'igst', 'country', 'action'];
  HSNMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "HSN Master";
  add = true;
  edit = false;
  list = true;
  hsnAdd: boolean = false;
  hsnEdit: boolean = false;
  hsnView: boolean = false;
  hsnDelete: boolean = false;

  HSNData = {
    "hsncode": null, "country": null, "cgst": 0, "sgst": 0,
    "igst": 0
  };
  addHsnForm: FormGroup;
  isSubmitted = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.HSNMasterData.filter = filterValue.trim().toLowerCase();
  }

  cancel = function () {
    this.list = true;
    this.edit = false;
    this.HSNData = {};
    this.PageTitle = "HSN Master";
    this.addHsnForm.get('hsncode').enable();
    this.addHsnForm.get('tax').enable();
    this.enableGst();
  }

  // Tax and GST based on country
  igst: boolean = true;
  tax: boolean = false;

  disableGst() {
    this.addHsnForm.get('cgst').disable();
    this.addHsnForm.get('sgst').disable();
    this.addHsnForm.get('igst').disable();
  }
  enableGst() {
    this.addHsnForm.get('cgst').enable();
    this.addHsnForm.get('sgst').enable();
    this.addHsnForm.get('igst').enable();
  }
  countryChange() {
    debugger;
    if (this.HSNData.country == "India") {
      this.addHsnForm.get('tax').disable();
      this.enableGst();
      this.tax = false
      this.igst = true;
      this.HSNData.cgst = 0;
      this.HSNData.sgst=0;
      this.HSNData.igst = 0;
      
    }
    else {
      this.disableGst()
      this.addHsnForm.get('tax').enable();
      this.tax = true
      this.igst = false;
      this.HSNData.cgst = 0;
      this.HSNData.sgst=0;
      this.HSNData.igst = 0;
    }
  }
  // Add / update function
  addHSN = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addHsnForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.hsnMasterService.saveHSN(this.HSNData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "HSN " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.HSNData = {};
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.addHsnForm.get('hsncode').enable();
          }
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Delete Function
  onDelete = function (id) {

    this.DeleteMsg = 'Are you sure you want to Deactivate this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.hsnMasterService.deleteHsnById(id, headers).subscribe(resp => {
            debugger;
            this.successMessage = 'Deactivated Successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {

            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }

      })
  }

  FilterData = {
  };
  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.hsnMasterService.getHSNList(this.FilterData, headers).subscribe(resp => {
      debugger;

      this.HSNMasterData = new MatTableDataSource(resp);
      this.HSNMasterData.sort = this.sort;
      this.HSNMasterData.paginator = this.paginator;
      this.totalRecords = this.HSNMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  editData = function (entityId) {
    debugger;
    this.list = false;
    this.edit = true;
    this.addHsnForm.get('hsncode').disable();


    for (let i = 0; i < this.HSNMasterData.filteredData.length; i++) {
      if (this.HSNMasterData.filteredData[i].entityId == entityId) {
        this.HSNData = this.HSNMasterData.filteredData[i];
        // this.ParentMenuName = this.MenuData.parent.menuname;
        //break;

        if (this.HSNMasterData.filteredData[i].country == "India") {
          this.addHsnForm.get('tax').disable();
          this.enableGst();
          this.tax = false
          this.igst = true;
          break;
        }
        else {
          this.disableGst()
          this.addHsnForm.get('tax').enable();
          this.tax = true
          this.igst = false;
          break;
        }
        
      }
    
    }
    //this.countryChange();
  }

  ngOnInit(): void {

    //Role Rights
    this.hsnAdd = this._global.UserRights.includes("HSN_Master_ADD");
    this.hsnEdit = this._global.UserRights.includes("HSN_Master_EDIT");
    this.hsnView = this._global.UserRights.includes("HSN_Master_VIEW");
    this.hsnDelete = this._global.UserRights.includes("HSN_Master_DELETE");

    this.addHsnForm = this.formBuilder.group({
      hsncode: [null, Validators.required],
      country: [null, Validators.required],
      cgst: [0, Validators.required],
      sgst: [0, Validators.required],
      igst: [0, Validators.required],
      tax: [0, Validators.required]
    });
    this.search();
  }
  get formControls() { return this.addHsnForm.controls; }
}
