import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class TicketTaskService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

ticketList(header,body ) {
   
   
    var url = this._global.baseAPIUrl + 'ipms/ticket/ticketTaskByFilter';
    return this._http.post(url , body, {headers: header});
   
}
HistoryTaskList(header,body ) {
   
 
  var url = this._global.baseAPIUrl + 'ipms/ticket/ticketHistoryByFilter';
  return this._http.post(url , body, {headers: header});
 
}

taskById(entityId, header) {
   
    var url = this._global.baseAPIUrl + 'ipms/ticket/'+entityId;
    return this._http.get(url, { headers: header });
    }

saveTask(body, header, assign) {
 
   
    if(assign != null)
    {
      var url = this._global.baseAPIUrl + 'ipms/ticket/processworkflow?assignName='+ assign;
    }
    else
    { 
      var url = this._global.baseAPIUrl + 'ipms/ticket/processworkflow';
    }
    return this._http.post(url , body, {headers: header});   
}

tripList(header,body ) {
 
  var url = this._global.baseAPIUrl + 'ipms/tripmaster/tripByFilter';
  return this._http.post(url , body, {headers: header});
 
}

getVehicleList(header) {
 
  var url = this._global.baseAPIUrl + 'ipms/vehiclemaster/getAllVehicleList';
  return this._http.get(url , {headers: header});
}


saveTripDataFromThirdParty (body, header) {
 
  var url =  this._global.baseAPIUrl + 'ipms/tripmaster/saveTripFromThirdParty';
  return this._http.post(url , body, {headers: header});
}

getTripDataByTicket(id, header) {
 
  var url = this._global.baseAPIUrl + 'ipms/tripmaster/GetTripDataByTicket/' +id;
  return this._http.get(url, { headers: header });
}


removeTripFromTicket(id, header){
 
  
  var url = this._global.baseAPIUrl + 'ipms/tripmaster/deleteTripFromTicket/' +id;
  return this._http.get(url, {headers:header });
}

getAllDataFromOut(authToken,body) {
 
  
  var url ="https://app.locate365.in/obd-search";
  return this._http.post(url , body, {headers: { "authToken": authToken}});
}

loginToThirdParty(body, authToken){
 
  
  var url =  "https://app.locate365.in/business/login";
  return this._http.post(url , body, {headers: authToken});
}


logoutToThirdParty(body, authToken) {
 
  
  var url ="https://app.locate365.in/business/logout";
  return this._http.post(url , body, {headers: authToken});
}

getAddressByLatLong(header,lat, long){
  
  var url ="https://logisticdemo.in/auth/get-address";
  return this._http.get(url, { headers:header });
}

// fillAddressByLatLong(lat, long){
//   var url ="https://app.locate365.in/get-address?lat="+ lat +"&long="+ long;
//   return this._http.get(url);
// }

updateTripData(body, header) {
 
  var url = this._global.baseAPIUrl + 'ipms/tripmaster/updateTrip';
  return this._http.put(url , body, {headers: header});
}

getVendorList (header, id) {
   
    var url = this._global.baseAPIUrl + 'ipms/ticket/getVendorList/'+id;
    return this._http.get(url , {headers: header});
  }
  getAllVendorList (header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticket/getAllVendorList';
    return this._http.get(url , {headers: header});
  }

  getClassificationByProject (header, id) {
   
    var url = this._global.baseAPIUrl + 'ipms/ticketclassification/getClassificationByProjectList/'+id;
    return this._http.get(url , {headers: header});
  }  

  getHistoryDataById(entityId, header) {
    var url = this._global.baseAPIUrl + 'ipms/ticket/task/'+entityId;
    return this._http.get(url, { headers: header });
    }

    ticketById(entityId, header) {
      var url = this._global.baseAPIUrl + 'ipms/ticket/ticketDataById/'+entityId;
      return this._http.get(url, { headers: header });
      }
}




