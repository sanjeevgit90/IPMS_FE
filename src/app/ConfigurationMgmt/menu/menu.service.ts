import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 


  saveMenu(body, header, flag) {
    if (flag == 'save') {
    var url = this._global.baseAPIUrl + 'ipms/menu';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      var url = this._global.baseAPIUrl + 'ipms/menu';
      return this._http.put(url , body, {headers: header});
      }
  }

  getMenuList(body, header) {
    var url = this._global.baseAPIUrl + 'ipms/menu/menuByFilter';
    return this._http.post(url , body, {headers: header});
}

menuById(name, header) {
  var url = this._global.baseAPIUrl + 'ipms/menu/'+name;
  return this._http.get(url, { headers: header });
}

deleteMenuByName (name, header) {
  var url = this._global.baseAPIUrl + 'ipms/menu/'+name;
  return this._http.delete(url, { headers: header });
}

}

