import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class RcProductDetailsService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveProductDetails(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/rcproductdetails/addproductdetail';
    return this._http.post(url, body, { headers: header });
  }

  updateProductDetails(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/rcproductdetails/' + id;
    return this._http.put(url, body, { headers: header });
  }

  getProductDetailsById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/rcproductdetails/getproductdetailbyid/' + id;
    return this._http.get(url, { headers: header });
  }

  deleteProductDetailsById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/rcproductdetails/' + id;
    return this._http.delete(url, { headers: header });
  }

  getAllProductDetailsByRc(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/rcproductdetails/getproductdetailsbyrc';
    return this._http.post(url, body, { headers: header });
  }

  searchAllProductDetailsByRc(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/rcproductdetails/searchproductdetailsbyrc';
    return this._http.post(url, body, { headers: header });
  }
}