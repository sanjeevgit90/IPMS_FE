import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class CollectionTaggingService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveCollection(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/collection';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/collection';
      return this._http.put(url , body, {headers: header});
      }
  }

  collectionById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/collection/'+ id;
  return this._http.get(url, { headers: header });
}

deleteCollection(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/collection/'+ id;
  return this._http.delete(url, { headers: header });
}

getCollectionList( header, project, body) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/collection/getCollectionList/'+project;
  return this._http.post(url, body,{ headers: header });
}

submitForApproval(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/collectiontask/submitCollection/'+ id;
  return this._http.get(url, { headers: header });
}

}
