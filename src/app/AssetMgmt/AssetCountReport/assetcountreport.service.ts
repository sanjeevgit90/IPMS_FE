import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class AssetCountReportService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  
assetCount(parameter, header, state ,district) {
  debugger;
  if(state !== null && district != null)
  {
    var url = this._global.baseAPIUrl + 'ipms/assetreport/'+parameter+'?district='+district+'&state='+state;
  }
  else{
    var url = this._global.baseAPIUrl + 'ipms/assetreport/'+parameter;
  }
  
  return this._http.get(url, { headers: header });
}


}
