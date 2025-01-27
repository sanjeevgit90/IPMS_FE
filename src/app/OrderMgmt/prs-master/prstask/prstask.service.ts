import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class PrsTaskService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  processTask(body, header) {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/prstask/processworkflow';
      return this._http.post(url , body, {headers: header});
  }

getTaskList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/prstask/getpotasks';
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
  var url = this._global.baseAPIUrl + 'ipms/prstask/getpotaskbyid/'+id;
  return this._http.get(url, { headers: header });
}

getHistoryDataById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/prstask/getprstaskhistorybyid/'+id;
  return this._http.get(url, { headers: header });
}

getHistoryTaskList(body, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/prstask/getallprshistorytasks';
  return this._http.post(url, body,{ headers: header });
}


}
