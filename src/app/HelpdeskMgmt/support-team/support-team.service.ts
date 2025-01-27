import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class SupportTeamService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveSupportTeam(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/supportteam';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/supportteam/'+body.employeeId;
      return this._http.put(url , body, {headers: header});
      }
  }


  getSupportTeamList(body,header ) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/supportteam/supportTeamByFilter';
  return this._http.post(url , body, {headers: header});
 
}

 

getSupportTeamByEmployeeId(employeeId, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/supportteam/'+employeeId;
  return this._http.get(url, { headers: header });
}

deleteSupportTeam (employeeId, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/supportteam/'+employeeId;
  return this._http.delete(url, { headers: header });
}
}




