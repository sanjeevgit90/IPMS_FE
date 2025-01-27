import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { BoqMasterService } from '../../OrderMgmt/boq-master/boq-master.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-boq-master',
  templateUrl: './boq-master.component.html',
  providers: [BoqMasterService, AppGlobals, DialogService, SharedService]
})
export class BoqMasterComponent implements OnInit {


  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private boqMasterService: BoqMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }


    displayedColumns: string[] = ['boqNo', 'accountId', 'boqDate', 'action'];
    BoqListData: MatTableDataSource<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
    showLoading: boolean = false;
  
    totalRecords: any;
    itemPerPage = this._global.pageNumer;
    pageSizedisplay = this._global.pageSize;
  
    FilterData = {"boqNo":""};
  
    PageTitle = "Boq Master";
    filterDiv:boolean = false;
    addBoq = function() {
      debugger;
      this.router.navigate(['/AddBoq']);
    }
  
    filterFunc = function() {
      debugger;
      this.filterDiv = true;
    }
    cancel = function() {
      debugger;
      this.filterDiv = false;
      this.FilterData = {};
    }
  
    /* search = function () {
      debugger;
  
      const headers = { "Authorization": sessionStorage.getItem("token") };
      this.showLoading = true;
      this.FilterData.confirmed = true;
      this.userProfileService.userList(this.FilterData, headers).subscribe(resp => {
        debugger;
        this.UserMasterData= new MatTableDataSource(resp);
        this.UserMasterData.sort = this.sort;
        this.UserMasterData.paginator = this.paginator;
        this.totalRecords = this.UserMasterData.filteredData.length;
        this.showLoading = false;
         
    
      }, (error: any) => {
        debugger;
        this.showLoading = false;
        const errStr = error.error.errorMessage;
        this.dialogService.openConfirmDialog(errStr)
      });
    } */

  // Search function
  searchBoq = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;

    this.boqMasterService.getAllBoq(this.FilterData, headers).subscribe(resp => {
      debugger;

      this.BoqListData = new MatTableDataSource(resp);
      this.BoqListData.sort = this.sort;
      this.BoqListData.paginator = this.paginator;
      this.totalRecords = this.BoqListData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
    
  
  
    ngOnInit(): void {
      this.searchBoq();
    }




/* 
  displayedColumns: string[] = ['type', 'value', 'action'];
  BoqListData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "BOQ Master";
  add = true;
  edit = false;
  list = true;
  BoqEntityData = {
    "boqNo": "", "accountId": "", "boqDate": ""
  };
  addBoqForm: FormGroup;
  isSubmitted = false;
  cancel = function () {
    this.list = true;
    this.edit = false;
    this.addBoqForm.reset();
    this.PageTitle = "Constant Master";
  }

  addBoq = function() {
    debugger;
    this.router.navigate(['/AddBoq']);
  }

  // Add function
  addConstant = function () {
    debugger;
    this.isSubmitted = true;
    if (this.addBoqForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.constantMasterService.saveConstant(this.ConstantData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Department saved successfully.";
      this.search();

      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.ConstantData = {};
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // update function
  updateConstant = function () {
    debugger;
    this.isSubmitted = true;
    if (this.addBoqForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.constantMasterService.updateConstant(this.ConstantData, headers, this.ConstantData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Constant updated successfully.";
      this.search();

      this.dialogService.openConfirmDialog(this.successMessage).afterClosed().subscribe(res => {
        this.ConstantData = {};
        this.edit = false;
        this.list = true;
        this.PageTitle = "Constant Master"
      })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.boqMasterService.searchBoq(headers).subscribe(resp => {
      debugger;

      this.BoqListData = new MatTableDataSource(resp);
      this.BoqListData.sort = this.sort;
      this.BoqListData.paginator = this.paginator;
      this.totalRecords = this.BoqListData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get data by id
  editon = function (id) {
    debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PageTitle = "Update Constant";
    this.constantMasterService.getConstantById(headers, id).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ConstantData = resp;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // delete by id
  deleteon = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    //this.PageTitle = "Update Constant";
    this.constantMasterService.deleteConstantById(headers, id).subscribe(resp => {
      debugger;
      this.showLoading = false;
      //this.ConstantData = resp;
      this.successMessage = "Constant deleted successfully.";
      this.search();

      this.dialogService.openConfirmDialog(this.successMessage);
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  ngOnInit(): void {
    this.addBoqForm = this.formBuilder.group({
      type: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.search();
  }
  get formControls() { return this.addBoqForm.controls; }
 */
}
