import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class AssetConstantMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveData(body, header, flag) {
    if (flag == 'save') {
    
    var url = this._global.baseAPIUrl + 'ipms/assetconstant';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/assetconstant';
      return this._http.put(url , body, {headers: header});
      }
  }

  getConstantList(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/assetconstant/constantByFilter';
    return this._http.post(url , body, {headers: header});
}

constantByName(name, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/assetconstant/'+name;
  return this._http.get(url, { headers: header });
}

deleteAssetConstant(name, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/assetconstant/'+name;
  return this._http.delete(url, { headers: header });
}
}
