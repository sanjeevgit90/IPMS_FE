import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { DepartmentService } from './department.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  providers: [DepartmentService, AppGlobals, DialogService, SharedService]

})
export class DepartmentComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private departmentService: DepartmentService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  displayedColumns: string[] = ['departmentName', 'departmentCode', 'action'];
  DepartmentMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Department Master";
  add = true;
  edit = false;
  list = true;
    
  departmentEdit: boolean = false;
  departmentAdd: boolean = false;
  departmentDelete: boolean = false;

  DepartmentData = {
    "departmentName": "", "departmentCode": ""
  };
  addDepartmentForm: FormGroup;
  isSubmitted = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DepartmentMasterData.filter = filterValue.trim().toLowerCase();
  }


  cancel = function () {
    this.list = true;
    this.edit = false;
    this.addDepartmentForm.reset();
    this.PageTitle = "Department Master";
  }

  // Add / update function
  addDepartment = function (flag) {
    
    this.isSubmitted = true;
    if (this.addDepartmentForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.departmentService.saveDepartment(this.DepartmentData, headers, flag).subscribe(resp => {
      
      this.showLoading = false;
      this.successMessage = "Department " + flag + " successfully.";
      this.search();

      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.DepartmentData = {};
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Add Department"
          }
        })

    }, (error: any) => {
      
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Delete Function
  onDelete = function (name) {
    
    this.DeleteMsg = 'Are you sure you want to Deactivate this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.departmentService.deleteDepartmentByName(name, headers).subscribe(resp => {
            this.successMessage = 'Deactivated Successfully';
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


  // Search function
  search = function () {
    
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.departmentService.getDepartmentList(headers).subscribe(resp => {
      

      this.DepartmentMasterData = new MatTableDataSource(resp);
      this.DepartmentMasterData.sort = this.sort;
      this.DepartmentMasterData.paginator = this.paginator;
      this.totalRecords = this.DepartmentMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Get data by id
  editon = function (name) {
    
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    var departmentName = name;
    this.PageTitle = "Update Department";
    this.departmentService.departmentByName(departmentName, headers).subscribe(resp => {
      
      this.showLoading = false;
      this.DepartmentData = resp;
    }, (error: any) => {
      
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }



  ngOnInit(): void {

    //Role Rights
    this.departmentEdit = this._global.UserRights.includes("Department_Master_EDIT");
    //this.departmentView = this._global.UserRights.includes("Department_Master_VIEW");
    this.departmentDelete = this._global.UserRights.includes("Department_Master_DELETE");
    this.departmentAdd = this._global.UserRights.includes("Department_Master_ADD");

    this.addDepartmentForm = this.formBuilder.group({
      departmentName: ['', Validators.required],
      departmentCode: ['', Validators.required]
    });
    this.search();
  }
  get formControls() { return this.addDepartmentForm.controls; }
}
