import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ConstantMasterService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveConstant(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/constant';
    return this._http.post(url, body, { headers: header });
  }

  updateConstant(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/constant/' + id;
    return this._http.put(url, body, { headers: header });
  }

  getAllConstant(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/constant/getallconstants';
    return this._http.post(url, body, { headers: header });
  }

  getConstantById(header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/constant/' + id;
    return this._http.get(url, { headers: header });
  }

  deleteConstantById(header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/constant/' + id;
    return this._http.delete(url, { headers: header });
  }
}