import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { PartyGstService } from './party-gst.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FileuploadService } from '../../service/fileupload.service';
import { GeographyService } from '../../UniqueSiteId/geography/geography.service';

@Component({
  selector: 'app-party-gst',
  templateUrl: './party-gst.component.html',
  providers: [PartyGstService, AppGlobals, DialogService, SharedService, FileuploadService, GeographyService]
})
export class PartyGstComponent implements OnInit {


  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private partyGstService: PartyGstService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService, private fileuploadService: FileuploadService,
    private geographyService: GeographyService) { }
  displayedColumns: string[] = ['gstNo', 'state', 'gstNoAttachment', 'action'];
  GstMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "GST Master";

  add = true;
  edit = false;
  list = true;
  stateList: any = [];
  baseUrl: string = null;

  GSTData = {
    "gstNo": null, "state": null, "gstNoAttachment": null, "partyMasterParent": null
  };

  PartyParent = { "entityId": "" };
  addGstForm: FormGroup;
  isSubmitted = false;
  gstNoAttachment: any = [];

  cancel = function () {
    this.list = true;
    this.edit = false;
    this.addGstForm.reset()
    this.PageTitle = "GST Master";
  }
  getAllState = function () {

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getStateList(headers).subscribe(resp => {

      this.stateList = resp;
      this.showLoading = false;
    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr);
    });
  }

  // Add / update function
  addGst = function (flag) {
    this.isSubmitted = true;
    if (this.addGstForm.invalid) {
      return;
    }
    var error = "";
    if (this.codeFlag) {
      error += "Please enter a valid GST IN.";
      this.dialogService.openConfirmDialog(error);
      return;
    }
    //Check if all files are uploaded Successfully
    if (this.gstNoAttachment.length > 0) {
      if (!this.fileuploadService.allFilesUploaded(this.gstNoAttachment)) {
        this.dialogService.openConfirmDialog("Files uploading...")
        return;
      }
      this.GSTData.gstNoAttachment = this.fileuploadService.getFirstFilePath(this.gstNoAttachment);
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.PartyParent.entityId = this.route.snapshot.params.id;
    this.GSTData.partyMasterParent = this.PartyParent;
    this.showLoading = true;
    this.partyGstService.saveGst(this.GSTData, headers, flag).subscribe(resp => {

      this.showLoading = false;
      this.successMessage = "GST " + flag + "d successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addGstForm.reset()
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "GST Master";
          }
        })

    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr);
    });
  }


  // Search function
  search = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.partyGstService.getAllGstOfParty(headers, this.route.snapshot.params.id).subscribe(resp => {
      debugger;
      this.GstMasterData = new MatTableDataSource(resp);
      this.GstMasterData.sort = this.sort;
      this.GstMasterData.paginator = this.paginator;
      this.totalRecords = this.GstMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr);
    });
  }

  editData = function (gstno) {
    this.list = false;
    this.edit = true;

    for (let i = 0; i < this.GstMasterData.filteredData.length; i++) {
      if (this.GstMasterData.filteredData[i].gstNo == gstno) {
        this.GSTData = this.GstMasterData.filteredData[i];
        if (this.GSTData.dateOfIncorporationAttachment != null) {
          this.gstNoAttachment = this.fileuploadService.getSingleFileArray(this.GSTData.gstNoAttachment);
        }
        break;
      }
    }
  }


  GeographyData: any = null;
  codeFlag: boolean = false;
  checkGst = function (statename) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    var error = "";
    if (this.GSTData.gstNo == null || this.GSTData.gstNo == "") {
      error += "GST IN is required.";
      this.dialogService.openConfirmDialog(error);
      this.GSTData = {};
      return;
    }
    if(this.GSTData.gstNo.substr(0,3) == "TMP")
    {
      this.codeFlag = false;
      return;
    }
    this.codeFlag = false;
    this.showLoading = true;
    this.geographyService.GeoById(statename, "NA", headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.GeographyData = resp;
      let stateCode: string = this.GeographyData.geographycode;
      if (this.GSTData.gstNo.substr(0, 2) != stateCode)
        this.codeFlag = true;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr);
    });
  }

  gstChange = function(){
    this.GSTData.state = null;
  }

  // Delete function
  onDelete = function (id, isDeleted) {
    debugger;
    if(isDeleted){
      this.DeleteMsg = 'Are you sure you want to activate this gst?';
    } else {
      this.DeleteMsg = 'Are you sure you want to deactivate this gst?';
    }
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.partyGstService.deleteGstById(id, headers).subscribe(resp => {
            this.showLoading = false;
            if(isDeleted){
              this.successMessage = 'Gst activated.';
            } else {
              this.successMessage = 'Gst de-activated.';
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

  //for checking if string contains uuid.
  regExpUuid = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
  containsUUID = function(s) {
    let result = false;
    if(s.length > 36)
    {
      let str = s.substring(0, 36);
      result = this.regExpUuid.test(str);
    }
    return result;
  }

  ngOnInit(): void {
    this.addGstForm = this.formBuilder.group({
      gstNo: [null, Validators.required],
      state: [null, Validators.required],
      gstNoAttachment: [null]
    });
    this.search();
    this.getAllState();
    this.baseUrl = this._global.baseUrl;
  }
  get formControls() { return this.addGstForm.controls; }
}
