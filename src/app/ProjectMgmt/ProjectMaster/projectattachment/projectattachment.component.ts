import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-projectattachment',
    templateUrl: './projectattachment.component.html',
    standalone: false
})
export class ProjectattachmentComponent implements OnInit {

  constructor() { }
  showLoading: boolean = false;
  PageTitle = "Project Attachment";


  ngOnInit(): void {
  }

}
