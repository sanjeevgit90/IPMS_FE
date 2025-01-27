import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  getManufacturerForDropdown(header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/manufacture/getManufacturerList';
    return this._http.get(url , {headers: header});
  }

  saveManufacturer(body, header, flag) {
    if (flag == 'save') {
    
    var url = this._global.baseAPIUrl + 'ipms/manufacture';
    return this._http.post(url , body, {headers: header});
  }
}
  getManufacturerList(header,body) {
    
    var url = this._global.baseAPIUrl + 'ipms/manufacture/manufacturerByfilter';
    return this._http.post(url , body, {headers: header});
}

deleteManufacturar(name,header) {
  
  var url = this._global.baseAPIUrl + 'ipms/manufacture/'+name;
  return this._http.delete(url , {headers: header});
}

}
