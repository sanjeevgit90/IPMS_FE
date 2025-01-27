import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) {}
debugger;
  openConfirmDialog(msg){
    debugger;
    return this.dialog.open(MatConfirmDialogComponent,{
      width:'390px',
      panelClass:'confirm-dialog-container',
      disableClose:true,
      data:{
        message:msg
      }
    });
  }
  
  
}
