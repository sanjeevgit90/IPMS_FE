import { Component, OnInit, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-potab',
  templateUrl: './potab.component.html'
})
export class PotabComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  @Input() highlightedtab: string = "potab";
  @Input() additionalTerms: boolean = false;

  tabFlag: any = null;
  // additionalTerms:boolean = false;

  poTab = function () {
    debugger;
    if (this.tabFlag == "PO") {
      //this.router.navigate(['searchPurchaseOrder/UpdatePO',this.route.snapshot.params.id,'edit']);
      if (this.route.snapshot.params.task == null) {
        this.router.navigate(['searchPurchaseOrder/UpdatePO', this.route.snapshot.params.id, 'edit']);
      } else {
        this.router.navigate(['searchTask/UpdatePO', this.route.snapshot.params.id, 'edit', this.route.snapshot.params.task]);
      }
    } else if (this.tabFlag == "RC") {
      //this.router.navigate(['searchRateContract/editRateContract',this.route.snapshot.params.id,'edit']);
      if (this.route.snapshot.params.task == null) {
        this.router.navigate(['searchRateContract/editRateContract', this.route.snapshot.params.id, 'edit']);
      } else {
        this.router.navigate(['searchTask/editRateContract', this.route.snapshot.params.id, 'edit', this.route.snapshot.params.task]);
      }
    }
  }
  productTab = function () {
    debugger;
    if (this.tabFlag == "PO") {
      //this.router.navigate(['searchPurchaseOrder/SearchProductDetails',this.route.snapshot.params.id,'list']);
      if (this.route.snapshot.params.task == null) {
        this.router.navigate(['searchPurchaseOrder/SearchProductDetails', this.route.snapshot.params.id, 'list']);
      } else {
        this.router.navigate(['searchTask/SearchProductDetails', this.route.snapshot.params.id, 'list', this.route.snapshot.params.task]);
      }
    } else if (this.tabFlag == "RC") {
      //this.router.navigate(['searchRateContract/searchRcProductDetails',this.route.snapshot.params.id,'list']);
      if (this.route.snapshot.params.task == null) {
        this.router.navigate(['searchRateContract/searchRcProductDetails', this.route.snapshot.params.id, 'list']);
      } else {
        this.router.navigate(['searchTask/searchRcProductDetails', this.route.snapshot.params.id, 'list', this.route.snapshot.params.task]);
      }
    }
  }
  poTermsTab = function () {
    debugger;
    if (this.tabFlag == "PO") {
      if (this.route.snapshot.params.task == null) {
        this.router.navigate(['searchPurchaseOrder/searchPoTerms', this.route.snapshot.params.id, 'edit']);
      } else {
        this.router.navigate(['searchTask/searchPoTerms', this.route.snapshot.params.id, 'edit', this.route.snapshot.params.task]);
      }
    } else if (this.tabFlag == "RC") {
      if (this.route.snapshot.params.task == null) {
        this.router.navigate(['searchRateContract/searchRcTerms', this.route.snapshot.params.id, 'edit']);
      } else {
        this.router.navigate(['searchTask/searchRcTerms', this.route.snapshot.params.id, 'edit', this.route.snapshot.params.task]);
      }
    }
  }
  /* paymentScheduleTab = function () {
    debugger;
    this.router.navigate(['SearchEmployee/updateEmployee',this.route.snapshot.params.id,'edit']);
  } */

  ishighlighted = function (tabname) {
    return tabname == this.highlightedtab
  }

  ngOnInit(): void {
    debugger;
    this.tabFlag = sessionStorage.getItem("tabFlag");
    //this.additionalTerms = (sessionStorage.getItem("additionalTerms") == "false") ? false : true;
  }

}
