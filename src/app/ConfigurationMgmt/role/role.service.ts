import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { AppGlobals } from '../../global/app.global';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  roleList(header) {

    var url = this._global.baseAPIUrl + 'ipms/role';
    return this._http.get(url, { headers: header });

  }

  getMenuList(header) {
    var url = this._global.baseAPIUrl + 'ipms/role/menuhierarchy';
    return this._http.get(url, { headers: header });
  }

  findRoleById(name, header, flag) {
    if (flag == 'edit') {
      var url = this._global.baseAPIUrl + 'ipms/role/menuhierarchy/' + name;
      return this._http.get(url, { headers: header });
    }
    if (flag == 'view') {
      var url = this._global.baseAPIUrl + 'ipms/role/menuhierarchy/' + name;
      return this._http.get(url, { headers: header });
    }
  }


  saveRole(body, header, flag) {
    if (flag == 'save') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/role';
      return this._http.post(url, body, { headers: header });
    }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/role';
      return this._http.put(url, body, { headers: header });
    }
  }

  deleteRoleByName(name, header) {
    var url = this._global.baseAPIUrl + 'ipms/role/' + name;
    return this._http.delete(url, { headers: header });
  }

}
