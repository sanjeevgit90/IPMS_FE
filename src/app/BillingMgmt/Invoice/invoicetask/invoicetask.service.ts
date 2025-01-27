import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class InvoiceTaskService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  processTask(body, header) {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/invoicetask';
      return this._http.put(url , body, {headers: header});
  }

getTaskList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/invoicetask/taskByFilters';
    return this._http.post(url , body, {headers: header});
}
getHistoryTask(body, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/invoicetask/getAllHistoryTasks';
  return this._http.post(url , body, {headers: header});
}

taskById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/invoicetask/'+id;
  return this._http.get(url, { headers: header });
}
getHistoryById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/invoicetask/getHistoryById'+id;
  return this._http.get(url, { headers: header });
}


}
