import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../global/app.global';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogService } from '../service/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class ExceptionhandlerService {

  constructor(private _http:HttpClient, 
    private _global: AppGlobals,
    private dialogService:DialogService,
    ) { } 

  handleError(error: HttpErrorResponse) {
    debugger;
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.name}`;
    }
    debugger;
    //this.dialogService.openConfirmDialog(errorMessage);
    window.alert(errorMessage);
    window.location.href = "/";
    return throwError(errorMessage);
  }

}
