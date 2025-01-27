import { Component, Inject, Optional, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { AssetMasterService } from './../assetmaster.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-assetaudit',
  templateUrl: './assetaudit.component.html',
  providers: [AssetMasterService, AppGlobals, DialogService, SharedService]
})

export class AssetAuditComponent {

  constructor(private _global: AppGlobals, public dialogRef: MatDialogRef<AssetAuditComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }

  showLoading: boolean = false;

  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  closeDialog() {
    this.dialogRef.close(false);
  }
  // displayedColumns: string[] = 	['assetname' , 'serialno' , 'assettag', 'product','project','vendor','orderno',
  // 'purchasedate','warrantytilldate','depreciation', 'eol','assetstatus',
  // 'deliverychallanno' , 'location' ];

  displayedColumns: string[] = ['assetname', 'product', 'project', 'orderno', 'assetstatus', 'location'];


  AssetAuditRecord: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  openAudit = function (record) {
    debugger;

    this.AssetAuditRecord = new MatTableDataSource(record);
    this.AssetAuditRecord.sort = this.sort;
    this.AssetAuditRecord.paginator = this.paginator;

    this.auditDiv = true;
    console.log('#####patients inside ngonit', this.AssetAuditRecord.filteredData);
  }


  ngOnInit(): void {
    debugger;
    this.openAudit(this.data);
  }


}
