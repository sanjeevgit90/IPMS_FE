import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CategoryService } from '../CategoryMaster/categorymaster.service';
import { CategoryFilterSession } from '../assetfilterdata';
@Component({
  selector: 'app-categorymaster',
  templateUrl: './categorymaster.component.html',
  providers: [CategoryService, AppGlobals, DialogService, SharedService]
})
export class CategoryMasterComponent implements OnInit {
  result: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private categoryService: CategoryService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  // search screen start
  displayedColumns: string[] = ['categoryname', 'categorytype', 'parent', 'action'];
  CategoryRecordData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  showLoading: boolean = false;
  doItFlag: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  parentFlag = true;
  parentCategory = '';
  PageTitle = "Category Master";
  add = true;
  edit = false;
  list = true;
  categoryMasterAdd: boolean = false;
  categoryMasterEdit: boolean = false;
  categoryMasterView: boolean = false;
  categoryMasterDelete: boolean = false;
  CategoryChild = {
    "categoryname": null, "categorytype": null, "parent": {}
  };
  CategoryData = {
    "categoryname": null, "categorytype": null
  };
  CategoryTemp = {
    "categoryname": null, "categorytype": null
  };
  FilterData = { "categoryname": null };
  //, "fromdate":null, "toDate":null};
  filterDiv: boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CategoryRecordData.filter = filterValue.trim().toLowerCase();
  }
  filterFunc = function () {
    this.filterDiv = true;
  }
  cancelSearch = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("CATEGORYFILTERSESSION");
    this.result = false;
    this.search();
    this.formDirective.resetForm();
    this.isSubmitted = false;

  }
  addCategoryForm: FormGroup;
  isSubmitted = false;
  categoryList: any = [];
  cancel = function () {
    this.list = true;
    this.edit = false;
    this.addCategoryForm.reset();
    this.PageTitle = "Category Master";
    this.enabledField();
  }
  // Add / update function
  addCategoryData = function (flag) {
    this.isSubmitted = true;
    console.log(this.parentCategory);
    if (this.addCategoryForm.invalid) {
      return;
    }
    if (this.doItFlag == true) {
      if (this.parentFlag == false) {
        this.CategoryData = this.CategoryChild;
      }
      else {
        if (this.edit == true) {
          this.CategoryData = this.CategoryTemp;
        }
      }
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.categoryService.saveCategory(this.CategoryData, headers, flag).subscribe(resp => {
      this.showLoading = false;
      // this.clearFields();
      this.formDirective.resetForm();
      this.isSubmitted = false;

      this.successMessage = "Category Master " + flag + " successfully.";
      this.search();
      this.getActiveCategory();
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.clearFields();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Category Master"
            this.enabledField();
          }
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Search function
  search = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.categoryService.getCategoryList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      let categoryFilterSession = new CategoryFilterSession();
      categoryFilterSession.categoryname = this.FilterData.categoryname;
      sessionStorage.setItem('CATEGORYFILTERSESSION', JSON.stringify(categoryFilterSession));
      this.result = !Object.values(categoryFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.CategoryRecordData = new MatTableDataSource(resp);
      this.CategoryRecordData.sort = this.sort;
      this.CategoryRecordData.paginator = this.paginator;
      this.totalRecords = this.CategoryRecordData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Get data by id
  editon = function (categoryname) {
    this.list = false;
    this.edit = true;
    this.disabledField();
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PageTitle = "Update Category";
    this.categoryService.categoryByName(categoryname, headers).subscribe(resp => {
      this.showLoading = false;
      this.CategoryData = resp;
      if (this.CategoryData.parent != null) {
        this.parentCategory = this.CategoryData.parent.categoryname;
        this.parentFlag = false;
      }
      else {
        this.parentFlag = true;
      }
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  temp = {};
  getType = function (categoryname) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.categoryService.categoryByName(categoryname, headers).subscribe(resp => {
      this.showLoading = false;
      this.temp = resp;
      this.CategoryData.categorytype = this.temp.categorytype;
      this.addCategoryForm.get('categorytype').disable();
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  //get list of category
  getActiveCategory = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveCategory(headers).subscribe(resp => {
      this.categoryList = resp;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  //delete Category
  deleteCategoryData = function (name) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.categoryService.deleteCategoryData(id, headers).subscribe(resp => {
            this.showLoading = false;
            this.successMessage = "Category Master deleted successfully.";
            this.search();
            this.getActiveCategory();
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
  clearFields = function () {
    this.CategoryData = {
      "categoryname": null, "categorytype": null
    };
    this.parentCategory = null;
    this.parentFlag = true;
    this.doItFlag = false;
  }
  // Disabled Function
  disabledField = function () {
    this.addCategoryForm.get('categoryname').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addCategoryForm.get('categoryname').enable();
  }
  selectCategory = function (value) {
    this.doItFlag = true;
    if (value == undefined) {
      this.CategoryTemp.categoryname = this.CategoryData.categoryname;
      this.CategoryTemp.categorytype = this.CategoryData.categorytype;
      this.parentFlag = true;
    }
    else {
      this.getType(value);
      this.CategoryChild.categoryname = this.CategoryData.categoryname;
      this.CategoryChild.categorytype = this.CategoryData.categorytype;
      this.CategoryChild.parent.categoryname = value;
      this.parentFlag = false;
    }
  }
  ngOnInit(): void {
    //Role Rights
    this.categoryMasterAdd = this._global.UserRights.includes("Category_Master_ADD");
    this.categoryMasterEdit = this._global.UserRights.includes("Category_Master_EDIT");
    this.categoryMasterView = this._global.UserRights.includes("Category_Master_VIEW");
    this.categoryMasterDelete = this._global.UserRights.includes("Category_Master_DELETE");
    //Form Group Collection
    this.addCategoryForm = this.formBuilder.group({
      categoryname: [null, Validators.required],
      categorytype: [null, Validators.required],
      parentCategory: [null]
    });
    //Assign Filter
    let categoryFilterSession = JSON.parse(sessionStorage.getItem('CATEGORYFILTERSESSION'));
    if (sessionStorage.getItem('CATEGORYFILTERSESSION') != null) {
      this.FilterData.categoryname = categoryFilterSession.categoryname;
    }
    if (categoryFilterSession != null) {
      this.result = !Object.values(categoryFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
    this.getActiveCategory();
  }
  get formControls() { return this.addCategoryForm.controls; }
}