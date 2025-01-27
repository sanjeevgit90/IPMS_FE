import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { SharedService } from '../../../service/shared.service';
import { BoqMasterService } from '../../../OrderMgmt/boq-master/boq-master.service';

@Component({
  selector: 'app-add-boq',
  templateUrl: './add-boq.component.html',
  providers: [BoqMasterService, AppGlobals, DialogService, SharedService]
})
export class AddBoqComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private boqMasterService: BoqMasterService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;

  totalRecords: any;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;


  PageTitle = "Add Boq";
  add = true;
  edit = false;
  list = true;

  BoqEntityData = {
    "boqNo": "", "accountId": "", "boqDate": ""
  };

  projectList = {};

  addBoqForm: FormGroup;
  isSubmitted = false;

  cancel = function () {
    this.router.navigate(['/SearchBoq']);
  }

  // getting project list
  getAllProjects = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getProjectList(headers).subscribe(resp => {
      debugger;
      this.projectList = resp;
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.message;
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  saveBoq = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };

    this.BoqEntityData.boqDate = this.BoqEntityData.boqDate.getTime();
    if (this.addBoqForm.invalid) {
      return;
    }
    this.showLoading = true;
    this.boqMasterService.saveBoq(this.BoqEntityData, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Boq created successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addBoqForm.reset();
        })
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  updateBoq = function () {
    debugger;
    this.isSubmitted = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };

    this.BoqEntityData.boqDate = this.BoqEntityData.boqDate.getTime();
    if (this.addBoqForm.invalid) {
      return;
    }
    this.showLoading = true;
    this.boqMasterService.updateBoq(this.BoqEntityData, headers, this.BoqEntityData.entityId).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Boq updated successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addBoqForm.reset();
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
    this.boqMasterService.getBoqById(id, headers).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.BoqEntityData = resp;
      this.BoqEntityData.boqDate = (new Date(this.BoqEntityData.boqDate));
    }, (error: any) => {
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  ngOnInit(): void {
    this.addBoqForm = this.formBuilder.group({
      boqNo: ['', Validators.required],
      accountId: ['', Validators.required],
      boqDate: ['', Validators.required]
    });

    if (this.route.snapshot.params.page == 'edit') {
      this.PageTitle = "Update Boq";
      this.editon(this.route.snapshot.params.id);
    }

    this.getAllProjects();
  }
  get formControls() {
    return this.addBoqForm.controls;
  }
}