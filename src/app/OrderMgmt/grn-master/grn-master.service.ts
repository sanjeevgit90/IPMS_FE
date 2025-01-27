import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class GrnMasterService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  getAllGrn(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grn/getallgrn';
    return this._http.post(url, body,{ headers: header });
  }

  saveGrn(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grn/savegrndetails';
    return this._http.post(url, body,{ headers: header });
  }

  updateGrn(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grn/updategrndetails/'+id;
    return this._http.put(url, body,{ headers: header });
  }

  getGrnById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grn/getgrnbyid/'+id;
    return this._http.get(url, { headers: header });
  }

  getProductListByPo(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grn/getProductListByPo/'+id;
    return this._http.get(url, { headers: header });
  }

  onDelete(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grn/deletegrn/' + id;
    return this._http.get(url, { headers: header });
  }
}
