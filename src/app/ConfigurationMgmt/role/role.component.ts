import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { RoleService } from './role.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  providers: [RoleService, AppGlobals, DialogService, SharedService]
})
export class RoleComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private roleService: RoleService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  displayedColumns: string[] = ['rolename', 'maction'];
  RoleMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showLoading: boolean = false;
  deactivate: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  FilterData = { "rolename": "" };
  PageTitle = "Role List";
  filterDiv: boolean = false;
  roleEdit: boolean = false;
  roleView: boolean = false;
  roleDelete: boolean = false;
  roleAdd: boolean = false;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.RoleMasterData.filter = filterValue.trim().toLowerCase();
  }
  addRole = function (page) { 
    this.router.navigate(['/AddRoleRights', page]);
  }
  // Delete Function
  onDelete = function (name) { 
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.roleService.deleteRoleByName(name, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search();
          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr)
          });
        }
      })
  }
  filterFunc = function () { 
    this.filterDiv = true;
  }
  cancel = function () {
    this.filterDiv = false;
    this.FilterData = {};
  }
  search = function () { 
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.roleService.roleList(headers).subscribe(resp => {
      this.RoleMasterData = new MatTableDataSource(resp);
      this.RoleMasterData.sort = this.sort;
      this.RoleMasterData.paginator = this.paginator;
      this.totalRecords = this.RoleMasterData.filteredData.length;

      this.showLoading = false;


    }, (error: any) => {
      
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  ngOnInit(): void {
    //Role Rights
    this.roleEdit = this._global.UserRights.includes("Role_Master_EDIT");
    this.roleView = this._global.UserRights.includes("Role_Master_VIEW");
    this.roleDelete = this._global.UserRights.includes("Role_Master_DELETE");
    this.roleAdd = this._global.UserRights.includes("Role_Master_ADD");

    this.search();
  }

}
