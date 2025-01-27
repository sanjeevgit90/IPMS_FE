import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  savePO(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/addpurchaseorder';
    return this._http.post(url, body, { headers: header });
  }

  updatePO(body, header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/' + id;
    return this._http.put(url, body, { headers: header });
  }

  getAllPO(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/getallpurchaseorders';
    return this._http.get(url, { headers: header });
  }

  getPOById(id, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/getorderbyid/' + id;
    return this._http.get(url, { headers: header });
  }

  getPurchaseOrderInfo(id, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/getpurchaseorderinfo/' + id;
    return this._http.get(url, { headers: header });
  }

  getAllPoFromView(body, header) {
    
   var url = this._global.baseAPIUrl + 'ipms/purchaseorder/getallpobyfilter';
    console.log(url);
    return this._http.post(url, body, { headers: header });
  }

  deletePurchaseOrder(id, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/deleteorderbyid/'+id;
    return this._http.get(url, { headers: header });
  }

  generateDuplicatePo(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/generateduplicateorder';
    return this._http.post(url, body, { headers: header });
  }

  verifyPo(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/updateverifyflag';
    return this._http.post(url, body, { headers: header });
  }

  sendMailToVendor(id, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/sendPoMailToVendor/'+id;
    return this._http.get(url, { headers: header });
  }

  pushPoToOpenBravo(id, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/pushPoToOpenBravo/'+id;
    return this._http.get(url, { headers: header });
  }

  cancelVerificationOfPoById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/cancelverificationofpobyid/' + id;
    return this._http.get(url, { headers: header });
  }
}
