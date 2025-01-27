import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { PoFulfilmentService } from '../po-fulfilment.service';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-add-po-fulfilment',
  templateUrl: './add-po-fulfilment.component.html',
  providers: [PoFulfilmentService, AppGlobals, DialogService, SharedService]

})
export class AddPoFulfilmentComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private poFulfilmentService: PoFulfilmentService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;

  PageTitle = "Add PO Fulfilment";
  add = true;
  edit = false;
  list = true;

  PoFulfilmentData = {
    "fulfilmentDate": null, "delayReason": null, "nextdeliveryDate": null,
    "delayCategory": null, "purchaseOrderNo": null
  };
  addPoFulfilmentForm: FormGroup;
  isSubmitted = false;

  back = function () {
    if (this.route.snapshot.params.page == 'edit') {
      this.router.navigate(['searchPurchaseOrder/searchPoFulfilment', this.PoFulfilmentData.purchaseOrderNo, 'list']);
    } else if (this.route.snapshot.params.page == 'add') {
      this.router.navigate(['searchPurchaseOrder/searchPoFulfilment', this.route.snapshot.params.id, 'list']);
    }
  }

  addPoFulfilment = function (flag) {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    if (this.addPoFulfilmentForm.invalid) {
      return;
    }
    this.PoFulfilmentData.fulfilmentDate = this.PoFulfilmentData.fulfilmentDate.getTime();
    this.PoFulfilmentData.nextdeliveryDate = this.PoFulfilmentData.nextdeliveryDate.getTime();
    if (flag == "save") {
      this.PoFulfilmentData.purchaseOrderNo = this.route.snapshot.params.id;
    }
    this.showLoading = true;
    this.poFulfilmentService.saveFulfilment(this.PoFulfilmentData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "PO Fulfilment " + flag + "d successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addPoFulfilmentForm.reset();
          if (flag == "save") {
            this.router.navigate(['searchPurchaseOrder/searchPoFulfilment', this.route.snapshot.params.id, 'list']);
          } else if (flag == "update") {
            this.router.navigate(['searchPurchaseOrder/searchPoFulfilment', this.PoFulfilmentData.purchaseOrderNo, 'list']);
          }
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  // Edit
  editon = function (id) {
    debugger;
    this.add = false;
    this.edit = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.poFulfilmentService.getFulfilmentById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.PoFulfilmentData = resp;
      this.PoFulfilmentData.fulfilmentDate = (new Date(this.PoFulfilmentData.fulfilmentDate));
      this.PoFulfilmentData.nextdeliveryDate = (new Date(this.PoFulfilmentData.nextdeliveryDate));
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.addPoFulfilmentForm = this.formBuilder.group({
      fulfilmentDate: [null, Validators.required],
      delayReason: [null, Validators.required],
      nextdeliveryDate: [null, Validators.required],
      delayCategory: [null]
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update PO Fulfilment";
      this.editon(this.route.snapshot.params.id);
    }

  }
  get formControls() {
    return this.addPoFulfilmentForm.controls;
  }

}