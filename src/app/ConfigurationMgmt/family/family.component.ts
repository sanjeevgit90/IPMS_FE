import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { FamilyService } from './family.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}


@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  providers: [FamilyService, AppGlobals, DialogService, SharedService]
})
export class FamilyComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private familyService: FamilyService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }
  //  displayedColumns: string[] = ['memberName', 'memberContact', 'dob', 'relationship', 'action'];
  displayedColumns = ['memberName', 'memberContact', 'dob', 'relationship', 'action'];

  FamilyMasterData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.FamilyMasterData.filter = filterValue;
  }

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;

  //Role Rights
  familyEdit: boolean = false;
  familyDelete: boolean = false;
  familyAdd: boolean = false;

  PageTitle = "Family";
  add = true;
  edit = false;
  list = true;

  FamilyData = {
    "memberName": "", "memberContact": "", "dob": "", "relationship": ""
  };

  addFamilyForm: FormGroup;
  isSubmitted = false;


  cancel = function () {
    this.list = true;
    this.edit = false;
    //this.addFamilyForm.reset()
    this.formDirective.resetForm();
    this.isSubmitted = false;
    this.PageTitle = "Family";
  }

  // Add / update function
  addFamily = function (flag) {
    this.isSubmitted = true;
    if (this.addFamilyForm.invalid) {
      return;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };

    this.showLoading = true;
    this.FamilyData.dob = this.FamilyData.dob.getTime();
    this.familyService.saveFamily(this.FamilyData, headers, flag).subscribe(resp => {
      this.showLoading = false;
      this.successMessage = "Family " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          //  this.addFamilyForm.reset();
          this.formDirective.resetForm();
          this.isSubmitted = false;
          this.search();
          if (flag == "update") {
            this.edit = false;
            this.list = true;
            this.PageTitle = "Family";
          }
        })

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // Delete Function
  onDelete = function (id) {
    this.DeleteMsg = 'Are you sure you want to Delete this user?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.familyService.deleteFamilyById(id, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.formDirective.resetForm();
            this.dialogService.openConfirmDialog(this.successMessage);
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
    this.familyService.getFamilyList(headers).subscribe(resp => {
      this.FamilyMasterData = new MatTableDataSource(resp);
      this.FamilyMasterData.sort = this.sort;
      this.FamilyMasterData.paginator = this.paginator;
      this.totalRecords = this.FamilyMasterData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  editData = function (entityId) {
    this.list = false;
    this.edit = true;
    for (let i = 0; i < this.FamilyMasterData.filteredData.length; i++) {
      if (this.FamilyMasterData.filteredData[i].entityId == entityId) {
        this.FamilyData = this.FamilyMasterData.filteredData[i];
        this.FamilyData.dob = (new Date(this.FamilyData.dob));
        break;
      }
    }

  }

  // Get data by id
  editon = function (name) {
    this.list = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.PageTitle = "Update Family";
    this.familyService.familyById(name, headers).subscribe(resp => {
      this.showLoading = false;
      this.FamilyData = resp;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // ngAfterViewInit() {
  //   this.FamilyMasterData.paginator = this.paginator;
  //   this.FamilyMasterData.sort = this.sort;
  // }


  ngOnInit(): void {

    //Role Rights
    this.familyEdit = this._global.UserRights.includes("FamilyMembers_EDIT");
    this.familyDelete = this._global.UserRights.includes("FamilyMembers_DELETE");
    this.familyAdd = this._global.UserRights.includes("FamilyMembers_ADD");

    this.addFamilyForm = this.formBuilder.group({
      memberName: ['', Validators.required],
      memberContact: ['', Validators.required],
      dob: ['', Validators.required],
      relationship: ['', Validators.required]
    });
    this.search();

    //  const users: UserData[] = [];
    //  var users1=[];
    //  for (let i = 1; i <= 100; i++) { /*users.push(createNewUser(i));*/

    //    users1.push({"cnt" : i,"name":"batr"+i});

    //   }
    //  this.dataSource = new MatTableDataSource(users1);

  }
  get formControls() {
    return this.addFamilyForm.controls;
  }

}
