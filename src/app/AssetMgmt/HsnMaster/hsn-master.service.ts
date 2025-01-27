import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class HsnMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveHSN(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/hsn';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/hsn';
   //   var url = this._global.baseAPIUrl + 'ipms/hsn/'+body.hsncode;
      return this._http.put(url , body, {headers: header});
      }
  }

  getHSNList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/hsn/hsnFilter';
    return this._http.post(url , body, {headers: header});
}

hsnByCode(hsncode, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/hsn/'+hsncode;
  return this._http.get(url, { headers: header });
}

deleteHsnById (id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/hsn/'+id;
  return this._http.delete(url, { headers: header });
}


getHsnByCodeValue(hsncode, header) {
  
  let body = {"hsncode": hsncode}
  var url = this._global.baseAPIUrl + 'ipms/hsn/getByHsnCode';
  return this._http.post(url, body, { headers: header });
}


}
