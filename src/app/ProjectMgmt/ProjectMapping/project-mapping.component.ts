import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { ProjectMappingService } from './project-mapping.service';
import { SharedService } from '../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-project-mapping',
  templateUrl: './project-mapping.component.html',
  providers: [ProjectMappingService, AppGlobals, DialogService, SharedService]
})
export class ProjectMappingComponent implements OnInit {
  result: boolean = false;
  constructor(private formBuilder: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private projectMappingService: ProjectMappingService,
    private _global: AppGlobals, 
    private dialogService: DialogService, 
    private sharedService: SharedService
  ) { }

 
  displayedColumns: string[] = ['projectname', 'orgname', 'levelname' ,'action'];
  ProjectMappingData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  showLoading: boolean = false;
  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  matSelectDuration = this._global.matSelectDurationTime;
  PageTitle = "Project Mapping";
  filterDiv: boolean = false;
  add = true;
  edit = false;
  list = true;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectMappingData.filter = filterValue.trim().toLowerCase();
  }
  ProjectMappingModel = {
    "projectid": null, "orgid": null, "workflowlevel":null};

    compareOrg(o1: any, o2: any): boolean {
      return o1 == o2.entityId;
    }

  FilterData = {
    "projectname": null, "orgname": null,
  };

  ProjectMappingForm: FormGroup;
  isSubmitted = false;
  filterFunc = function () {
    this.filterDiv = true;
    this.formDirective.resetForm();
  }

  addProjectMapping = function () {
    this.router.navigate(['/addProjectMapping', this.route.snapshot.params.id]);
  }

  organizationsList: any = [];
  projectList: any = [];
  levelList: any = [];

  orgIdList: any = [];
 
  cancel = function () {
    this.list = true;
    this.edit = false;
    this.PageTitle = "Project Mapping";
    this.enabledField();
    this.formDirective.resetForm();
    this.isSubmitted = false;
  }
 
  // Search function
  search = function (id) {
    debugger;

    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    
    this.projectMappingService.getProjectLevelList(this.FilterData, headers, id).subscribe(resp => {
      debugger;
      this.ProjectMappingData = new MatTableDataSource(resp.content);
      this.ProjectMappingData.sort = this.sort;
      this.ProjectMappingData.paginator = this.paginator;
      this.totalRecords = this.ProjectMappingData.filteredData.length;
      this.history = false;
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  

  // Delete Function
  onDelete = function (id) {
    this.DeleteMsg = 'Are you sure you want to Delete this record?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.projectMappingService.deleteById(id, headers).subscribe(resp => {
            this.successMessage = 'Deleted Successfully';
            this.showLoading = false;
            this.formDirective.resetForm();
            this.isSubmitted = false;
            this.dialogService.openConfirmDialog(this.successMessage)
            this.search(this.route.snapshot.params.id);
          }, (error: any) => {
            this.showLoading = false;
            const errStr = error.error.errorDetail[0];
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      })
  }
  
  
  ngOnInit(): void {
    //Fromgroup collection
  
    this.search(this.route.snapshot.params.id);
  }
 
}