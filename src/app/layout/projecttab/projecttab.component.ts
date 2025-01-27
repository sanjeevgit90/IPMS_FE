import { Component, OnInit, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projecttab',
  templateUrl: './projecttab.component.html'
})
export class ProjecttabComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  @Input() highlightedtab: string = "projecttab";
  @Input() additionalTerms: boolean = false;
  tabFlag: any = null;
  projectDetailsTab = function () {
    debugger;
    if (this.route.snapshot.params.page == 'edit') {
      this.router.navigate(['searchProject/updateProjectDetails', this.route.snapshot.params.id, 'edit']);
    } 
    if (this.route.snapshot.params.page == 'editTask') {
      this.router.navigate(['searchProjectTask/updateProjectDetails', this.route.snapshot.params.id, 'editTask', this.route.snapshot.params.taskid]);
    }
  }

  projectConfigurationTab = function () {
    debugger;
   if (this.route.snapshot.params.page == 'edit') {
      this.router.navigate(['searchProject/projectConfiguration', this.route.snapshot.params.id, 'edit']);
    } 
    if (this.route.snapshot.params.page == 'editTask') {
      this.router.navigate(['searchProjectTask/projectConfiguration', this.route.snapshot.params.id, 'editTask', this.route.snapshot.params.taskid]);
    }
  }

  projectAttachmentTab = function () {
    this.router.navigate(['searchProject/projectAttachment', this.route.snapshot.params.id, 'edit']);
  }

  ishighlighted = function (tabname:string) {
    return tabname == this.highlightedtab
  }


  ngOnInit(): void {
    this.tabFlag = sessionStorage.getItem("tabFlag");
  }

}
