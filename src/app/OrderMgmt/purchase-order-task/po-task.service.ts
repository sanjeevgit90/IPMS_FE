import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class PoTaskService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  getAllPendingTask(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/potask/getpendingpotasksfromview';
    return this._http.post(url, body, { headers: header });
  }

  getAllHistoryTask(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/potask/gethistorypotasksfromview';
    return this._http.post(url, body, { headers: header });
  }

  getTaskById(id, header, poRcFlag) {
    debugger;
    //var url = this._global.baseAPIUrl + 'ipms/potask/getpotaskbyid/'+id;
    if(poRcFlag == "PO" || poRcFlag == "AMEND"){
      var url = this._global.baseAPIUrl + 'ipms/potask/getpotaskbyid/'+id;
    } else if(poRcFlag == "RC"){
      var url = this._global.baseAPIUrl + 'ipms/rctask/getrctaskbyid/'+id;
    }
    return this._http.get(url, { headers: header });
  }

  saveTask(body, header) {
    debugger;
    /*if(body.workflowType == "TYPE A"){
      var url = this._global.baseAPIUrl + 'ipms/potask/sendPoForApprovalTypeA';
    } else if(body.workflowType == "TYPE B"){
      var url = this._global.baseAPIUrl + 'ipms/potask/sendPoForApprovalTypeB';
    } else if(body.workflowType == "AMEND"){
      var url = this._global.baseAPIUrl + 'ipms/potask/sendPoForAmendment/'+body.poId;
    }*/

    if(body.workflowType == "AMEND"){
      var url = this._global.baseAPIUrl + 'ipms/potask/sendPoForAmendment';
    } else {
      var url = this._global.baseAPIUrl + 'ipms/potask/sendPoForApproval';
    }
    return this._http.post(url, body, { headers: header });
  }

  processTask(body, header) {
    debugger;
    //var url = this._global.baseAPIUrl + 'ipms/potask/processworkflow';
    if(body.poRcFlag == "PO" || body.poRcFlag == "AMEND"){
      var url = this._global.baseAPIUrl + 'ipms/potask/processworkflow';
    } else if(body.poRcFlag == "RC"){
      var url = this._global.baseAPIUrl + 'ipms/rctask/processworkflow';
    }
    return this._http.post(url, body, { headers: header });
  }

  saveRcTask(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/rctask/sendRcForApproval';
    return this._http.post(url, body, { headers: header });
  }

  getWorkflowHistory(id, header, flag) {
    debugger;
    if(flag == "PO" || flag == "POTASK"){
      var url = this._global.baseAPIUrl + 'ipms/potask/getpohistorybyid/'+id;
    } else if(flag == "RC" || flag == "RCTASK"){
      var url = this._global.baseAPIUrl + 'ipms/rctask/getrchistorybyid/'+id;
    }
    return this._http.get(url, { headers: header });
  }

  //not used
  processRcTask(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/rctask/processworkflow';
    return this._http.post(url, body, { headers: header });
  }
}
