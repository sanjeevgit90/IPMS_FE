import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class TicketMasterService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveAsDraft(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticket/saveAsDraft';
    return this._http.post(url, body, { headers: header });
  }
  saveTicket(body, header, flag) {
    if (flag == 'save') {

      var url = this._global.baseAPIUrl + 'ipms/ticket';
      return this._http.post(url, body, { headers: header });
    }

    if (flag == 'update') {

      var url = this._global.baseAPIUrl + 'ipms/ticket/' + body.entityId;
      return this._http.put(url, body, { headers: header });
    }
  }

  getTicketList(header) {

    var url = this._global.baseAPIUrl + 'ipms/ticket';
    return this._http.get(url, { headers: header });
  }


  // ticketList(body, header) {

  //   
  //   var url = this._global.baseAPIUrl + 'ipms/ticket/getTicketByFilter';
  //   return this._http.post(url , body, {headers: header});

  //  }

  ticketList(body, header, pageNumber: number, pageSize: number) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ticket/getTicketByFilter?page=' + pageNumber + '&size=' + pageSize +'&sort=' + 'ASC'+'&column=' + 'ticketno';
    return this._http.post(url, body, { headers: header });
  }



  
  // ticketList(header, ticketNo, filter, pageNumber: number, pageSize: number, sortName) {
  //   debugger;
  //   var url = this._global.baseAPIUrl + 'ipms/ticket/getTicketByFilterWithoutBodyRequest?column=' + ticketNo + '&filter=' + filter +'&pageNumber=' + pageNumber +'&pageSize=' + pageSize + '&sortOrder=' + sortName;
  //   return this._http.get(url, { headers: header });
  // }



  ticketById(entityId, header) {

    var url = this._global.baseAPIUrl + 'ipms/ticket/tic/' + entityId;
    return this._http.get(url, { headers: header });
  }


  getTicketActiveProblemList(header) {

    var url = this._global.baseAPIUrl + 'ipms/ticketproblemreport/getActiveProblemReportList';
    return this._http.get(url, { headers: header });
  }


  getTicketActiveCategoryList(header) {

    var url = this._global.baseAPIUrl + 'ipms/ticketproblemreport/getActiveProblemReportList';
    return this._http.get(url, { headers: header });
  }

  getTicketActiveClassificationList(header) {

    var url = this._global.baseAPIUrl + 'ipms/ticketclassification/getActiveClassificationList';
    return this._http.get(url, { headers: header });
  }


  getSubcategoryByCategory(header, name) {

    var url = this._global.baseAPIUrl + 'ipms/ticketcategory/getSubcategoryByCategory/' + name;
    return this._http.get(url, { headers: header });
  }



  getClassificationByProject(header, id) {

    var url = this._global.baseAPIUrl + 'ipms/ticketclassification/getClassificationByProjectList/' + id;
    return this._http.get(url, { headers: header });
  }


  getProblemByProject(header, id) {

    var url = this._global.baseAPIUrl + 'ipms/ticketproblemreport/getProblemByProjectList/' + id;
    return this._http.get(url, { headers: header });
  }

  reopenTicket(entityId, header) {

    var url = this._global.baseAPIUrl + 'ipms/ticket/reopenTicketByid/' + entityId;
    return this._http.get(url, { headers: header });
  }


  updateTicketData(body, header) {

    var url = this._global.baseAPIUrl + 'ipms/ticket/updateTicketData';
    return this._http.put(url, body, { headers: header });
  }



  // getActiveUserList(header) {

  //   
  //   var url = this._global.baseAPIUrl + 'ipms/userprofile/selectionUserlist';
  //   return this._http.get(url , {headers: header});
  // }


}


