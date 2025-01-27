import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { ManufacturerService } from './manufacturer.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ManufacturerFilterSession } from '../assetfilterdata';

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  providers: [ManufacturerService, AppGlobals, DialogService, SharedService]

})
export class ManufacturerComponent implements OnInit {
  result: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private manufacturerService: ManufacturerService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['manufacturername', 'action'];
  ManufacturerRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Manufacturer Master";
  add = true;
  edit = false;
  list = true;
  manufacturerAdd: boolean = false;
  manufacturerEdit: boolean = false;
  manufacturerView: boolean = false;
  manufacturerDelete: boolean = false;
  ManufacturerData = { "manufacturername": null };
  addManufacturerForm: FormGroup;
  isSubmitted = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ManufacturerRecord.filter = filterValue.trim().toLowerCase();
  }
  cancel = function () {
    this.list = true;
    this.edit = false;
    this.PageTitle = "Manufacturer Master";
  }
  FilterData = { "manufacturername": null };
  //, "fromdate":null, "toDate":null};

  filterDiv: boolean = false;
  filterFunc = function () {
    this.filterDiv = true;
  }
  cancelSearch = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("MANUFACTURERFILTERSESSION");
    this.result = false;
    this.search();
  }

  // Add / update function
  addManufacturer = function (flag) {
    this.isSubmitted = true;
    if (this.addManufacturerForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.manufacturerService.saveManufacturer(this.ManufacturerData, headers, flag).subscribe(resp => {
      this.showLoading = false;
      this.successMessage = "Manufacturer " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.ManufacturerData = {};
          // this.addManufacturerForm.reset();
          this.formDirective.resetForm();
          this.isSubmitted = false;

          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
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
    this.manufacturerService.getManufacturerList(headers, this.FilterData).subscribe(resp => {
      // Set Filter
      debugger;
      let manufacturerFilterSession = new ManufacturerFilterSession();
      manufacturerFilterSession.manufacturername = this.FilterData.manufacturername;
      sessionStorage.setItem('MANUFACTURERFILTERSESSION', JSON.stringify(manufacturerFilterSession));
      this.result = !Object.values(manufacturerFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.ManufacturerRecord = new MatTableDataSource(resp);
      this.ManufacturerRecord.sort = this.sort;
      this.ManufacturerRecord.paginator = this.paginator;
      this.totalRecords = this.ManufacturerRecord.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  onDelete = function (name) {

    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    var id = name;
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {

          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.manufacturerService.deleteManufacturar(id, headers).subscribe(resp => {

            this.showLoading = false;
            this.successMessage = "Manufacturer deleted successfully.";
            this.search();
            this.dialogService.openConfirmDialog(this.successMessage)
              .afterClosed().subscribe(res => {
              })

          }, (error: any) => {

            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }

  ngOnInit(): void {
debugger;
    //Role Rights
    this.manufacturerAdd = this._global.UserRights.includes("Manufacturer_Master_ADD");
    this.manufacturerEdit = this._global.UserRights.includes("Manufacturer_Master_EDIT");
    this.manufacturerView = this._global.UserRights.includes("Manufacturer_Master_VIEW");
    this.manufacturerDelete = this._global.UserRights.includes("Manufacturer_Master_DELETE");
    this.addManufacturerForm = this.formBuilder.group({
      manufacturername: [null, Validators.required]
    });
    //Assign Filter
    let manufacturerFilterSession = JSON.parse(sessionStorage.getItem('MANUFACTURERFILTERSESSION'));
    if (sessionStorage.getItem('MANUFACTURERFILTERSESSION') != null) {
      this.FilterData.manufacturername = manufacturerFilterSession.manufacturername;
    }
    if (manufacturerFilterSession != null) {
      this.result = !Object.values(manufacturerFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }

    this.search();
  }
  get formControls() { return this.addManufacturerForm.controls; }
}
