
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { TicketCategoryService } from './ticket-category.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ticket-category',
  templateUrl: './ticket-category.component.html',
  providers: [TicketCategoryService, AppGlobals, DialogService, SharedService]

})
export class TicketCategoryComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private ticketCategoryService: TicketCategoryService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['categoryName', 'categoryType', 'parentCategoryId', 'action'];

  CategoryMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  ticketCategoryAdd: boolean = false;
  ticketCategoryEdit: boolean = false;
  ticketCategoryView: boolean = false;
  ticketCategoryDelete: boolean = false;

  FilterData = {

  };

  PageTitle = "Ticket Category Details";
  add = true;
  edit = false;
  list = true;
  CategoryData = {
    "categoryName": "", "categoryType": "", "parentCategoryId": null
  };

  ticketCategoryList = {};

  addTicketCategoryForm: FormGroup;
  isSubmitted = false;
  categoryList: any = [];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CategoryMasterData.filter = filterValue.trim().toLowerCase();
  }

  cancel = function () {
    this.list = true;
    this.edit = false;
    //this.CategoryData = {};

    this.formDirective.resetForm();
    this.isSubmitted = false;
    this.PageTitle = "Ticket Category Detais";
    this.enabledField();
  }


  getAllCategory = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getActiveCategoryList(headers).subscribe(resp => {
      this.ticketCategoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  getAllDistrictByState = function (name) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getDistrictList(headers, name).subscribe(resp => {
      this.subcategoryList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Add / update function
  addCategory = function (flag) {
    this.isSubmitted = true;
    if (this.CategoryData.categoryType == "Subcategory") {
      if (this.CategoryData.parentCategoryId == null) {

        this.showLoading = false;
        const errStr = "Parent Category is Required"
        this.dialogService.openConfirmDialog(errStr)
        return;
      }
    }
    if (this.addTicketCategoryForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketCategoryService.saveCategory(this.CategoryData, headers, flag).subscribe(resp => {
      this.showLoading = false;
      this.successMessage = "Category " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.CategoryData = {};

          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.getAllCategory();
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Ticket Category Details";
            this.enabledField();
          }
        })

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  deleteCategoryData = function (name) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.ticketCategoryService.deleteCategoryData(id, headers).subscribe(resp => {
            this.showLoading = false;
            this.successMessage = "Category deleted successfully.";
            this.formDirective.resetForm();
            this.isSubmitted = false;
            this.search();
            //this.getActiveCategory();
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {
              })

          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }

  getActiveCategory = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.ticketCategoryService.getActiveCategory(headers).subscribe(resp => {
      this.categoryList = resp;

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Search function
  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.ticketCategoryService.getCategoryList(headers, this.FilterData).subscribe(resp => {
      this.CategoryMasterData = new MatTableDataSource(resp);
      this.CategoryMasterData.sort = this.sort;
      this.CategoryMasterData.paginator = this.paginator;
      this.totalRecords = this.CategoryMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get data by id
  editon = function (id) {
    //this.disabledField();
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var categoryName = id;
    this.PageTitle = "Update Category";
    this.ticketCategoryService.CategoyById(categoryName, headers).subscribe(resp => {

      this.showLoading = false;
      this.CategoryData = resp;
    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Disabled Function
  disabledField = function () {
    this.addTicketCategoryForm.get('categoryName').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addTicketCategoryForm.get('categoryName').enable();
  }

  ngOnInit(): void {


    //Role Rights
    this.ticketCategoryAdd = this._global.UserRights.includes("Ticket_Category_ADD");
    this.ticketCategoryEdit = this._global.UserRights.includes("Ticket_Category_EDIT");
    this.ticketCategoryView = this._global.UserRights.includes("Ticket_Category_VIEW");
    this.ticketCategoryDelete = this._global.UserRights.includes("Ticket_Category_DELETE");


    this.addTicketCategoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      categoryType: ['', Validators.required],
      parentCategoryId: [''],
    });
    this.search();
    this.getAllCategory();
    this.getActiveCategory();
  }
  get formControls() { return this.addTicketCategoryForm.controls; }
}
