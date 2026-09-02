import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppGlobals } from '../global/app.global';
import { ProcurementChatRequest, ProcurementChatResponse } from './models/procurement-chat.model';

@Injectable({
  providedIn: 'root'
})
export class ProcurementAiChatService {

  constructor(
    private http: HttpClient,
    private global: AppGlobals
  ) { }

  sendMessage(message: string): Observable<ProcurementChatResponse> {
    const url = this.global.baseAPIUrl + 'ipms/ai/procurement/chat';
    const body: ProcurementChatRequest = { message };
    const headers = new HttpHeaders({
      Authorization: sessionStorage.getItem('token') || ''
    });
    return this.http.post<ProcurementChatResponse>(url, body, { headers });
  }
}
