import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class CityInstallationReportService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveReport(body, header, flag) {
    if (flag == 'generate') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ciyinstallationreport';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/ciyinstallationreport';
      return this._http.put(url , body, {headers: header});
      }
  }

  getReportList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ciyinstallationreport/reportByFilter';
    return this._http.post(url , body, {headers: header});
}

reportById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ciyinstallationreport/'+id;
  return this._http.get(url, { headers: header });
}

deleteReport(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ciyinstallationreport/'+id;
  return this._http.delete(url, { headers: header });
}
getCityList(header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/city/getDistinctAssetCity';
  return this._http.get(url, { headers: header });
}

getAssetDataFromCity(city, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ciyinstallationreport/cityinstallation/'+city;
  return this._http.get(url, { headers: header });
}
disablePrint(id, header, body) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ciyinstallationreport/disable/'+id;
  return this._http.put(url, body,{ headers: header });
}

enableUpload(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ciyinstallationreport/enableUpload/'+id;
  return this._http.get(url, { headers: header });
}

}
