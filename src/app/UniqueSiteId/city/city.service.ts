import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { AppGlobals } from '../../global/app.global';


@Injectable({
  providedIn: 'root'
})
export class CityService {


  constructor(private _http: HttpClient, private _global: AppGlobals) { }


 

  saveCity(body, header, flag) {
    if (flag == 'save') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/city';
      return this._http.post(url, body, { headers: header });
    }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/city';
      return this._http.put(url, body, { headers: header });
    }
  }

  getCityList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/city/cityByFilter';
    return this._http.post(url, body, { headers: header });
  }

  CityById(name, district, state, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/city/' + name + '/' + district + '/' + state;
    return this._http.get(url, { headers: header });
  }

  deleteCityByid(name, district, state, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/city/' + name + '/' + district + '/' + state;
    return this._http.delete(url, { headers: header });
  }



}
