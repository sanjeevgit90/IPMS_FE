import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { }
  LoginUser(data) {
    var header = new HttpHeaders ({
      "Content-Type" : "application/json"
    });
    var url = this._global.baseAPIUrl + 'authenticate';
    return this._http.post(url , data, {headers: header});
}
unlockUser(username, token) {
  var header = new HttpHeaders ({
    "Content-Type" : "application/json"
  });
  var url = this._global.baseAPIUrl + 'unlockUser/'+username+"/"+ token;
  return this._http.get(url , {headers: header});
}

}
