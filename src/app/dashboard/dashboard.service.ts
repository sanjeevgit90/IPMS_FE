import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../global/app.global';
import { catchError } from 'rxjs/operators';
import { ExceptionhandlerService } from '../service/exceptionhandler.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _http:HttpClient, 
    private exceptionhandlerService:ExceptionhandlerService,
    private _global: AppGlobals,
    
    ) { } 

  getCount(header) {
    var url = this._global.baseAPIUrl + 'ipms/user/getDashboardCount';
    //return this._http.get(url, { headers: header })
    return this._http.get(url, { headers: header }).pipe(catchError(this.exceptionhandlerService.handleError));
  }
  
}
