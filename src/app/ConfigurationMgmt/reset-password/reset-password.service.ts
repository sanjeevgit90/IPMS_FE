import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 
  resetpassword(data) {
    debugger;
    var header = new HttpHeaders ({
      "Content-Type" : "application/json"
    });
    var url = this._global.baseAPIUrl + 'resetpassword';
    return this._http.post(url , data, {headers: header});
}

}
