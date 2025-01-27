import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
//import { Template } from '@angular/compiler/src/render3/r3_ast';

@Directive({
  selector: '[appTripaddress]'
})
export class TripaddressDirective {

  @Input() lat: string;
  @Input() long: string;
  
  constructor(private elementRef: ElementRef, private _http: HttpClient) {
  }
  resultobj:any = {"payLoad":null};
  ngOnInit() {
    //debugger;
      //console.log("input-box keys  : ", this.lat, this.long);
      this._http.get("https://app.locate365.in/get-address?lat="+this.lat +"&long="+ this.long).subscribe(resp => {
      debugger;
      //console.log(resp);
      this.resultobj=resp;
      this.elementRef.nativeElement.innerText = this.resultobj.payLoad;
    });
  }

}
