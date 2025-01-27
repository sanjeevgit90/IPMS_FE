import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class PRSService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  savePrs(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prs/addprs';
    return this._http.post(url, body, { headers: header });
  }

  updatePrs(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prs/updateprs/' + id;
    return this._http.put(url, body, { headers: header });
  }

  getPrsList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prs/getallprsbyfilter';
    return this._http.post(url, body,{ headers: header });
  }

  getPrsById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prs/getprsbyid/' + id;
    return this._http.get(url, { headers: header });
  }

  getPrsView(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prs/getPrsView/' + id;
    return this._http.get(url, { headers: header });
  }

  onDelete(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prs/deactiveprsbyid/' + id;
    return this._http.get(url, { headers: header });
  }
  submitForApproval(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prstask/sendPrsForApproval/' + id;
    return this._http.get(url, { headers: header });
  }
  getHistoryDataById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prstask/getprstaskhistorybyid/'+id;
    return this._http.get(url, { headers: header });
  }
  
}
