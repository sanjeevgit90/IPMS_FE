import { Component, OnInit, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-vendortab',
  templateUrl: './vendortab.component.html'
})
export class VendortabComponent implements OnInit {

  constructor( private router: Router, private route: ActivatedRoute) { }

  @Input() highlightedtab:string="partytab";

  partyTab = function () {
    debugger;
    this.router.navigate(['searchParty/UpdateParty',this.route.snapshot.params.id,'edit']);
  }
  addressTab = function () {
    debugger;
    this.router.navigate(['searchParty/SearchPartyAddress',this.route.snapshot.params.id,'list']);
  }
  gstTab = function () {
    debugger;
    this.router.navigate(['searchParty/searchGst',this.route.snapshot.params.id,'list']);
  }

  ishighlighted=function(tabname){
    return tabname==this.highlightedtab
  }

  ngOnInit(): void {
  }

}
