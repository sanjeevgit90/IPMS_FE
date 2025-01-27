import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ProductMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveProductData(body, header, flag) {
    if (flag == 'save') {
    
    var url = this._global.baseAPIUrl + 'ipms/product';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/product';
      return this._http.put(url , body, {headers: header});
      }
  }

  getProductList(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/product/productByFilter';
    return this._http.post(url , body, {headers: header});
}

productById(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/product/'+id;
  return this._http.get(url, { headers: header });
}

deleteProduct(id, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/product/'+id;
  return this._http.delete(url, { headers: header });
}
}
