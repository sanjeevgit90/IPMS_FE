import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class AssetMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveAssetData(body, header, flag) {
    if (flag == 'save') {
    
    var url = this._global.baseAPIUrl + 'ipms/asset';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/asset';
      return this._http.put(url , body, {headers: header});
      }
  }

  saveNewAsset(body, header) {
    
    
    var url = this._global.baseAPIUrl + 'ipms/asset';
    return this._http.post(url , body, {headers: header});
  }

  getAssetList(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/asset/assetByFilter';
    return this._http.post(url , body, {headers: header});
}

assetById(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/asset/'+id;
  return this._http.get(url, { headers: header });
}

deleteAsset(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/asset/'+id;
  return this._http.delete(url, { headers: header });
}
assetAudit(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/asset/getAuditTrail/'+id;
  return this._http.get(url, { headers: header });
}

getDCAssetList(body, header, flag) {
  
  if (flag =='OEM')
  {
  var url = this._global.baseAPIUrl + 'ipms/asset/oemAssetByFilter?page='+1+'&size='+2000;
  return this._http.post(url , body, {headers: header});
  }
  else{
  var url = this._global.baseAPIUrl + 'ipms/asset/dcAssetByFilter?page='+1+'&size='+2000;
  return this._http.post(url , body, {headers: header});
  }
}
}
