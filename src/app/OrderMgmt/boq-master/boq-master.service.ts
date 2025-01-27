import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class BoqMasterService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveBoq(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/boq';
    return this._http.post(url, body, { headers: header });
  }

  updateBoq(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/boq/editBOQ/' + id;
    return this._http.put(url, body, { headers: header });
  }

  getAllBoq(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/boq/getAllBOQs';
    return this._http.post(url, body,{ headers: header });
  }

  getBoqById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/boq/' + id;
    return this._http.get(url, { headers: header });
  }

  deleteConstantById(header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/boq/' + id;
    return this._http.delete(url, { headers: header });
  }
}
