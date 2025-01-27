import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class OEMDeliveryChallanService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveDC(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/oemdc';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/oemdc';
      return this._http.put(url , body, {headers: header});
      }
  }

  getDCList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/oemdc/dcByFilter';
    return this._http.post(url , body, {headers: header});
}

dcById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/'+id;
  return this._http.get(url, { headers: header });
}

deleteDC(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/'+id;
  return this._http.delete(url, { headers: header });
}
sendToWarhouse(header,body ) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/submitDC/'+body;
  return this._http.get(url, { headers: header });
}

processDC(body, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/processDC';
  return this._http.post(url, body, { headers: header });
}

taskById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/taskByid/'+id;
  return this._http.get(url, { headers: header });
}

receiveAssetByOEM(status,id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/receiveAsset/'+id+"/"+status;
  return this._http.get(url, { headers: header });
}
viewdcById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/viewDc/'+id;
  return this._http.get(url, { headers: header });
}
disablePrint(id, header, body) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/disable/'+id;
  return this._http.put(url, body,{ headers: header });
}

enableUpload(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/enableUpload/'+id;
  return this._http.get(url, { headers: header });
}
courierDetails(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/getCourierDetails/'+id;
  return this._http.get(url, { headers: header });
}

addCourierDetails(id, body, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/oemdc/addCourierDetails/'+id;
  return this._http.post(url, body,{ headers: header });
}
}
