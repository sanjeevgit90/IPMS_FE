import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class VendorPaymentsService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  savePayments(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorinvoice';
    return this._http.post(url, body, { headers: header });
  }

  updatePayments(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorinvoice/' + id;
    return this._http.put(url, body, { headers: header });
  }

  getPaymentList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorinvoice/getallvendorpayments';
    return this._http.post(url, body,{ headers: header });
  }

  getPaymentListByPrs(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorinvoice/getallvendorpaymentsbyprs/'+id;
    return this._http.get(url, { headers: header });
  }

  getPaymentById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorinvoice/' + id;
    return this._http.get(url, { headers: header });
  }

  onDelete(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vendorinvoice/' + id;
    return this._http.delete(url, { headers: header });
  }
 
}
