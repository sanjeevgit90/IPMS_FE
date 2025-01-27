import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 
  forgotpassword (body) {
    debugger;
    var header = new HttpHeaders ({
      "Content-Type" : "application/json"
    });
    var url = this._global.baseAPIUrl + 'forgotpassword/'+body.username;
    return this._http.get(url , {headers: header});
}

}
