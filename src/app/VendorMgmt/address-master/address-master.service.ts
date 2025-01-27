import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType} from "@angular/common/http";
import { map } from  'rxjs/operators';
import { AppGlobals } from '../../global/app.global';


@Injectable({
  providedIn: 'root'
})
export class AddressMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveAddress(body, header, flag) {
    if (flag == 'save') {
      
      var url = this._global.baseAPIUrl + 'ipms/address/addaddress';
      return this._http.post(url , body, {headers: header});
    }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/address/' + body.entityId;
      return this._http.put(url , body, {headers: header});
    }
  }

  findAddressById(id,header) {
    
    var url = this._global.baseAPIUrl + 'ipms/address/getaddressbyid/'+id;
    return this._http.get(url , {headers: header});
  }

  addressList(header) {
    
    var url = this._global.baseAPIUrl + 'ipms/address/getalladdress';
    return this._http.get(url , {headers: header});
  }

  getAllAddressOfParty(header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/address/serachaddressbyparty/' + id;
    return this._http.get(url , {headers: header});
  }

  deleteAddressById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/address/deleteaddressbyid/' + id;
    return this._http.get(url , {headers: header});
  }

}