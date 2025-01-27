import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ProjectApprovalTaskService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  processTask(body, header) {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/projectApproval';
      return this._http.put(url , body, {headers: header});
  }

getTaskList(body, header) {
    debugger;
   var url = this._global.baseAPIUrl + 'ipms/projectApproval/taskByFilters';
      return this._http.post(url , body, {headers: header});
    }

 getHistoryTask(body, header) {
      var url = this._global.baseAPIUrl + 'ipms/projectApproval/historyTaskByFilter';
    return this._http.post(url , body, {headers: header});
    }

taskById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/projectApproval/'+id;
  return this._http.get(url, { headers: header });
}

}
