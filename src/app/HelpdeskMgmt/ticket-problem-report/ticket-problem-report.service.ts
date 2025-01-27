import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class TicketProblemReportService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveProblemReport(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketproblemreport';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/ticketproblemreport';
      return this._http.put(url , body, {headers: header});
      }
  }

  getproblemReportList(header,body) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketproblemreport/ticketProblemByFilter';
    return this._http.post(url , body, {headers: header});
}

 

problemReportById(problemReportValue, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ticketproblemreport/'+problemReportValue;
  return this._http.get(url, { headers: header });
}

deleteProblemData (problemReport, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ticketproblemreport/'+problemReport;
  return this._http.delete(url, { headers: header });
}

}

