import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { PRSService } from '../prs.service';

@Component({
  selector: 'app-view-prs',
  templateUrl: './view-prs.component.html',
  providers: [PRSService, AppGlobals, DialogService, SharedService]
})
export class ViewPRSComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private prsService: PRSService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;
  history: boolean = false;
  prsTaskId:any = null;

  taskHistoryList: any = [];
  isUtilityPayment: Boolean = false;
  prs = {
    "prsNo": "", "prsDate": "", "purchaseOrderNumber": "", "partyName": "", "invoiceNo": "",
    "invoiceDate": "", "invoiceAmount": "", "paymentDueDate": "", "description": "", "note": "",
    "department": "", "project": "", "approvalStatus": "", "location": "", "requestedBy": "",
    "approvedBy": "", "signature": "", "checklist": "", "quotation": "", "poCopy": "", "checkedInvoiceCopy": "",
    "approval": "", "supportingDocuments": "", "invoiceFileUpload": "", "grnNo": "",
    "isUtilityPayment": "", "office": "", "billType": "", "billNo": "", "attachedBill": "", "entityId": null,
    "attachments":[]
  };

  back = function () {
    if(this.prsTaskId == null){
      this.router.navigate(['/searchPrs']);
    } else {
      this.router.navigate(['/searchPrsTask']);
    }
  }

  // printComponent(cmpName) {
  //   let printContents = document.getElementById(cmpName).innerHTML;
  //   let originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  //   //window.location.reload();
  // }

  printComponent(cmpName): void {
    let printContents, popupWin;
    printContents = document.getElementById(cmpName).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
  <html>
    <head>
      <title>Purchase Order</title>
      <style>
    body {font: 400 14px/20px Roboto, "Helvetica Neue", sans-serif;}
    .table-bordered td, .table-bordered th {
      border: 1px solid #dee2e6; padding: .5rem; margin:0px}
    .pocenter-align { text-align: center;  padding: 8px;  margin: 0px;
    }
      </style>
    </head>
<body onload="window.print();window.close()">${printContents}</body>
  </html>`
    );
    popupWin.document.close();
  }

  
  getHistoryDataById = function (entityId) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.prsService.getHistoryDataById(entityId, headers).subscribe(resp => {
      debugger;
      this.taskHistoryList = resp;
      this.showLoading = false;
      this.history = true;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }
  // Search function
  search = function (id) {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.prsService.getPrsView(id, headers).subscribe(resp => {
      debugger;
      this.prs = resp;
      this.isUtilityPayment= this.prs.isUtilityPayment;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }
/*
  lessThan = function(value) {
    let name = value;
    if(name.length < 37){
      return true;
    } else {
      return false;
    }
  }

  greaterThan = function(value) {
    let name = value;
    if(name.length >= 37){
      return true;
    } else {
      return false;
    }
  }
*/

  //for checking if string contains uuid.
  regExpUuid = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
  containsUUID = function(s) {
    let result = false;
    if(s.length > 36)
    {
      let str = s.substring(0, 36);
      result = this.regExpUuid.test(str);
    }
    return result;
  }

  baseUrl:string=null;
  ngOnInit(): void {
    this.search(this.route.snapshot.params.id);
    this.getHistoryDataById(this.route.snapshot.params.id);
    this.baseUrl = this._global.baseUrl;
    this.prsTaskId = sessionStorage.getItem("prsTaskId");
  }

}
