import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ProjectMappingService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  getProjectLevelList(body, header, id) {
    debugger;
   var url = this._global.baseAPIUrl + 'ipms/projectmapping/getAllProjectsOfUsers/'+id;
      return this._http.post(url , body, {headers: header});
    }
  
  getAllLevels(id, header, user) {
      debugger;
     var url = this._global.baseAPIUrl + 'ipms/projectmapping/getAllLevelsByProjectId/'+id+ '/' + user;;
        return this._http.get(url , {headers: header});
  }

  /*getprojectList(body, header) {
    debugger;
   var url = this._global.baseAPIUrl + 'ipms/project/getProjectListByOrg';
      return this._http.post(url , body, {headers: header});
}
*/

getprojectList(body, header) {
  debugger;
 var url = this._global.baseAPIUrl + 'ipms/project/getProjectListByOrg/'+body;
    return this._http.get(url , {headers: header});
}

deleteById (id, header) {
  var url = this._global.baseAPIUrl + 'ipms/projectmapping/'+id;
  return this._http.delete(url, { headers: header });
}

addLevels(levels, header) {
  debugger;
    var url = this._global.baseAPIUrl + 'ipms/projectmapping/saveUsersProjects';
    return this._http.post(url, levels, { headers: header });
}

addAllLevels(org, user, level,header) {
  debugger;
    var url = this._global.baseAPIUrl + 'ipms/projectmapping/saveAllProjects/'+ org +'/'+user +'/'+ level;
    return this._http.get(url, { headers: header });
}
getAllLevelsByOrg(org, header) {
  debugger;
    var url = this._global.baseAPIUrl + 'ipms/projectmapping/getAllLevelsByOrg/'+org;
    return this._http.get(url, { headers: header });
}

}

