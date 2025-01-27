import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AssetCountReportService } from './assetcountreport.service';

@Component({
  selector: 'app-assetcountreport',
  templateUrl: './assetcountreport.component.html',
  providers: [AssetCountReportService, AppGlobals, DialogService, SharedService]
})
export class AssetCountReportComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private reportService: AssetCountReportService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['parent', 'child', 'count'];
  ReportRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;
  addConstantForm: FormGroup;
  state: String = null;
  district: String = null;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  PageTitle = "Asset Count Report";
  ReportValue = { "selectedParameter": null };
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ReportRecord.filter = filterValue.trim().toLowerCase();
  }
  getAssetsCountReport = function (parameter) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    if (parameter == null) {
      const errStr = "Please Select one Report type";
      this.dialogService.openConfirmDialog(errStr)
      return;
    }
    this.reportService.assetCount(parameter, headers, this.state, this.district).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.ReportRecord = new MatTableDataSource(resp);
      this.ReportRecord.sort = this.sort;
      this.ReportRecord.paginator = this.paginator;
      this.totalRecords = this.ReportRecord.filteredData.length;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  ngOnInit(): void {
    this.addConstantForm = this.formBuilder.group({
      selectedParameter: ['CITY', Validators.required]
    });
    debugger;

    var district = sessionStorage.getItem("selectedDistrict");
    var state = sessionStorage.getItem("selectedState");
    if (district != null) {
      this.district = district;
      this.state = state;
    }
    this.ReportValue.selectedParameter = 'CITY';
    this.getAssetsCountReport('CITY');
  }

  get formControls() { return this.addConstantForm.controls; }



}
