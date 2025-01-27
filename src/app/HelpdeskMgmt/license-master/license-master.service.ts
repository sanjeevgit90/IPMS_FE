import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class LicenseMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveLicense(body, header, flag) {
    if (flag == 'save') {
    
    var url = this._global.baseAPIUrl + 'ipms/licensemaster';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/licensemaster/'+body.licenseTag;
      return this._http.put(url , body, {headers: header});
      }
  }

  getLicenseList(header) {
    
    var url = this._global.baseAPIUrl + 'ipms/licensemaster';
    return this._http.get(url , {headers: header});
}

 

licenseById(licenseTag, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/licensemaster/'+licenseTag;
  return this._http.get(url, { headers: header });
}

deleteLicenseByTag(licenseTag, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/licensemaster/'+licenseTag;
  return this._http.delete(url, { headers: header });
}
}


