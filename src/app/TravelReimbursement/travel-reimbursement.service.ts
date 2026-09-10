import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppGlobals } from '../global/app.global';
import {
  SelectionOption,
  SendForApprovalRequest,
  TravelReimbursement,
  TravelReimbursementApprovalTask,
  TravelReimbursementRejectRequest,
  TravelReimbursementSaveRequest
} from './models/travel-reimbursement.model';

@Injectable({
  providedIn: 'root'
})
export class TravelReimbursementService {

  constructor(private http: HttpClient, private global: AppGlobals) { }

  getMyTravelReimbursements(headers: HttpHeaders | Record<string, string>): Observable<TravelReimbursement[]> {
    const url = this.global.baseAPIUrl + 'ipms/travelreimbursement/getmytravelreimbursements';
    return this.http.get<TravelReimbursement[]>(url, { headers });
  }

  saveTravelReimbursement(
    body: TravelReimbursementSaveRequest,
    headers: HttpHeaders | Record<string, string>
  ): Observable<TravelReimbursement> {
    const url = this.global.baseAPIUrl + 'ipms/travelreimbursement/savetravelreimbursement';
    return this.http.post<TravelReimbursement>(url, body, { headers });
  }

  updateTravelReimbursement(
    entityId: number,
    body: TravelReimbursementSaveRequest,
    headers: HttpHeaders | Record<string, string>
  ): Observable<TravelReimbursement> {
    const url = this.global.baseAPIUrl + 'ipms/travelreimbursement/updatetravelreimbursement/' + entityId;
    return this.http.put<TravelReimbursement>(url, body, { headers });
  }

  getTravelReimbursementById(
    entityId: number,
    headers: HttpHeaders | Record<string, string>
  ): Observable<TravelReimbursement> {
    const url = this.global.baseAPIUrl + 'ipms/travelreimbursement/gettravelreimbursementbyid/' + entityId;
    return this.http.get<TravelReimbursement>(url, { headers });
  }

  getProjectSelectionList(headers: HttpHeaders | Record<string, string>): Observable<SelectionOption[]> {
    const url = this.global.baseAPIUrl + 'ipms/project/selectionlist';
    return this.http.get<SelectionOption[]>(url, { headers });
  }

  sendForApproval(
    reimbursementId: number,
    body: SendForApprovalRequest,
    headers: HttpHeaders | Record<string, string>
  ): Observable<TravelReimbursement> {
    const url = this.global.baseAPIUrl + 'ipms/travelreimbursement/sendforapproval/' + reimbursementId;
    return this.http.post<TravelReimbursement>(url, body, { headers });
  }

  getPendingApprovalTasks(
    headers: HttpHeaders | Record<string, string>
  ): Observable<TravelReimbursementApprovalTask[]> {
    const url = this.global.baseAPIUrl + 'ipms/travelreimbursement/getpendingtasks';
    return this.http.get<TravelReimbursementApprovalTask[]>(url, { headers });
  }

  approveTravelReimbursement(
    reimbursementId: number,
    headers: HttpHeaders | Record<string, string>
  ): Observable<TravelReimbursement> {
    const url = this.global.baseAPIUrl + 'ipms/travelreimbursement/approve/' + reimbursementId;
    return this.http.post<TravelReimbursement>(url, {}, { headers });
  }

  rejectTravelReimbursement(
    reimbursementId: number,
    body: TravelReimbursementRejectRequest,
    headers: HttpHeaders | Record<string, string>
  ): Observable<TravelReimbursement> {
    const url = this.global.baseAPIUrl + 'ipms/travelreimbursement/reject/' + reimbursementId;
    return this.http.post<TravelReimbursement>(url, body, { headers });
  }
}
