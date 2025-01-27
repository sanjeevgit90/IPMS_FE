import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AddressMasterService } from '../address-master/address-master.service';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-address-master',
  templateUrl: './address-master.component.html',
  providers: [AddressMasterService, AppGlobals, DialogService, SharedService]
})
export class AddressMasterComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private addressMasterService: AddressMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['addressType', 'address1', 'landmark', 'cityName', 'stateName', 'districtName', 'country', 'pinCode', 'action'];
  AddressMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Address";
  addAddress = function () {

    //this.router.navigate(['/AddPartyAddress']);
    this.router.navigate(['searchParty/AddPartyAddress', this.route.snapshot.params.id, 'add']);
  }

  editAddress = function (id) {

    //this.router.navigate(['/AddPartyAddress']);
    this.router.navigate(['searchParty/UpdatePartyAddress', id, 'edit']);
  }


  cancel = function () {

    this.filterDiv = false;
    this.FilterData = {};
  }

  search = function () {


    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.addressMasterService.getAllAddressOfParty(headers, this.route.snapshot.params.id).subscribe(resp => {

      this.AddressMasterData = new MatTableDataSource(resp);
      this.AddressMasterData.sort = this.sort;
      this.AddressMasterData.paginator = this.paginator;
      this.totalRecords = this.AddressMasterData.filteredData.length;
      this.showLoading = false;


    }, (error: any) => {

      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Delete function
  onDelete = function (id, isDeleted) {
    debugger;
    if(isDeleted){
      this.DeleteMsg = 'Are you sure you want to activate this address?';
    } else {
      this.DeleteMsg = 'Are you sure you want to deactivate this address?';
    }
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.addressMasterService.deleteAddressById(id, headers).subscribe(resp => {
            this.showLoading = false;
            if(isDeleted){
              this.successMessage = 'Address activated.';
            } else {
              this.successMessage = 'Address de-activated.';
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
    this.search();
  }

}
