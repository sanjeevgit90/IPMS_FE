import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class CurrencyMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveCurrency(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/currencyMaster';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/currencyMaster/'+body.currencyName;
      return this._http.put(url , body, {headers: header});
      }
  }

  currencyList(body,header ) {
   
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/currencyMaster/currencyByFilter';
    return this._http.post(url , body, {headers: header});
   
  }
 

CurrencyById(categoryName, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/currencyMaster/'+categoryName;
  return this._http.get(url, { headers: header });
}

deleteCurrencyById(currencyName, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/currencyMaster/'+currencyName;
  return this._http.delete(url, { headers: header });
}


}