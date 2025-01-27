import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';



@Injectable({
  providedIn: 'root'
})
export class PartyGstService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveGst(body, header, flag) {
    if (flag == 'save') {
      
      var url = this._global.baseAPIUrl + 'ipms/gst/addgst';
      return this._http.post(url , body, {headers: header});
    }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/gst/'+body.entityId;
      return this._http.put(url , body, {headers: header});
    }
  }

  getGstList(header) {
    
    var url = this._global.baseAPIUrl + 'ipms/gst/getallgst';
    return this._http.get(url , {headers: header});
  }

  getAllGstOfParty(header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/gst/getallgstbypartyid/' + id;
    return this._http.get(url , {headers: header});
  }

  deleteGstById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/gst/deletegstbyid/' + id;
    return this._http.get(url , {headers: header});
  }

}

