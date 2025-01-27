import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { ModelMasterService } from './modelmaster.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ModelMasterFilterSession } from '../assetfilterdata';
@Component({
  selector: 'app-modelmaster',
  templateUrl: './modelmaster.component.html',
  providers: [ModelMasterService, AppGlobals, DialogService, SharedService]

})
export class ModelMasterComponent implements OnInit {
  result: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private modelMasterService: ModelMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  // search screen start
  displayedColumns: string[] = ['modelname', 'manufacture', 'description', 'action'];
  ModelMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  manufacturename = '';
  disableFlag = false;

  PageTitle = "Model Master";
  add = true;
  edit = false;
  list = true;

  modelAdd: boolean = false;
  modelEdit: boolean = false;
  modelView: boolean = false;
  modelDelete: boolean = false;
  ModelData = {
    "modelname": null, "manufacture": {}, "description": null
  };
  addModelForm: FormGroup;
  isSubmitted = false;
  manufacturerList: any = [];

  cancel = function () {
    this.list = true;
    this.edit = false;
    this.addModelForm.reset();
    this.PageTitle = "Model Master";
    this.enabledField();
  }
  FilterData = { "modelname": null };
  //, "fromdate":null, "toDate":null};

  filterDiv: boolean = false;

  filterFunc = function () {

    this.filterDiv = true;
  }
  cancelSearch = function () {
    this.filterDiv = false;
    this.FilterData = {};
    sessionStorage.removeItem("MODELMASTERFILTERSESSION");
    this.result = false;
    this.search();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ModelMasterData.filter = filterValue.trim().toLowerCase();
  }

  // Add / update function
  addModelData = function (flag) {
    this.isSubmitted = true;
    if (this.addModelForm.invalid) {
      return;
    }
    this.ModelData.manufacture.manufacturername = this.manufacturename;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.modelMasterService.saveModelData(this.ModelData, headers, flag).subscribe(resp => {
      this.showLoading = false;
      this.clearFields();
      this.successMessage = "Model Master " + flag + " successfully.";
      this.search();
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          // this.ModelData = {};
          this.manufacturename = [];
          // this.addModelForm.reset();
          this.formDirective.resetForm();
          this.isSubmitted = false;
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Model Master"
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
    debugger;
    this.modelMasterService.getModelList(this.FilterData, headers).subscribe(resp => {
      // Set Filter
      debugger;
      let modelMasterFilterSession = new ModelMasterFilterSession();
      modelMasterFilterSession.modelname = this.FilterData.modelname;
      sessionStorage.setItem('MODELMASTERFILTERSESSION', JSON.stringify(modelMasterFilterSession));
      this.result = !Object.values(modelMasterFilterSession).every(o => o === null || o === undefined);
      this.filterDiv = false;
      this.ModelMasterData = new MatTableDataSource(resp);
      this.ModelMasterData.sort = this.sort;
      this.ModelMasterData.paginator = this.paginator;
      this.totalRecords = this.ModelMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Get data by id
  editon = function (name) {
    this.list = false;
    this.edit = true;
    this.disabledField();
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PageTitle = "Update Model";
    this.modelMasterService.modelByName(name, headers).subscribe(resp => {

      this.showLoading = false;
      this.ModelData = resp;
      this.disableFlag = true;
      this.manufacturename = this.ModelData.manufacture.manufacturername;
    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  //get list of manufacturers

  getActiveManufacturer = function () {

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.sharedService.getActiveManufacturer(headers).subscribe(resp => {

      this.manufacturerList = resp;

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
          this.modelMasterService.deleteModel(id, headers).subscribe(resp => {
            this.showLoading = false;
            this.successMessage = "Model Master deleted successfully.";
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
  clearFields = function () {
    this.ModelData = {
      "modelname": null, "manufacture": {}, "description": null
    };
  }

  // Disabled Function
  disabledField = function () {
    this.addModelForm.get('modelname').disable();
  }
  // enabled Function
  enabledField = function () {
    this.addModelForm.get('modelname').enable();
  }

  ngOnInit(): void {
    //Role Rights
    this.modelAdd = this._global.UserRights.includes("Model_Master_ADD");
    this.modelEdit = this._global.UserRights.includes("Model_Master_EDIT");
    this.modelView = this._global.UserRights.includes("Model_Master_VIEW");
    this.modelDelete = this._global.UserRights.includes("Model_Master_DELETE");
    this.addModelForm = this.formBuilder.group({
      modelname: [null, Validators.required],
      manufacture: [{}, Validators.required],
      description: [null]
    });
    //Assign Filter
    let modelMasterFilterSession = JSON.parse(sessionStorage.getItem('MODELMASTERFILTERSESSION'));
    if (sessionStorage.getItem('MODELMASTERFILTERSESSION') != null) {
      this.FilterData.modelname = modelMasterFilterSession.modelname;
    }
    if (modelMasterFilterSession != null) {
      this.result = !Object.values(modelMasterFilterSession).every(o => o === null);
    } else {
      this.result = false;
    }
debugger;
    this.search();
    this.getActiveManufacturer();
  }
  get formControls() { return this.addModelForm.controls; }
}
