import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveCategory(body, header, flag) {
    if (flag == 'save') {
    
    var url = this._global.baseAPIUrl + 'ipms/category';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/category';
      return this._http.put(url , body, {headers: header});
      }
  }

  getCategoryList(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/category/categoryByfilter';
    return this._http.post(url , body, {headers: header});
}

categoryByName(name, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/category?categoryname='+name;
  return this._http.get(url, { headers: header });
}
deleteCategoryData (name, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/category?categoryname='+name;
  return this._http.delete(url, { headers: header });
}
}
