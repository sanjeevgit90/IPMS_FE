import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class GrnTaskService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  getAllPendingTask(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grntask/getallgrntasks';
    return this._http.post(url, body, { headers: header });
  }

  getAllHistoryTask(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grntask/getallgrnhistorytasks';
    return this._http.post(url, body, { headers: header });
  }

  getTaskById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grntask/getgnrtaskbyid/'+id;
    return this._http.get(url, { headers: header });
  }

  saveTask(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grntask/sendGrnForApproval/'+id;
    return this._http.get(url, { headers: header });
  }

  processTask(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grntask/processworkflow';
    return this._http.post(url, body, { headers: header });
  }

  getWorkflowHistory(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/grntask/getworkflowhistorybyid/'+id;
    return this._http.get(url, { headers: header });
  }
}