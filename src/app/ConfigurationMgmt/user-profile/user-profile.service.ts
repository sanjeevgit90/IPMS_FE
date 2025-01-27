import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveUser(body, header, flag) {
      var url = this._global.baseAPIUrl + 'ipms/user';
      return this._http.post(url, body, { headers: header });
  }
  updateProfile(body, header) {
      var url = this._global.baseAPIUrl + 'ipms/userprofile';
      return this._http.put(url, body, { headers: header });
  }
  updateAdminRight(body, header) {
    var url = this._global.baseAPIUrl + 'ipms/userprofile/admin';
    return this._http.put(url, body, { headers: header });

}

  userList(body, header) {

    var url = this._global.baseAPIUrl + 'ipms/userprofile/profileByFilter';
    return this._http.post(url, body, { headers: header });

  }

  findUserById(id, header) {
    var url = this._global.baseAPIUrl + 'ipms/userprofile/' + id;
    return this._http.get(url, { headers: header });
  }

  getlockUnlock(status, profileid, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/userprofile/lockUnlockProfile/'+status+'/'+profileid;
    return this._http.get(url, { headers: header });
  }

  deleteUserById(id, header) {
    var url = this._global.baseAPIUrl + 'ipms/userprofile/' + id;
    return this._http.delete(url, { headers: header });
  }

}
