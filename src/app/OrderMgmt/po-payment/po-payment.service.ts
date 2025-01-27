import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class PoPaymentService {
  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  savePayment(body, header, flag) {
    debugger;
    if(flag=="save"){
      var url = this._global.baseAPIUrl + 'ipms/popayment';
      return this._http.post(url, body, { headers: header });
    } else if(flag=="update"){
      var url = this._global.baseAPIUrl + 'ipms/popayment/'+body.entityId;
      return this._http.put(url, body, { headers: header });
    }
    
  }

  updatePayment(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/popayment/'+id;
    return this._http.put(url, body, { headers: header });
  }

  getPaymentById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/popayment/'+id;
    return this._http.get(url, { headers: header });
  }

  deletePaymentById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/popayment/'+id;
    return this._http.delete(url, { headers: header });
  }

  getAllPayments(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/popayment/searchpopayment';
    return this._http.post(url, body, { headers: header });
  }

  getAllPaymentsByPo(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/popayment/getpopaymentsbypoid/'+id;
    return this._http.get(url, { headers: header });
  }
}