import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveFamily(body, header, flag) {
    if (flag == 'save') {
    var url = this._global.baseAPIUrl + 'ipms/userfamily';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      var url = this._global.baseAPIUrl + 'ipms/userfamily';
      return this._http.put(url , body, {headers: header});
      }
  }

  getFamilyList(header) {
    var url = this._global.baseAPIUrl + 'ipms/userfamily/myfamily';
    return this._http.get(url , {headers: header});
}

familyById(name, header) {
  var url = this._global.baseAPIUrl + 'ipms/userfamily/'+name;
  return this._http.get(url, { headers: header });
}

deleteFamilyById(id, header) {
  var url = this._global.baseAPIUrl + 'ipms/userfamily/'+id;
  return this._http.delete(url, { headers: header });
}

}
