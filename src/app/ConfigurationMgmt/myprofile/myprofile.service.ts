import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class MyprofileService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  getProfile(id, header) {
    if (id == null) {
      var url = this._global.baseAPIUrl + 'ipms/userprofile/myprofile';
    } else {
      var url = this._global.baseAPIUrl + 'ipms/userprofile/' + id;
    }
    return this._http.get(url, { headers: header });
  }

  getProjectLevelList(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/projectmapping/getAllProjectsOfUsers/' + id;
    return this._http.post(url, body, { headers: header });
  }


}
