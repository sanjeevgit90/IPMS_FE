import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class ProjectMasterService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { } 

  saveProjectData(body, header, flag) {
    if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/project';
    return this._http.post(url , body, {headers: header});
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/project';
      return this._http.put(url , body, {headers: header});
      }
  }

getProjectList(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/project/projectByFilters';
    return this._http.post(url , body, {headers: header});
}

projectById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/project/getProjectById/'+id;
  return this._http.get(url, { headers: header });
}

deleteProject(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/project/'+id;
  return this._http.delete(url, { headers: header });
}
submitForApproval(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/project/getSubmitForApproval/'+id;
  return this._http.get(url, { headers: header });
}

getAllLevels(project,header, flag) {
  debugger;
  
  if (flag == 'default') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/projectmapping/getDefaultAllLevels?project='+ project;
    return this._http.get(url, { headers: header });
  }
    if (flag == 'all') {
      debugger; 
      var url = this._global.baseAPIUrl + 'ipms/projectmapping/getAllLevels?project='+ project ;
      return this._http.get(url, { headers: header });
  }
}
getLevelsByProject(project,header) {
    debugger;
      var url = this._global.baseAPIUrl + 'ipms/projectmapping/mappingByProject/'+ project ;
      return this._http.get(url, { headers: header });
}
addLevel(org, project, body, header, flag) {
  debugger;
  
  if (flag == 'save') {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/projectmapping/'+ project + '/' + org;
    return this._http.post(url, body, { headers: header });
  }
    if (flag == 'update') {
      debugger;
      var url = this._global.baseAPIUrl + 'ipms/projectmapping/'+ project + '/' + org;
      return this._http.put(url, body, { headers: header });
  }
}

getHistoryDataById(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/projectApproval/taskHistory/'+id;
  return this._http.get(url, { headers: header });
}

deleteLevel(id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/projectmapping/'+id;
  return this._http.delete(url, { headers: header });
}

saveOpenBravoId(project, id, header) {
  debugger;
  var url = this._global.baseAPIUrl + 'ipms/project/saveOpenBravoId?id='+id+"&project="+project;
  return this._http.get(url , {headers: header});
}
}
