import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class DeliveryChallanService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveDC(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/dc';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/dc';
      return this._http.put(url , body, {headers: header});
      }
  }

  getDCList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/dc/dcByFilter';
    return this._http.post(url , body, {headers: header});
}

dcById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/dc/'+id;
  return this._http.get(url, { headers: header });
}

deleteDC(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/dc/'+id;
  return this._http.delete(url, { headers: header });
}
viewdcById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/dc/viewDc/'+id;
  return this._http.get(url, { headers: header });
}
disablePrint(id, header, body) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/dc/disable/'+id;
  return this._http.put(url, body,{ headers: header });
}

enableUpload(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/dc/enableUpload/'+id;
  return this._http.get(url, { headers: header });
}

courierDetails(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/dc/getCourierDetails/'+id;
  return this._http.get(url, { headers: header });
}

addCourierDetails(id, body, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/dc/addCourierDetails/'+id;
  return this._http.post(url, body,{ headers: header });
}

}
