import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 
  changepassword(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/user/changepassword';
    return this._http.post(url , body, {headers: header});
}

}
