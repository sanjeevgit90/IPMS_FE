import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class PoFulfilmentService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveFulfilment(body, header, flag) {
    debugger;
    if(flag=="save"){
      var url = this._global.baseAPIUrl + 'ipms/fulfilmentdelay';
      return this._http.post(url, body, { headers: header });
    } else if(flag=="update"){
      var url = this._global.baseAPIUrl + 'ipms/fulfilmentdelay/'+body.entityId;
      return this._http.put(url, body, { headers: header });
    }
  }

  getFulfilmentById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/fulfilmentdelay/'+id;
    return this._http.get(url, { headers: header });
  }

  deleteFulfilmentById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/fulfilmentdelay/'+id;
    return this._http.delete(url, { headers: header });
  }

  getAllFulfilments(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/fulfilmentdelay/searchfulfilmentdelay';
    return this._http.post(url, body, { headers: header });
  }

  getAllFulfilmentsByPo(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/fulfilmentdelay/getfulfilmentdelaysbypoid/'+id;
    return this._http.get(url, { headers: header });
  }
}
