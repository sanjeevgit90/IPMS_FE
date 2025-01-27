import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class PartyMasterService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveParty(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/party/addparty';
    return this._http.post(url, body, { headers: header });
  }

  updateParty(body, header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/party/' + id;
    return this._http.put(url, body, { headers: header });
  }

  getAllParty(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/party/getallparty';
    return this._http.post(url, body, { headers: header });
  }

  getPartyById(id, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/party/getpartybyid/' + id;
    return this._http.get(url, { headers: header });
  }

  deletePartyById(id, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/party/deletepartybyid/' + id;
    return this._http.get(url, { headers: header });
  }
}
