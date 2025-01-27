import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveDepartment(body, header, flag) {
    if (flag == 'save') {
    
    var url = this._global.baseAPIUrl + 'ipms/department';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/department';
      return this._http.put(url , body, {headers: header});
      }
  }

  getDepartmentList(header) {
    
    var url = this._global.baseAPIUrl + 'ipms/department';
    return this._http.get(url , {headers: header});
}

departmentByName(departmentName, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/department/'+departmentName;
  return this._http.get(url, { headers: header });
}

deleteDepartmentByName(name, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/department/'+name;
  return this._http.delete(url, { headers: header });
}

}
