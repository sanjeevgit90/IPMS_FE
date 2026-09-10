import { Component, Inject, OnInit, Optional } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppGlobals } from '../global/app.global';
import { DialogService } from '../service/dialog.service';
import { TravelReimbursementRejectDialogData } from './models/travel-reimbursement.model';
import { TravelReimbursementService } from './travel-reimbursement.service';

@Component({
  selector: 'app-travel-reimbursement-reject-dialog',
  templateUrl: './travel-reimbursement-reject-dialog.component.html',
  providers: [TravelReimbursementService, AppGlobals, DialogService],
  standalone: false
})
export class TravelReimbursementRejectDialogComponent implements OnInit {

  pageTitle = 'Reject Travel Reimbursement';
  showLoading = false;
  rejectForm!: UntypedFormGroup;
  successMessage = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private travelReimbursementService: TravelReimbursementService,
    private dialogService: DialogService,
    public dialogRef: MatDialogRef<TravelReimbursementRejectDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: TravelReimbursementRejectDialogData
  ) { }

  ngOnInit(): void {
    this.rejectForm = this.formBuilder.group({
      remark: [null]
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  reject(): void {
    const remark = this.rejectForm.value.remark?.trim() || null;
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    const body = remark ? { remark } : {};

    this.showLoading = true;
    this.travelReimbursementService.rejectTravelReimbursement(
      this.data.reimbursementId,
      body,
      headers
    ).subscribe({
      next: () => {
        this.showLoading = false;
        this.successMessage = 'Travel Reimbursement rejected successfully.';
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(() => {
            this.dialogRef.close(true);
          });
      },
      error: (error) => {
        this.showLoading = false;
        const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? 'Unable to reject travel reimbursement.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }
}
