import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class InterDistrictDCService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveDC(body, header, flag) {
    if (flag == 'save') {
    
    var url = this._global.baseAPIUrl + 'ipms/interdistrictdc';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/interdistrictdc';
      return this._http.put(url , body, {headers: header});
      }
  }

  getDCList(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/dcByFilter';
    return this._http.post(url , body, {headers: header});
}

dcById(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/'+id;
  return this._http.get(url, { headers: header });
}

deleteDC(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/'+id;
  return this._http.delete(url, { headers: header });
}

sendToWarhouse(header,body ) {
  
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/submitDC/'+body;
  return this._http.get(url, { headers: header });
}

processDC(body, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/processDC';
  return this._http.post(url, body, { headers: header });
}

taskById(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/taskByid/'+id;
  return this._http.get(url, { headers: header });
}
viewdcById(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/viewDc/'+id;
  return this._http.get(url, { headers: header });
}
disablePrint(id, header, body) {
  
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/disable/'+id;
  return this._http.put(url, body,{ headers: header });
}

enableUpload(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/enableUpload/'+id;
  return this._http.get(url, { headers: header });
}

courierDetails(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/getCourierDetails/'+id;
  return this._http.get(url, { headers: header });
}

addCourierDetails(id, body, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/interdistrictdc/addCourierDetails/'+id;
  return this._http.post(url, body,{ headers: header });
}
}
