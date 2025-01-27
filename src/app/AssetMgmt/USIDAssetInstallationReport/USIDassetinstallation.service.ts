import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class USIDInstallationReportService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveReport(body, header, flag) {
    if (flag == 'generate') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/locationinstallationreport';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/locationinstallationreport';
      return this._http.put(url , body, {headers: header});
      }
  }

  getReportList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/locationinstallationreport/reportByFilter';
    return this._http.post(url , body, {headers: header});
}

reportById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/locationinstallationreport/'+id;
  return this._http.get(url, { headers: header });
}

deleteReport(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/locationinstallationreport/'+id;
  return this._http.delete(url, { headers: header });
}
getLocationList(id,header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/location/getDistinctAssestLocations/'+id;
  return this._http.get(url, { headers: header });
}

getLocationData(id,header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/location?locationid='+ id;
  return this._http.get(url, { headers: header });
}

getAssetDataFromLocation(city, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/locationinstallationreport/locationinstallation?locationid='+city;
  return this._http.get(url, { headers: header });
}
disablePrint(id, header, body) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/locationinstallationreport/disable/'+id;
  return this._http.put(url, body,{ headers: header });
}

enableUpload(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/locationinstallationreport/enableUpload/'+id;
  return this._http.get(url, { headers: header });
}
}
