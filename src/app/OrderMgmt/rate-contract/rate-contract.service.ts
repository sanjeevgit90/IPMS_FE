import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../../global/app.global';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RateContractService {

  private dashboardRcListCache$: Observable<any> | null = null;
  private cachedAuthToken: string | null = null;

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  saveRC(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/addratecontract';
    return this._http.post(url, body, { headers: header }).pipe(
      tap(() => this.invalidateRcListCache())
    );
  }

  updateRC(body, header, id) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/' + id;
    return this._http.put(url, body, { headers: header }).pipe(
      tap(() => this.invalidateRcListCache())
    );
  }

  getAllRC(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/getallratecontracts';
    return this._http.get(url, { headers: header });
  }

  getRCById(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/getorderbyid/' + id;
    return this._http.get(url, { headers: header });
  }

  getRateContractInfo(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/getratecontractinfo/' + id;
    return this._http.get(url, { headers: header });
  }

  getAllRcFromView(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/getallrcbyfilter';
    return this._http.post(url, body, { headers: header });
  }

  getAllRcFromViewCached(body, header): Observable<any> {
    const authToken = header?.Authorization || header?.authorization || null;
    if (this.dashboardRcListCache$ && this.cachedAuthToken !== authToken) {
      this.invalidateRcListCache();
    }
    if (!this.dashboardRcListCache$) {
      this.cachedAuthToken = authToken;
      this.dashboardRcListCache$ = this.getAllRcFromView(body, header).pipe(
        tap({
          error: () => this.invalidateRcListCache()
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.dashboardRcListCache$;
  }

  refreshRcListCache(body, header): Observable<any> {
    this.invalidateRcListCache();
    return this.getAllRcFromViewCached(body, header);
  }

  invalidateRcListCache(): void {
    this.dashboardRcListCache$ = null;
    this.cachedAuthToken = null;
  }

  generateDuplicateRc(body, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/generateduplicateorder';
    return this._http.post(url, body, { headers: header }).pipe(
      tap(() => this.invalidateRcListCache())
    );
  }

  deleteRateContract(id, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/deleteorderbyid/'+id;
    return this._http.get(url, { headers: header }).pipe(
      tap(() => this.invalidateRcListCache())
    );
  }
}
