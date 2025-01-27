import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class TicketReportService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }



  ticketAgeingReport(header,body) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketReport/ticketAgingReport';
    return this._http.post(url, body,{ headers: header });
  }
  ticketEscalationReport(header, body) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketReport/getEscalationReport/';
    return this._http.post(url, body,{ headers: header });
  }
  ticketMisReport(header, body) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketReport/getTicketMisReport?page='+1+'&size='+5000;
    return this._http.post(url, body,{ headers: header });
  }
  incidentReport(header, body) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketReport/getIncidentReportByFilter?page='+1+'&size='+5000;
    return this._http.post(url, body,{ headers: header });
  }
  downloadIncident(header, body) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketReport/getIncidentReportByFilter?page='+1+'&size='+ 15000;
    return this._http.post(url, body,{ headers: header });
  }
  orphanTrips(header,body) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketReport/getAllOrphanTickets';
    return this._http.post(url, body,{ headers: header });
  }

  ticketSLAReport(header,body) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketReport/missedSLAResolutionReport';
    return this._http.post(url, body,{ headers: header });
  }

}


