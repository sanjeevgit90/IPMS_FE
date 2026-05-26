import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    standalone: false
})
export class LoaderComponent implements OnInit {

  constructor() { }
  loading: boolean = false;

  ngOnInit(): void {
  }

}
