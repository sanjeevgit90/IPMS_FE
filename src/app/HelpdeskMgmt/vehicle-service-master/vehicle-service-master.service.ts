import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class VehicleServiceMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveVehicleService(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vehicleservice';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/vehicleservice/'+body.vehicleRegistrationNumber;
      return this._http.put(url , body, {headers: header});
      }
  }

  getVehicleServiceList(header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/vehicleservice';
    return this._http.get(url , {headers: header});
}

 

vehicleServiceByVehicleRegNo(vehicleRegistrationNumber, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/vehicleservice/'+vehicleRegistrationNumber;
  return this._http.get(url, { headers: header });
}

deleteVehicleService (vehicleRegNo, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/vehicleservice/'+vehicleRegNo;
  return this._http.delete(url, { headers: header });
}
}



