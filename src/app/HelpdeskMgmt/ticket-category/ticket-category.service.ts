import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class TicketCategoryService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveCategory(body, header, flag) {
    if (flag == 'save') {
      var url = this._global.baseAPIUrl + 'ipms/ticketcategory';
      return this._http.post(url, body, { headers: header });
    }
    if (flag == 'update') {
      var url = this._global.baseAPIUrl + 'ipms/ticketcategory/' + body.categoryName;
      return this._http.put(url, body, { headers: header });
    }
  }

  //   getCategoryList(header) {
  //     debugger;
  //     var url = this._global.baseAPIUrl + 'ipms/ticketcategory/categoryByFilter';
  //     return this._http.post(url , {headers: header});
  // }

  getCategoryList(header, body) {
    var url = this._global.baseAPIUrl + 'ipms/ticketcategory/categoryByFilter';
    return this._http.post(url, body, { headers: header });
  }



  CategoyById(categoryName, header) {
    var url = this._global.baseAPIUrl + 'ipms/ticketcategory/' + categoryName;
    return this._http.get(url, { headers: header });
  }

  deleteCategoryData(categoryname, header) {
    var url = this._global.baseAPIUrl + 'ipms/ticketcategory/' + categoryname;
    return this._http.delete(url, { headers: header });
  }

  getActiveCategory(header) {

    var url = this._global.baseAPIUrl + 'ipms/ticketcategory/getActiveCategoryList';
    return this._http.get(url, { headers: header });
  }
}

