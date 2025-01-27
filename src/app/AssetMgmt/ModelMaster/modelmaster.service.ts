import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ModelMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveModelData(body, header, flag) {
    if (flag == 'save') {
    
    var url = this._global.baseAPIUrl + 'ipms/model';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      
      var url = this._global.baseAPIUrl + 'ipms/model';
      return this._http.put(url , body, {headers: header});
      }
  }

  getModelList(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/model/modelByfilter';
    return this._http.post(url , body, {headers: header});
}

modelByName(modelName, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/model/'+modelName;
  return this._http.get(url, { headers: header });
}

deleteModel(modelName, header) {
  
  var url = this._global.baseAPIUrl + 'ipms/model/'+modelName;
  return this._http.delete(url, { headers: header });
}
}
