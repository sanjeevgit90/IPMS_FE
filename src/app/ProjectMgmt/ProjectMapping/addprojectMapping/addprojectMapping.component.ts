import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { ProjectMappingService} from '../project-mapping.service';
import { SharedService } from '../../../service/shared.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-addprojectMapping',
  templateUrl: './addprojectMapping.component.html',
  providers: [ProjectMappingService, AppGlobals, DialogService, SharedService]
})
export class AddProjectMappingComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private projectMappingService: ProjectMappingService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;
  matSelectDuration = this._global.matSelectDurationTime;

  PageTitle = "Add Project Mapping";
  add = true;
  edit = false;
  list = true;
  ProjectMappingModel = {
    "projectid": null, "orgid": null, "workflowlevel":null};

    compareOrg(o1: any, o2: any): boolean {
      return o1 == o2.entityId;
    }
 
    ProjectMappingForm: FormGroup;
    isSubmitted = false;
    filterFunc = function () {
      this.filterDiv = true;
      this.formDirective.resetForm();
    }
  
    displayedColumns1: string[] = ['selectionvalue'];
    OrganizationData: MatTableDataSource<any>;
   
    ProjectData: MatTableDataSource<any>;
    displayedColumns2: string[] = ['checkbox','selectionvalue'];
   
    LevelData: MatTableDataSource<any>;
    displayedColumns3: string[] = ['checkbox','selectionvalue'];
  
    orgIdList: any = [];
    orgRecord:any;
    projectRecord: any;
    levelRecord:any;

    projectFlag:boolean = true;
    levelFlag:boolean = true;

    applyFilterOrg(event: Event) {
      debugger;
     const filterValue = (event.target as HTMLInputElement).value;
     this.OrganizationData.filter = filterValue.trim().toLowerCase();
   }

   applyFilterProject(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectData.filter = filterValue.trim().toLowerCase();
  }

    applyFilterLevel(event: Event) {
       debugger;
       const filterValue = (event.target as HTMLInputElement).value;
       this.LevelData.filter = filterValue.trim().toLowerCase();
  }

  // Add / update function
  addProjectMapping = function () {
    this.isSubmitted = true;
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };

      if (this.projectWorkFlowLevel.length == 0) {
        this.dialogService.openConfirmDialog("Please select atleast one project and level ");
        return;
      }
     
    this.showLoading = true;
    this.projectMappingService.addLevels(this.projectWorkFlowLevel, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Project mapping(s) saved successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.router.navigate(['/projectMapping', this.route.snapshot.params.id]);
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  
   // Add / update function
   addAllProjectMapping = function () {
    this.isSubmitted = true;
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };

        if (this.islevelSelected == false) {
        this.dialogService.openConfirmDialog("Please select atleast one level ");
        return;
        }
        var userid = this.route.snapshot.params.id;
    this.showLoading = true;
    this.projectMappingService.addAllLevels(this.org, userid, this.level, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Project mapping(s) saved successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.router.navigate(['/projectMapping', this.route.snapshot.params.id]);
        })
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  
   // projectList
   getAllProject = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.projectMappingService.getprojectList(id,headers).subscribe(resp => {
      debugger;
      this.ProjectData = new MatTableDataSource(resp);
      this.projectRecord = this.ProjectData.filteredData.length;
      if (this.projectRecord > 0){
        this.projectFlag = false;
      }
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

   // organizationsList
   getAllOrganizations = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getOrganizationsList(headers).subscribe(resp => {
      debugger;
      this.OrganizationData = new MatTableDataSource(resp);
      this.orgRecord = this.OrganizationData.filteredData.length;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // levelList
  getAllLevel = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
     var project = id;
     var user = this.route.snapshot.params.id;
    this.projectMappingService.getAllLevels(project, headers, user).subscribe(resp => {
      debugger;
      this.LevelData = new MatTableDataSource(resp);
      this.levelRecord = this.LevelData.filteredData.length;
      if (this.levelRecord > 0){
        this.levelFlag = false;
      }

      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });

  }

  org:any;
project:any;
  SelectORG = function (items) {
    debugger;
    this.org = items;
      this.getAllProject(items);
  }
  projectName:string;
  islevelSelected :boolean;
  displayList:any=[];
  SelectProjects = function (item, selected) {        
    debugger;
    if(selected)
      {
        if ( this.islevelSelected == false)
           {
             this.dialogService.openConfirmDialog("Please select level for Previous Project");
             selected = false;
             return;
           }
           this.islevelSelected = false;
           this.project=item.selectionid;
           this.projectName = item.selectionvalue;
           this.getAllLevel(item.selectionid);
      }
    else
    {
       this.projectWorkFlowLevel.pop(item.selectionid);
       this.displayList.pop(item.selectionvalue);
       this.islevelSelected = false;
    }
  }

  isAllSelected:boolean= false;
  SelectAllProjects = function (selected) {        
    debugger;
    if ( selected == false) {
      this.isAllSelected = false;
      this.islevelSelected = false;
      this.LevelData = new MatTableDataSource(); 
      for(var i=0; i < this.ProjectData.length; i++) {
           this.ProjectData[i].selected = false;
      }
 } else
 {
  this.isAllSelected = true;
  this.islevelSelected = false;
  this.getAllLevels();
  for(var i=0; i < this.ProjectData.length; i++) {
       this.ProjectData[i].selected = true;
 }
}
}

getAllLevels = function (id) {
  debugger;
  const headers = { "Authorization": sessionStorage.getItem("token") };
  this.showLoading = true;
  this.projectMappingService.getAllLevelsByOrg(this.org, headers).subscribe(resp => {
    debugger;
    this.LevelData = new MatTableDataSource(resp);
    this.levelRecord = this.LevelData.filteredData.length;
    if (this.levelRecord > 0){
      this.levelFlag = false;
    }
    this.showLoading = false;
  }, (error: any) => {
    debugger;
    this.showLoading = false;
    const errStr = error.message;
    this.dialogService.openConfirmDialog(errStr)
  });

}

  projectWorkFlowLevel:any= [];
  level:String;
  isDisabled: boolean = false;
  SelectLevels = function (item, selected) {
    debugger;
    
    if  (this.isAllSelected == true)
    {
      this.level = item;
      this.isDisabled = true;
      this.islevelSelected = true;
    }
    else
    {
      if(selected)
      {
        this.item1 = {};
        this.item1.orgid= this.org;
        this.item1.projectid = this.project;
        this.item1.userid = this.route.snapshot.params.id;
        this.item1.workflowlevel = item;
        this.projectWorkFlowLevel.push(this.item1);
  
        this.item2={};
        this.item2.project = this.projectName;
        this.item2.level = item;
        this.displayList.push(this.item2);
  
        this.islevelSelected = true;
      }
      else{
        this.projectWorkFlowLevel.pop(item);
        this.displayList.pop(item);
        this.islevelSelected = false;
      }
    }
   
  }



  back = function () {
    debugger;
      this.router.navigate(['/projectMapping', this.route.snapshot.params.id]);
   
  }

  
  ngOnInit(): void {
    //Fromgroup collection
    this.getAllOrganizations();
    //Assign Filter
   
  }
  get formControls() { return this.ProjectMappingForm.controls; }
}


