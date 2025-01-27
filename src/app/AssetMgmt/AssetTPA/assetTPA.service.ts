import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class AssetTPAService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

 
  getAssetList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/assetreport/tpaReportByFilter';
    return this._http.post(url , body, {headers: header});
}

assetById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/asset/'+id;
  return this._http.get(url, { headers: header });
}


}
