import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveInvoice(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/invoice';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/invoice';
      return this._http.put(url , body, {headers: header});
      }
  }

getInvoiceList(id, header, body) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/invoice/invoiceByFilter/' + id;
    return this._http.post(url , body, {headers: header});
}

invoiceById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/invoice/'+id;
  return this._http.get(url, { headers: header });
}

deleteInvoice(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/invoice/'+id;
  return this._http.delete(url, { headers: header });
}
submitForApproval(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/invoice/submitInvoice/'+id;
  return this._http.get(url, { headers: header });
}
}
