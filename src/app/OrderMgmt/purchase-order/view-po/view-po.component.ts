import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { PurchaseOrderService } from '../../../OrderMgmt/purchase-order/purchase-order.service';

@Component({
  selector: 'app-view-po',
  templateUrl: './view-po.component.html',
  providers: [PurchaseOrderService, AppGlobals, DialogService, SharedService]
})
export class ViewPoComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private purchaseOrderService: PurchaseOrderService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;
  /* purchaseOrder = {"purchaseOrderNo": "", "orderDate": "", "poMadeFrom": "",
  "rateContractId": "", "department": "", "accountName": "",
  "organisationId": "", "orderType": "", "modeOfPayment": "",
  "dispatchThrough": "", "currency": "", "deliveryTerm": "",
  "paymentMethod": "", "suppliersReference": "", "discountAmt": "",
  "otherReference": "", "supplierName": "", "supplierDetails": "",
  "billFromState": "", "billFromGstNo": "", "buyerName": "",
  "invoiceToAddress": "", "billToAddress": "", "shipToAddress": "",
  "termsConditions": "", "isHistoricData": "", "poheaddesignation": "", "approvalStatus": "",
  "buyName": "", "buyInvoAddress1": "", "buyContactPerson": "", "buyMobNo": "", "buyEmail": ""}; */

  purchaseOrder = {
    "entityId": "",
    "createdDate": "",
    "createdBy": "",
    "updatedDate": "",
    "updatedBy": "",
    "isDeleted": "",
    "organizationId": "",
    "purchaseOrderNo": "",
    "orderDate": "",
    "department": "",
    "accountName": "",
    "orderType": "",
    "modeOfPayment": "",
    "suppliersReference": "",
    "otherReference": "",
    "dispatchThrough": "",
    "currency": "",
    "deliveryTerm": "",
    "invoiceToAddress": "",
    "supplierDetails": "",
    "billFromState": "",
    "billToAddress": "",
    "shipToAddress": "",
    "termsConditions": "",
    "uploadedTermsAnnexure": "",
    "additionalTerms": "",
    "approvalStatus": "",
    "signedCopyPath": "",
    "supplierName": "",
    "buyerName": "",
    "billFromGstNo": "",
    "billToGstNo": "",
    "includeTerms": "",
    "grandTotal": "",
    "totalTaxes": "",
    "totalWithoutTaxes": "",
    "discountAmt": "",
    "isHistoricData": "",
    "workflowName": "",
    "poMadeFrom": "",
    "rateContractId": "",
    "remark": "",
    "oldPoId": "",
    "oldPoNo": "",
    "oldPoDate": "",
    "isAmendedFlag": "",
    "amendedPoId": "",
    "paymentMethod": "",
    "organisationId": "",
    "verify": "",
    "verifyDate": "",
    "verfiedPOAttachment": "",
    "verifiedBy": "",
    "mailSentDate": "",
    "mailSentBy": "",
    "poCopy": "",
    "poPushedStatus": "",
    "poPushedDate": "",
    "invoicetoname": "",
    "invoicetoaddressforhistory": "",
    "invoicetocontact": "",
    "invoicetophone": "",
    "invoicetoemail": "",
    "suppliernameforhistory": "",
    "supplieraddress": "",
    "suppliercontact": "",
    "supplierphone": "",
    "supplieremail": "",
    "billtoname": "",
    "billtoaddressforhistory": "",
    "billtocontact": "",
    "billtophone": "",
    "billtoemail": "",
    "billtogstin": "",
    "shiptoname": "",
    "shiptoaddressforhistory": "",
    "shiptocontact": "",
    "shiptophone": "",
    "shiptoemail": "",
    "suppName": "",
    "suppContactPerson": "",
    "suppMobNo": "",
    "suppEmail": "",
    "buyName": "",
    "buyContactPerson": "",
    "buyMobNo": "",
    "buyEmail": "",
    "suppAddress": "",
    "suppCity": "",
    "suppDist": "",
    "suppState": "",
    "buyInvoAddress": "",
    "buyInvoCity": "",
    "buyInvoDist": "",
    "buyInvoState": "",
    "buyBillToGstNo": "",
    "buyBillToAddress": "",
    "buyBillToCity": "",
    "buyBillToDist": "",
    "buyBillToState": "",
    "buyShipToAddress": "",
    "buyShipToCity": "",
    "buyShipToDist": "",
    "buyShipToState": "",
    "priceList": "",
    "contactId": "",
    "departmentName": "",
    "accName": "",
    "currencySymbol": "",
    "paymentTermId": "",
    "paymentMethodId": "",
    "productDetailsList": "",
    "attachments": null,

    "poheaddesignation": "",
    "poheadname": "",
    "organisationName": "",
    "amountInWords": ""
  };


  oldPoData = {
    "entityId": "",
    "createdDate": "",
    "createdBy": "",
    "updatedDate": "",
    "updatedBy": "",
    "isDeleted": "",
    "organizationId": "",
    "purchaseOrderNo": "",
    "orderDate": "",
    "department": "",
    "accountName": "",
    "orderType": "",
    "modeOfPayment": "",
    "suppliersReference": "",
    "otherReference": "",
    "dispatchThrough": "",
    "currency": "",
    "deliveryTerm": "",
    "invoiceToAddress": "",
    "supplierDetails": "",
    "billFromState": "",
    "billToAddress": "",
    "shipToAddress": "",
    "termsConditions": "",
    "uploadedTermsAnnexure": "",
    "additionalTerms": "",
    "approvalStatus": "",
    "signedCopyPath": "",
    "supplierName": "",
    "buyerName": "",
    "billFromGstNo": "",
    "billToGstNo": "",
    "includeTerms": "",
    "grandTotal": "",
    "totalTaxes": "",
    "totalWithoutTaxes": "",
    "discountAmt": "",
    "isHistoricData": "",
    "workflowName": "",
    "poMadeFrom": "",
    "rateContractId": "",
    "remark": "",
    "oldPoId": "",
    "oldPoNo": "",
    "oldPoDate": "",
    "isAmendedFlag": "",
    "amendedPoId": "",
    "paymentMethod": "",
    "organisationId": "",
    "verify": "",
    "verifyDate": "",
    "verfiedPOAttachment": "",
    "verifiedBy": "",
    "mailSentDate": "",
    "mailSentBy": "",
    "poCopy": "",
    "poPushedStatus": "",
    "poPushedDate": "",
    "invoicetoname": "",
    "invoicetoaddressforhistory": "",
    "invoicetocontact": "",
    "invoicetophone": "",
    "invoicetoemail": "",
    "suppliernameforhistory": "",
    "supplieraddress": "",
    "suppliercontact": "",
    "supplierphone": "",
    "supplieremail": "",
    "billtoname": "",
    "billtoaddressforhistory": "",
    "billtocontact": "",
    "billtophone": "",
    "billtoemail": "",
    "billtogstin": "",
    "shiptoname": "",
    "shiptoaddressforhistory": "",
    "shiptocontact": "",
    "shiptophone": "",
    "shiptoemail": "",
    "suppName": "",
    "suppContactPerson": "",
    "suppMobNo": "",
    "suppEmail": "",
    "buyName": "",
    "buyContactPerson": "",
    "buyMobNo": "",
    "buyEmail": "",
    "suppAddress": "",
    "suppCity": "",
    "suppDist": "",
    "suppState": "",
    "buyInvoAddress": "",
    "buyInvoCity": "",
    "buyInvoDist": "",
    "buyInvoState": "",
    "buyBillToGstNo": "",
    "buyBillToAddress": "",
    "buyBillToCity": "",
    "buyBillToDist": "",
    "buyBillToState": "",
    "buyShipToAddress": "",
    "buyShipToCity": "",
    "buyShipToDist": "",
    "buyShipToState": "",
    "priceList": "",
    "contactId": "",
    "departmentName": "",
    "accName": "",
    "currencySymbol": "",
    "paymentTermId": "",
    "paymentMethodId": "",
    "productDetailsList": "",

    "poheaddesignation": "",
    "poheadname": "",
    "organisationName": "",
    "amountInWords": ""
  };

  //searchResults = {};
  oldProductDetails = {};
  attachFlag: boolean = false;
  isSameState: boolean = true;
  isSameStateOld: boolean = true;
  finalAmount = 0;
  oldfinalAmount = 0;
  baseUrl: any = null;
  taskId:any = null;

  VerifyEntity = { "entityId": null };


  // printComponent1(cmpName) {
  //   debugger;
  //   let printContents = document.getElementById(cmpName).innerHTML;
  //   let originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   window.close();
  //   document.body.innerHTML = originalContents;
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

  // Search function
  search = function (id) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.purchaseOrderService.getPurchaseOrderInfo(id, headers).subscribe(resp => {
      this.showLoading = false;
      debugger;
      this.purchaseOrder = resp;
      console.log(this.purchaseOrder);
      //this.searchResults = this.purchaseOrder.productdetails;
      if(this.purchaseOrder.suppState.toLowerCase() == this.purchaseOrder.buyBillToState.toLowerCase())
        this.isSameState = true;
      else
        this.isSameState = false;

      if(this.purchaseOrder.amountInWords == null || this.purchaseOrder.amountInWords == ""){
        if(this.purchaseOrder.currency == 'INR')
          this.finalAmount = this.withDecimal(this.purchaseOrder.grandTotal);
        else
          this.finalAmount = this.withDecimalUSD(this.purchaseOrder.grandTotal.toFixed(2));
      }

      if(this.purchaseOrder.isAmendedFlag == "YES"){
        this.getOldPoData(this.purchaseOrder.oldPoId);
      }
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Search function
  getOldPoData = function (id) {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.purchaseOrderService.getPurchaseOrderInfo(id, headers).subscribe(resp => {
      this.showLoading = false;
      debugger;
      this.oldPoData = resp;
      console.log(this.oldPoData);
      //this.searchResults = this.oldPoData.productdetails;
      if(this.oldPoData.suppState.toLowerCase() == this.oldPoData.buyBillToState.toLowerCase())
        this.isSameStateOld = true;
      else
        this.isSameStateOld = false;

      if(this.oldPoData.amountInWords == null || this.oldPoData.amountInWords == ""){
        if(this.oldPoData.currency == 'INR')
          this.oldfinalAmount = this.withDecimal(this.oldPoData.grandTotal);
        else
          this.oldfinalAmount = this.withDecimalUSD(this.oldPoData.grandTotal.toFixed(2));
      }
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  back() {
    debugger;
    if (this.route.snapshot.params.flag == "PO") {
      this.router.navigate(['/searchPurchaseOrder'])
    } else if (this.route.snapshot.params.flag == "POTASK") {
      this.router.navigate(['/searchTask'])
    }
    //this.router.navigate(['/searchPurchaseOrder'])
  }

  verifyPo = function () {
    debugger;
    this.DeleteMsg = 'Are you sure you want to verify this PO?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.VerifyEntity.entityId = this.route.snapshot.params.id;
          this.showLoading = true;
          this.purchaseOrderService.verifyPo(this.VerifyEntity, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = 'PO verified successfully.';
            this.dialogService.openConfirmDialog(this.successMessage);
            this.search(this.route.snapshot.params.id);
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      });
  }

  sendMail = function () {
    debugger;
    this.DeleteMsg = 'Do you want to send mail to vendor?';
    this.dialogService.openConfirmDialog(this.DeleteMsg)
      .afterClosed().subscribe(res => {
        if (res) {
          debugger;
          const headers = { "Authorization": sessionStorage.getItem("token") };
          this.showLoading = true;
          this.purchaseOrderService.sendMailToVendor(this.route.snapshot.params.id, headers).subscribe(resp => {
            debugger;
            this.showLoading = false;
            this.successMessage = 'Mail sent successfully.';
            this.dialogService.openConfirmDialog(this.successMessage);
            this.search(this.route.snapshot.params.id);
          }, (error: any) => {
            debugger;
            this.showLoading = false;
            const errStr = error.message;
            this.dialogService.openConfirmDialog(errStr);
          });
        }
      });
  }

  viewWorkflowHistory = function () {
    debugger;
    this.router.navigate(['/ViewWorkflow', this.route.snapshot.params.id, this.route.snapshot.params.flag]);
  }

  takeAction = function () {
    debugger;
    if(this.taskId != null){
      this.router.navigate(['/UpdatePoTask', this.taskId, 'edit', 'PO']);
    }
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

  //for converting number to words
  convertNumberToWords = function (amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';

    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + parseInt(n_array[j].toString());
            n_array[i] = 0;
          }
        }
      }

      var value = 0;

      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + " ";
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Crores ";
        }
        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Lakhs ";
        }
        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Thousand ";
        }
        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += "Hundred ";
        } else if (i == 6 && value != 0) {
          words_string += "Hundred ";
        }
      }

      words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }

  withDecimal = function (n) {
    debugger;
    var nums = n.toString().split('.')
    var whole = this.convertNumberToWords(nums[0])

    if (nums.length == 2) {
      var fraction = this.convertNumberToWords(nums[1])
      if (fraction == '') {
        return whole;
      } else {
        return whole + 'and ' + fraction;
      }
    } else {
      return whole;
    }
  }


  withDecimalUSD = function (n) {
    debugger;
    var nums = n.toString().split('.')
    var whole = this.USDtoWords(nums[0])

    if (nums.length == 2) {
      var fraction = this.USDtoWords(nums[1])
      if (fraction == '') {
        return whole;
      } else {
        return whole + 'and ' + fraction;
      }
    } else {
      return whole;
    }
  }

   //for converting number to words
  th = ['','thousand','million', 'billion','trillion'];
  dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine'];
  tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
  tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

  USDtoWords = function(s) {
    debugger;
    s = s.toString();
    //s = s.replace(/[\, ]/g,'');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1)
        x = s.length;
    if (x > 15)
        return 'too big';
    /*var nums = s.split('.');
    if (nums[1] == '00'){
        s = nums[0];
        x = s.length;
    }*/
    var n = s.split(''); 
    var str = '';
    var sk = 0;
    for (var i=0;   i < x;  i++) {
        if ((x-i)%3==2) { 
            if (n[i] == '1') {
                str += this.tn[Number(n[i+1])] + ' ';
                i++;
                sk=1;
            } else if (n[i]!=0) {
                str += this.tw[n[i]-2] + ' ';
                sk=1;
            }
        } else if (n[i]!=0) { // 0235
            str += this.dg[n[i]] +' ';
            if ((x-i)%3==0) str += 'hundred ';
            sk=1;
        }
        if ((x-i)%3==1) {
            if (sk)
                str += this.th[(x-i-1)/3] + ' ';
            sk=0;
        }
    }

    /*if (x != s.length) {
        var y = s.length;
        str += 'And ';
        for (let i=x+1; i<y; i++)
            str += this.dg[n[i]] +' ';
    }*/
    return str.replace(/\s+/g,' ');
}


  ngOnInit(): void {
    this.baseUrl = this._global.baseUrl;
    this.search(this.route.snapshot.params.id);
    this.taskId = sessionStorage.getItem("taskId");
  }

}
