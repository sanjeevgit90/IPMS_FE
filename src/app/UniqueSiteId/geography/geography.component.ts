import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { GeographyService } from './geography.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';

// export interface stateList {
//   name: string;
// }

@Component({
  selector: 'app-geography',
  templateUrl: './geography.component.html',
  providers: [GeographyService, AppGlobals, DialogService, SharedService]

})
export class GeographyComponent implements OnInit {

  // parentgeography = new FormControl();
  // options: stateList[] = [
  //   { name: 'Mary' },
  //   { name: 'Shelley' },
  //   { name: 'Igor' }
  // ];
  // filteredOptions: Observable<stateList[]>;
  
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private geographyService: GeographyService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['geographyname', 'geographycode', 'parentgeography', 'action'];
  GeographyMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  showLoading: boolean = false;
  filterDiv: boolean = false;
  FilterData = {
    "geographycode": null,
    "isDeleted": false
  };

  filterFunc = function () {
    debugger;
    this.filterDiv = true;
  }

  closeFilter = function () {
    debugger;
    this.filterDiv = false;
    this.FilterData = {};
  }

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "Geography Master";
  add: boolean = true;
  edit: boolean = false;
  list: boolean = true;
  geographyAdd: boolean = false;
  geographyEdit: boolean = false;
  geographyDelete: boolean = false;
  GeographyData = {
    "type": "", "geographycode": ""
  };
  stateList: any = [];
  formatData = {};
  GeographyName = "";
  ParentGeographyName = "";
  districtError: boolean = false;

  addGeographyForm: FormGroup;
  isSubmitted = false;

  applyFilter(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.GeographyMasterData.filter = filterValue.trim().toLowerCase();
  }

  cancel = function () {
    this.list = true;
    this.edit = false;
    //this.GeographyData = {};
   // this.addGeographyForm.reset()
   this.formDirective.resetForm();
   this.isSubmitted = false;
    this.PageTitle = "Geography Master";
    this.enabledField();
  }

  // State List

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
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  // Disabled Function
  disabledField = function () {
    this.addGeographyForm.get('type').disable();
    this.addGeographyForm.get('parentgeography').disable();
    this.addGeographyForm.get('geographyname').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addGeographyForm.get('type').enable();
    this.addGeographyForm.get('parentgeography').enable();
    this.addGeographyForm.get('geographyname').enable();
  }

  // Add / update function
  addGeography = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addGeographyForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };

    if (this.GeographyData.type == 'State') {
      this.ParentGeographyName = "NA";
    }
    if (this.GeographyData.type == 'District') {
      if (this.ParentGeographyName == null || this.ParentGeographyName == "" || this.ParentGeographyName == "NA") {
        this.districtError = true;
        return;
      }
    }
    this.formatData.geographyname = this.GeographyName;
    this.formatData.parentgeography = this.ParentGeographyName;
    this.GeographyData.id = this.formatData;
    this.showLoading = true;
    this.districtError = false;
    this.geographyService.saveGeography(this.GeographyData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Geography " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.GeographyData = {};
          //this.addGeographyForm.reset()
          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Geography Master";
            this.enabledField();
          }
        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  onDelete = function (name, state) {
    debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';

    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.geographyService.deleteGeographyByid(name, state, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.formDirective.resetForm();
            this.isSubmitted = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }


      })
  }

  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.geographyService.getGeographyList(this.FilterData, headers).subscribe(resp => {
      debugger;
      this.GeographyMasterData = new MatTableDataSource(resp);
      
      this.GeographyMasterData.filterPredicate = (data: any, filter) => {
        const dataStr =JSON.stringify(data).toLowerCase();
        return dataStr.indexOf(filter) != -1; 
      }

      this.GeographyMasterData.sort = this.sort;
      this.GeographyMasterData.paginator = this.paginator;

      this.totalRecords = this.GeographyMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get data by id
  editon = function (name, state) {
    debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PageTitle = "Update Geography";
    this.disabledField();
    this.geographyService.GeoById(name, state, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.GeographyData = resp;
      this.GeographyName = this.GeographyData.id.geographyname;
      this.ParentGeographyName = this.GeographyData.id.parentgeography;
      if (this.ParentGeographyName == "NA" || this.ParentGeographyName == null) {
        this.GeographyData.type = "State";
      } else {
        this.GeographyData.type = "District";
      }
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {

    //Role Rights 
    this.geographyEdit = this._global.UserRights.includes("Geography_Master_EDIT");
    this.geographyDelete = this._global.UserRights.includes("Geography_Master_DELETE");
    this.geographyAdd = this._global.UserRights.includes("Geography_Master_ADD");


    this.addGeographyForm = this.formBuilder.group({
      type: ['', Validators.required],
      geographyname: ['', Validators.required],
      geographycode: ['', Validators.required],
      parentgeography: ['']
    });
    this.getAllState();
    this.search();



    // this.filteredOptions = this.parentgeography.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value.name),
    //     map(name => name ? this._filter(name) : this.options.slice())
    //   );

  }
  // displayFn(user: stateList): string {
  //   return user && user.name ? user.name : '';
  // }
  // private _filter(name: string): stateList[] {
  //   const filterValue = name.toLowerCase();
  //   return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  // }


  get formControls() { return this.addGeographyForm.controls; }
}
