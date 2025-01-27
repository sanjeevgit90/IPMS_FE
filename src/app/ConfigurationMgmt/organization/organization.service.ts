import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveOrganization(body, header, flag) {
    debugger;
    if (flag == 'save') {
    var url = this._global.baseAPIUrl + 'ipms/organization';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      var url = this._global.baseAPIUrl + 'ipms/organization';
      return this._http.put(url , body, {headers: header});
      }
  }

  getOrganizationList(header) {
    var url = this._global.baseAPIUrl + 'ipms/organization';
    return this._http.get(url , {headers: header});
}

OrgById(id, header) {
  var url = this._global.baseAPIUrl + 'ipms/organization/'+id;
  return this._http.get(url, { headers: header });
}
deleteOrgById(id, header) {
  var url = this._global.baseAPIUrl + 'ipms/organization/'+id;
  return this._http.delete(url, { headers: header });
}

}
