import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { SharedService } from '../../service/shared.service';
import { PartyMasterService } from '../../VendorMgmt/party-master/party-master.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-party-master',
  templateUrl: './party-master.component.html',
  providers: [PartyMasterService, AppGlobals, DialogService, SharedService]
})
export class PartyMasterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private partyMasterService: PartyMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ["partyNo", "partyName", "contactPersonName", "mobileNo", "natureOfServiceProviding", "action"];
  PartyListData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  partyAdd: boolean = false;
  partyEdit: boolean = false;
  partyView: boolean = false;
  partyDelete: boolean = false;

  FilterData = { "partyNo": null, "partyName": null, "contactPersonName": null, "mobileNo": null, "natureOfServiceProviding": null };
  //FilterData = {};

  PageTitle = "Party Master";
  filterDiv: boolean = false;
  addParty = function () {
    
    this.router.navigate(['/AddParty']);
  }

  filterFunc = function () {
    
    this.filterDiv = true;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.PartyListData.filter = filterValue.trim().toLowerCase();
  }

  cancel = function () {
    
    this.filterDiv = false;
    this.FilterData = {};
  }

  // Search function
  search = function () {
    
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;

    this.partyMasterService.getAllParty(this.FilterData, headers).subscribe(resp => {
      
      this.PartyListData = new MatTableDataSource(resp);
      this.PartyListData.sort = this.sort;
      this.PartyListData.paginator = this.paginator;
      this.totalRecords = this.PartyListData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Delete function
  deleteParty = function (id) {
    
    this.DeleteMsg = 'Are you sure you want to deactivate this party?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.partyMasterService.deletePartyById(id, headers).subscribe(resp => {
            this.successMessage = 'Deactivated Successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr)
          });
        }

      })
  }

  ngOnInit(): void {
    //Role Rights
    this.partyAdd = this._global.UserRights.includes("Party_Master_ADD");
    this.partyEdit = this._global.UserRights.includes("Party_Master_EDIT");
    this.partyView = this._global.UserRights.includes("Party_Master_VIEW");
    this.partyDelete = this._global.UserRights.includes("Party_Master_DELETE");

    this.search();
  }

}