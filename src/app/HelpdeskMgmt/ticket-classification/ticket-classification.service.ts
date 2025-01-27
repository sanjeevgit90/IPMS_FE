import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class TicketClassificationService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveClassification(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketclassification';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/ticketclassification';
      return this._http.put(url , body, {headers: header});
      }
  }

  getClassificationList(body,header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticketclassification/classificationByFilter';
    return this._http.post(url , body, {headers: header});
}

 

classificationById(classificationValue, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ticketclassification/'+classificationValue;
  return this._http.get(url, { headers: header });
}

deleteClassificationData (classification, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ticketclassification/'+classification;
  return this._http.delete(url, { headers: header });
}

getActiveClassification(header) {
   
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/ticketclassification/getActiveClassificationList';
  return this._http.get(url , {headers: header});
}
}

