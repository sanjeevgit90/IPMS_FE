import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveProductDetails(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/productdetails/addproductdetail';
    return this._http.post(url, body, { headers: header });
  }

  updateProductDetails(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/productdetails/' + id;
    return this._http.put(url, body, { headers: header });
  }

  getProductDetailsById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/productdetails/getproductdetailbyid/' + id;
    return this._http.get(url, { headers: header });
  }

  deleteProductDetailsById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/productdetails/' + id;
    return this._http.delete(url, { headers: header });
  }

  getAllProductDetailsByPo(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/productdetails/getproductdetailsbypo';
    return this._http.post(url, body, { headers: header });
  }

  searchAllProductDetailsByPo(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/productdetails/searchproductdetailsbypo';
    return this._http.post(url, body, { headers: header });
  }
}
