import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { PoliceStationService } from './police-station.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith } from 'rxjs/operators';
import { PoliceStnFilterSession } from '../UniqueSiteIdFilterData';
@Component({
  selector: 'app-police-station',
  templateUrl: './police-station.component.html',
  providers: [PoliceStationService, AppGlobals, DialogService, SharedService]
})
export class PoliceStationComponent implements OnInit {
  result: boolean = false;
  filteredOptions: any = [];
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private policeStationService: PoliceStationService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['policestationname', 'policestationcode', 'city', 'action'];
  PoliceMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;


  showLoading: boolean = false;


  FilterData = {
    "policestationname": null
  };
  filterDiv: boolean = false;
  filterFunc = function () {
    debugger;
    this.filterDiv = true;
  }
  closeFilter = function () {
    sessionStorage.removeItem("POLICESTNFILTERSESSION");
    this.result = false;
    this.search();
    this.filterDiv = false;
    this.FilterData = {};
  }
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  PageTitle = "Police Station Master";
  add: boolean = true;
  edit: boolean = false;
  list: boolean = true;
  policeAdd: boolean = false;
  policeEdit: boolean = false;
  policeDelete: boolean = false;
  PoliceStnData = {
    "policestationname": "", "policestationcode": "", "city": ""
  };
  cityList: any = [];
  addPoliceStationForm: FormGroup;
  isSubmitted = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.PoliceMasterData.filter = filterValue.trim().toLowerCase();
  }
  cancel = function () {
    this.list = true;
    this.edit = false;
    this.formDirective.resetForm();
    this.isSubmitted = false;
    this.PageTitle = "Police Station Master";
  }
  // City List
  getAllCity = function () {
    //debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getCityList(headers).subscribe(resp => {
      debugger;
      this.cityList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      if(error.statusText=="Unknown Error"){
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Add / update function
  addPoliceStn = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addPoliceStationForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.policeStationService.savePoliceStation(this.PoliceStnData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Police Station " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //this.addPoliceStationForm.reset()
          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Police Station Master";
          }
        })
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  onDelete = function (name) {
    //debugger;
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          //debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.policeStationService.deletePoliceStnById(name, headers).subscribe(resp => {
            //debugger;
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.formDirective.resetForm();
            this.isSubmitted = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            //debugger;
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }


  // Search function
  search = function () {
    //debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.policeStationService.getpoliceStationList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      let policeStnFilterSession = new PoliceStnFilterSession();
      policeStnFilterSession.policestationname = this.FilterData.policestationname;
      sessionStorage.setItem('POLICESTNFILTERSESSION', JSON.stringify(policeStnFilterSession));
      this.result = !Object.values(policeStnFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.PoliceMasterData = new MatTableDataSource(resp);
      this.PoliceMasterData.sort = this.sort;
      this.PoliceMasterData.paginator = this.paginator;
      this.totalRecords = this.PoliceMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get data by id
  editon = function (name) {
    //debugger;
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PageTitle = "Update Police Station";
    this.policeStationService.policeStnById(name, headers).subscribe(resp => {
      //debugger;
      this.showLoading = false;
      this.PoliceStnData = resp;
    }, (error: any) => {
      //debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  filterStates(val: string) {
    debugger;
    if (val) {
      let filterValue = val.toLowerCase();
      return this.cityList.filter(item => item.selectionvalue.toLowerCase().startsWith(filterValue));
    }
    return this.cityList;
  }
  ngOnInit(): void {

    //Role Rights
    this.policeAdd = this._global.UserRights.includes("Police_Station_Master_ADD");
    this.policeEdit = this._global.UserRights.includes("Police_Station_Master_EDIT");
    this.policeDelete = this._global.UserRights.includes("Police_Station_Master_DELETE");
    this.addPoliceStationForm = this.formBuilder.group({
      policestationname: ['', Validators.required],
      policestationcode: ['', Validators.required],
      city: ['', Validators.required]
    });

    // this.filteredOptions = this.city.valueChanges.pipe(
    this.filteredOptions = this.addPoliceStationForm.controls['city'].valueChanges.pipe(
      startWith(''),
      map(value => this.filterStates(value))
    );
    this.getAllCity();
      
    //Assign Filter
    let policeStnFilterSession = JSON.parse(sessionStorage.getItem('POLICESTNFILTERSESSION'));
    if (sessionStorage.getItem('POLICESTNFILTERSESSION') != null) {
      this.FilterData.policestationname = policeStnFilterSession.policestationname;
    }
    if (policeStnFilterSession != null) {
      this.result = !Object.values(policeStnFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
    this.search();
  }
  get formControls() { return this.addPoliceStationForm.controls; }
}
