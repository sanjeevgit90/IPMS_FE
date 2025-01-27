import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType} from "@angular/common/http";
import { map } from  'rxjs/operators';
import { Observable } from 'rxjs';
import { AppGlobals } from '../../global/app.global';
import { Location } from '../../app_data/location'

const httpOptions = {
  headers: new HttpHeaders({
    //'X-PINGOTHER':  'pinpong',
    // 'Content-Type':  'application/json',
    // 'Access-Control-Allow-Origin':  '*',
    // 'Access-Control-Allow-Method':  'GET,POST,PUT'
  }
  )
}


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  locationList(body, header) {   
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/location/locationByFilter';
    return this._http.post(url , body, {headers: header});
  }

  public saveLocation(location: Location, header, flag):Observable<Location> {
    if (flag == 'save') {
    var url = this._global.baseAPIUrl + 'ipms/location';
    return this._http.post<Location>(url, location, {headers: header});
    }

    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/location';
      return this._http.put<Location>(url, location, {headers: header});
      }

  }

  public findlocationById(id, header):Observable<Location> {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/location?locationid='+id;
    return this._http.get<Location>(url, {headers: header});

  }

  deleteLocationById(id, header):Observable<Location> {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/location?locationid='+id;
    return this._http.delete<Location>(url, { headers: header });
  }

}
