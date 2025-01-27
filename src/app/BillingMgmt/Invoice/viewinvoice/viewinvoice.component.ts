import { Component, OnInit, Inject, Optional, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { InvoiceService } from '../invoice.service';
import { SharedService } from '../../../service/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-viewinvoice',
  templateUrl: './viewinvoice.component.html',
  providers: [InvoiceService, AppGlobals, DialogService, SharedService]
})
export class ViewInvoiceComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private invoiceService: InvoiceService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService,
    public dialogRef: MatDialogRef<ViewInvoiceComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }


  showLoading: boolean = false;
  disable = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Invoice";

  InvoiceData = {
    "projectid": null, "pono": null, "customername": null, "customeraddress": null, "gstno": null, "panno": null, "milestoneno": null,
    "amountwithouttax": null, "amountwithtax": null, "totalamount": null, "invoicedate": null, "invoiceno": null, "invoiceexcel": null,
    "invoicesupportingdoc": null, "accountexcel": null
  };


  back = function () {
    this.dialogRef.close(false);
  }
  // Edit

  editon = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.invoiceService.viewInvoiceById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.InvoiceData = resp;
      this.InvoiceData.invoicedate = (new Date(this.InvoiceData.invoicedate));

    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {

    this.editon(this.data.id);

  }

}

