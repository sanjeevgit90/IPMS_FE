import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { MenuService } from './menu.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MenuFilterSession } from '../ConfigurationMgmtFilterData';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  providers: [MenuService, AppGlobals, DialogService, SharedService]
})
export class MenuComponent implements OnInit {
  result: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private menuService: MenuService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService
  ) { }

 
  displayedColumns: string[] = ['displayname', 'menuname', 'urlpath', 'parent', 'action'];
  MenuMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  PageTitle = "Menu Master";
  filterDiv: boolean = false;
  add = true;
  edit = false;
  list = true;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.MenuMasterData.filter = filterValue.trim().toLowerCase();
  }
  menuEdit: boolean = false;
  menuAdd: boolean = false;
  menuDelete: boolean = false;
  MenuData = {
    "displayname": "", "menuname": "", "urlpath": "", "menuorder": "", "description":null,
  };
  ParentMenuName: string = null;
  ParentMenuList: any = [];
  FilterData = {
    "displayname": null, "menuname": null,
  };
  formatData = {};
  addMenuForm: FormGroup;
  isSubmitted = false;
  filterFunc = function () {
    this.filterDiv = true;
    this.formDirective.resetForm();
  }
  closeFilter = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("MENUFILTERSESSION");
    this.result = false;
    this.search();
  }
  cancel = function () {
    this.list = true;
    this.edit = false;
    this.PageTitle = "Menu Master";
    this.enabledField();
    this.formDirective.resetForm();
    this.isSubmitted = false;
    this.ParentMenuName = "";
  }
  // All Parent Menu
  getAllParentMenu = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getParentMenuList(headers).subscribe(resp => {
      this.ParentMenuList = resp;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Add / update function
  addMenu = function (flag) {
    this.isSubmitted = true;
    if (this.addMenuForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.ParentMenuName != null || this.ParentMenuName != undefined) {
      if (this.ParentMenuName != "") {
        this.formatData.menuname = this.ParentMenuName;
        this.MenuData.parent = this.formatData;
      }
    }
    this.showLoading = true;
    this.menuService.saveMenu(this.MenuData, headers, flag).subscribe(resp => {
      this.showLoading = false;
      this.successMessage = "Menu " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Menu Master";
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
    this.menuService.getMenuList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      let menuFilterSession = new MenuFilterSession();
      menuFilterSession.displayname = this.FilterData.displayname;
      menuFilterSession.menuname = this.FilterData.menuname;
      sessionStorage.setItem('MENUFILTERSESSION', JSON.stringify(menuFilterSession));
      this.result = !Object.values(menuFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.MenuMasterData = new MatTableDataSource(resp);
      this.MenuMasterData.sort = this.sort;
      this.MenuMasterData.paginator = this.paginator;
      this.totalRecords = this.MenuMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  //Edit Single item
  editData = function (menuname) {
    this.list = false;
    this.edit = true;
    this.disabledField();
    for (let i = 0; i < this.MenuMasterData.filteredData.length; i++) {
      if (this.MenuMasterData.filteredData[i].menuname == menuname) {
        this.MenuData = this.MenuMasterData.filteredData[i];
        this.ParentMenuName = this.MenuData.parent.menuname;
        break;
      }
    }
  }
  // Delete Function
  onDelete = function (name) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.menuService.deleteMenuByName(name, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.formDirective.resetForm();
            this.isSubmitted = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      })
  }
  // Disabled Function
  disabledField = function () {
    this.addMenuForm.get('menuname').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addMenuForm.get('menuname').enable();
  }
  
  ngOnInit(): void {
    //Role Rights
    this.menuEdit = this._global.UserRights.includes("Menu_Master_EDIT");
    this.menuAdd = this._global.UserRights.includes("Menu_Master_ADD");
    this.menuDelete = this._global.UserRights.includes("Menu_Master_DELETE");
    //Fromgroup collection
    this.addMenuForm = this.formBuilder.group({
      displayname: ['', Validators.required],
      menuname: ['', Validators.required],
      urlpath: ['', Validators.required],
      menuorder: ['', Validators.required],
      ParentMenuName: [''],
      description:[null]
    });
    //Assign Filter
    let menuFilterSession = JSON.parse(sessionStorage.getItem('MENUFILTERSESSION'));
    if (sessionStorage.getItem('MENUFILTERSESSION') != null) {
      this.FilterData.displayname = menuFilterSession.displayname;
      this.FilterData.menuname = menuFilterSession.menuname;
    }
    if (menuFilterSession != null) {
      this.result = !Object.values(menuFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
    this.getAllParentMenu();
  }
  get formControls() { return this.addMenuForm.controls; }
}