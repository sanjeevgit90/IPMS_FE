import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class VendorComparisonService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveVendorComparison(body, header, flag) {
    debugger;
    if(flag=="save"){
      var url = this._global.baseAPIUrl + 'ipms/vendorcomparison';
      return this._http.post(url, body, { headers: header });
    } else if(flag=="update"){
      var url = this._global.baseAPIUrl + 'ipms/vendorcomparison/'+body.entityId;
      return this._http.put(url, body, { headers: header });
    }
  }

  getVendorComparisonById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorcomparison/'+id;
    return this._http.get(url, { headers: header });
  }

  deleteVendorComparisonById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorcomparison/'+id;
    return this._http.delete(url, { headers: header });
  }

  getAllVendorComparisons(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorcomparison/searchvendorcomparison';
    return this._http.post(url, body, { headers: header });
  }

  getAllVendorComparisonsByPo(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorcomparison/getvendorcomparisonsbypoid/'+id;
    return this._http.get(url, { headers: header });
  }
}