import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class VehicleMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveVehicle(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vehiclemaster';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/vehiclemaster/'+body.vehicleRegNumber;
      return this._http.put(url , body, {headers: header});
      }
  }

//   getVehicleList(header) {
//     debugger;
//     var url = this._global.baseAPIUrl + 'ipms/vehiclemaster/vehicleByFilter';
//     return this._http.get(url , {headers: header});
// }

getVehicleList(body,header ) {
   
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/vehiclemaster/vehicleByFilter';
  return this._http.post(url , body, {headers: header});
 
}

// getVehicleList(header) {
//   debugger;
//   var url = this._global.baseAPIUrl + 'ipms/vehiclemaster/vehicleByFilter';
//   return this._http.get(url , {headers: header});
// }

 

vehicleById(vehicleRegNumber, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/vehiclemaster/'+vehicleRegNumber;
  return this._http.get(url, { headers: header });
}

deleteVehicle (vehicleRegNo, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/vehiclemaster/'+vehicleRegNo;
  return this._http.delete(url, { headers: header });
}

}


