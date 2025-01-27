import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class BillingScheduleService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveSchedule(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/billingschedule';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/billingschedule';
      return this._http.put(url , body, {headers: header});
      }
  }

scheduleById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/billingschedule/'+ id.projectid+'/'+id.milestoneno;
  return this._http.get(url, { headers: header });
}

deleteSchedule(id, project, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/billingschedule/'+ project+'/'+id;
  return this._http.delete(url, { headers: header });
}

getScheduleList( header, project, body) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/billingschedule/getScheduleList/'+project;
  return this._http.post(url, body,{ headers: header });
}

}
