import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';
@Injectable({
  providedIn: 'root'
})
export class PoliceStationService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 
  
  savePoliceStation(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/policestation';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/policestation/'+body.policestationname;
      return this._http.put(url , body, {headers: header});
      }
  }

  getpoliceStationList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/policestation/policeByFilter';
    return this._http.post(url , body, {headers: header});
}



deletePoliceStnById(name, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/policestation/'+name;
  return this._http.delete(url, { headers: header });

}

policeStnById(name, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/policestation/'+name;
  return this._http.get(url, { headers: header });
}



}
