import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { CurrencyMasterService } from './currency-master.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-currency-master',
  templateUrl: './currency-master.component.html',
  providers: [CurrencyMasterService, AppGlobals, DialogService, SharedService]

})
export class CurrencyMasterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private currencyMasterService: CurrencyMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['currencyName', 'currencySymbol', 'action'];

  CurrencyMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Currency Master";
  add = true;
  edit = false;
  list = true;
  CurrencyData = {
    "currencyName": null, "currencySymbol": null, "organisationId": null };
    addCurrencyMasterForm: FormGroup;
  isSubmitted = false;
  cancel = function () {
    this.list = true;
    this.edit = false;
    this.CurrencyData = {};
    this.PageTitle = "Currency Master";
  }

  clear = function () {
    this.CurrencyData = {};
    this.search();
  }

  FilterData = {"currencyName": null, "currencySymbol": null, "organisationId": null};

  // Add / update function
  addCurrency = function (flag) {
    debugger;
    this.isSubmitted = true;
    if (this.addCurrencyMasterForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.currencyMasterService.saveCurrency(this.CurrencyData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Currency " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.CurrencyData = {};
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
          }
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
    this.currencyMasterService.currencyList(this.CurrencyData, headers).subscribe(resp => {
      debugger;
      this.CurrencyMasterData = new MatTableDataSource(resp);
      this.CurrencyMasterData.sort = this.sort;
      this.CurrencyMasterData.paginator = this.paginator;
      this.totalRecords = this.CurrencyMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Delete function
  onDelete = function (currencyName, isDeleted) {
    debugger;
    if(isDeleted){
      this.DeleteMsg = 'Are you sure you want to activate this currency?';
    } else {
      this.DeleteMsg = 'Are you sure you want to deactivate this currency?';
    }
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.currencyMasterService.deleteCurrencyById(currencyName, headers).subscribe(resp => {
            this.showLoading = false;
            if(isDeleted){
              this.successMessage = 'Currency activated.';
            } else {
              this.successMessage = 'Currency de-activated.';
            }
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr);
          });
        }
    })
  }

  ngOnInit(): void {
    this.addCurrencyMasterForm = this.formBuilder.group({
      currencyName: [null, Validators.required],
      currencySymbol: [null, Validators.required],
      organisationId: [null]
   });
    this.search();
  }
  get formControls() { return this.addCurrencyMasterForm.controls; }
}



