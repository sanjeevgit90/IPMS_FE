import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class BillingReportService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

invoiceAgingReport( header, body) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/billingreports/invoiceAgingReport';
  return this._http.post(url, body,{ headers: header });
}
billingComparsionReport( header, body) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/billingreports/billingComparsionReport';
  return this._http.post(url, body,{ headers: header });
}
  
monthlyOfBillingReport(year, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/billingreports/monthOfBillingReport/'+ year;
  return this._http.get(url, { headers: header });
}

monthlyOfCollectionReport(year, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/billingreports/monthlyOfCollectionReport/'+ year;
  return this._http.get(url, { headers: header });
}

monthlyBillingReport(month, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/billingreports/monthlyBillingReport/'+ month;
  return this._http.get(url, { headers: header });
}
monthlyCollectionReport(month, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/billingreports/monthlyCollectionReport/'+ month;
  return this._http.get(url, { headers: header });
}

}
