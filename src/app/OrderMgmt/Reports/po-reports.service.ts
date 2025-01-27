import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class PoReportsService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  getPoMonthlyReport(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/popayment/getmonthwisepaymentreport';
    return this._http.post(url, body, { headers: header });
  }

  getPoPendingReport(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/popayment/getpendingpaymentreport';
    return this._http.post(url, body, { headers: header });
  }
  getPrsReport(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prs/getprsreport';
    return this._http.post(url, body, { headers: header });
  }

  getPoCriteriaReport(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/purchaseorderreports/getCatWiseReport';
    return this._http.post(url, body, { headers: header });
  }

  getPowiseProductReport(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/purchaseorderreports/getpowiseproductreport';
    return this._http.post(url, body, { headers: header });
  }
  
  getApprovalCount(projectId, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/purchaseorderreports/getApprovalCount/'+projectId;
    return this._http.get(url, { headers: header });
  }

  getAllApprovalReport(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/purchaseorderreports/getAllApprovalReport';
    return this._http.post(url, body, { headers: header });
  }

  getProjectVendorWiseReport(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/purchaseorderreports/getProjectVendorWiseReport';
    return this._http.post(url, body, { headers: header });
  }

  getPoFulfilmentReport(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/purchaseorderreports/getPoFulfilmentReport';
    return this._http.post(url, body, { headers: header });
  }

  getGrnReport(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grn/getgrnreport';
    return this._http.post(url, body, { headers: header });
  }
}
