import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class RateContractService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveRC(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/addratecontract';
    return this._http.post(url, body, { headers: header });
  }

  updateRC(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/' + id;
    return this._http.put(url, body, { headers: header });
  }

  getAllRC(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/getallratecontracts';
    return this._http.get(url, { headers: header });
  }

  getRCById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/getorderbyid/' + id;
    return this._http.get(url, { headers: header });
  }

  getRateContractInfo(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/getratecontractinfo/' + id;
    return this._http.get(url, { headers: header });
  }

  getAllRcFromView(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/getallrcbyfilter';
    return this._http.post(url, body, { headers: header });
  }

  generateDuplicateRc(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/generateduplicateorder';
    return this._http.post(url, body, { headers: header });
  }

  deleteRateContract(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/deleteorderbyid/'+id;
    return this._http.get(url, { headers: header });
  }
}
