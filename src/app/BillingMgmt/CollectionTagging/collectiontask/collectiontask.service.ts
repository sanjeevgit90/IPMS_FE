import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class CollectionTaskService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  processTask(body, header) {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/collectiontask';
      return this._http.put(url , body, {headers: header});
  }

getTaskList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/collectiontask/taskByFilters';
    return this._http.post(url , body, {headers: header});
}

/*getTaskList(body, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/collectiontask/historytaskByFilters';
  return this._http.post(url , body, {headers: header});
}
*/

taskById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/collectiontask/'+id;
  return this._http.get(url, { headers: header });
}
getHistoryTask(body, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/collectiontask/getAllHistoryTasks';
  return this._http.post(url , body, {headers: header});
}

getHistoryById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/collectiontask/getHistoryById'+id;
  return this._http.get(url, { headers: header });
}

}
