import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AppGlobals } from '../global/app.global';
import { DialogService } from '../service/dialog.service';
import { SharedService } from '../service/shared.service';
import { TravelReimbursementService } from './travel-reimbursement.service';
import { TRAVEL_REIMBURSEMENT_APPROVAL_TASK_SESSION_KEY } from './travel-reimbursement.constants';
import { SelectionOption, TravelReimbursement } from './models/travel-reimbursement.model';

export interface SendForApprovalDialogData {
  reimbursementId: number;
}

@Component({
  selector: 'app-travel-reimbursement',
  templateUrl: './travel-reimbursement.component.html',
  providers: [TravelReimbursementService, AppGlobals, DialogService],
  standalone: false
})
export class TravelReimbursementComponent implements OnInit {

  displayedColumns: string[] = [
    'employeeName',
    'projectName',
    'cityVisited',
    'fromDate',
    'toDate',
    'totalAmount',
    'approvalStatus',
    'action'
  ];

  travelReimbursementList: MatTableDataSource<TravelReimbursement> =
    new MatTableDataSource<TravelReimbursement>([]);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  showLoading = false;
  totalRecords = 0;
  itemPerPage = this.global.pageNumer;
  pageSizedisplay = this.global.pageSize;
  PageTitle = 'Travel Reimbursement';

  travelReimbursementAdd = false;
  travelReimbursementEdit = false;
  travelReimbursementView = false;

  constructor(
    private router: Router,
    private travelReimbursementService: TravelReimbursementService,
    private global: AppGlobals,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.travelReimbursementAdd = this.global.UserRights?.includes('TRAVEL_REIMBURSEMENT_ADD') ?? true;
    this.travelReimbursementEdit = this.global.UserRights?.includes('TRAVEL_REIMBURSEMENT_EDIT') ?? true;
    this.travelReimbursementView = this.global.UserRights?.includes('TRAVEL_REIMBURSEMENT_VIEW') ?? true;
    this.loadList();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.travelReimbursementList.filter = filterValue.trim().toLowerCase();
    this.totalRecords = this.travelReimbursementList.filteredData.length;
  }

  addTravelReimbursement(): void {
    this.router.navigate(['/addTravelReimbursement']);
  }

  viewTravelReimbursement(row: TravelReimbursement): void {
    if (!row.entityId) {
      return;
    }
    sessionStorage.removeItem(TRAVEL_REIMBURSEMENT_APPROVAL_TASK_SESSION_KEY);
    this.router.navigate(['/updateTravelReimbursement', row.entityId, 'view']);
  }

  canSendForApproval(row: TravelReimbursement): boolean {
    const status = row.approvalStatus?.toUpperCase();
    return status === 'DRAFT' || status === 'REJECTED';
  }

   canEdit(row: TravelReimbursement): boolean {
    const status = row.approvalStatus?.toUpperCase();
    return status === 'DRAFT' || status === 'REJECTED';
  }

  openSendForApprovalDialog(row: TravelReimbursement): void {
    if (!row.entityId) {
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { reimbursementId: row.entityId };

    this.dialog.open(TravelReimbursementSendForApprovalDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          this.loadList();
        }
      });
  }

  loadList(): void {
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;
    this.travelReimbursementService.getMyTravelReimbursements(headers).subscribe({
      next: (resp) => {
        this.travelReimbursementList = new MatTableDataSource(resp ?? []);
        this.travelReimbursementList.sort = this.sort;
        this.travelReimbursementList.paginator = this.paginator;
        this.totalRecords = this.travelReimbursementList.data.length;
        this.showLoading = false;
      },
      error: (error) => {
        this.showLoading = false;
        const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? 'Unable to load travel reimbursements.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }
}

@Component({
  selector: 'app-travel-reimbursement-send-for-approval-dialog',
  template: `
    @if (showLoading) {
      <app-loader></app-loader>
    }
    <form [formGroup]="sendForApprovalForm">
      <mat-dialog-content class="mat-typography">
        <div class="page-header">
          <div class="row align-items-center">
            <div class="col">
              <h3 class="page-title">{{ pageTitle }}</h3>
            </div>
          </div>
        </div>
        <div class="tab-content">
          <div class="pro-overview tab-pane fade show active">
            <div class="card">
              <div class="card-body">
                <div class="col-md-12 mandatory">*Fields are Mandatory</div>
                <div class="row">
                  <div class="col-sm-12">
                    <div class="form-group">
                      <mat-form-field class="custom-field w-100"
                        [ngClass]="{ 'has-error': isSubmitted && formControls.approverUserId.errors }">
                        <mat-label>Reporting Manager/Approver</mat-label>
                        <mat-select formControlName="approverUserId" required>
                          @for (user of userList; track user.selectionid) {
                            <mat-option [value]="+user.selectionid" [matTooltip]="user.selectionvalue">
                              {{ user.selectionvalue }}
                            </mat-option>
                          }
                        </mat-select>
                      </mat-form-field>
                      @if (isSubmitted && formControls.approverUserId.errors) {
                        <div class="error-text">
                          @if (formControls.approverUserId.errors.required) {
                            <div>Reporting Manager/Approver is required</div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>
      <div class="clearfix"></div>
      <mat-dialog-actions>
        <div class="submit-section">
          <button mat-flat-button color="accent" type="button" (click)="submit()">
            <mat-icon aria-hidden="false">save</mat-icon> Submit
          </button>
          <button mat-flat-button color="warn" type="button" (click)="cancel()">
            <mat-icon aria-hidden="false">cancel</mat-icon> Cancel
          </button>
        </div>
      </mat-dialog-actions>
    </form>
  `,
  providers: [TravelReimbursementService, AppGlobals, DialogService, SharedService],
  standalone: false
})
export class TravelReimbursementSendForApprovalDialogComponent implements OnInit {

  pageTitle = 'Send For Approval';
  showLoading = false;
  isSubmitted = false;
  userList: SelectionOption[] = [];
  sendForApprovalForm!: UntypedFormGroup;
  successMessage = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private travelReimbursementService: TravelReimbursementService,
    private dialogService: DialogService,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<TravelReimbursementSendForApprovalDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: SendForApprovalDialogData
  ) { }

  ngOnInit(): void {
    this.sendForApprovalForm = this.formBuilder.group({
      approverUserId: [null, Validators.required]
    });
    this.loadUserList();
  }

  get formControls() {
    return this.sendForApprovalForm.controls;
  }

  loadUserList(): void {
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;
    this.sharedService.getActiveUserList(headers).subscribe({
      next: (resp: SelectionOption[]) => {
        this.userList = resp ?? [];
        this.showLoading = false;
      },
      error: (error) => {
        this.showLoading = false;
        const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? 'Unable to load users.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.isSubmitted = true;
    if (this.sendForApprovalForm.invalid) {
      return;
    }

    const approverUserId = Number(this.sendForApprovalForm.value.approverUserId);
    if (!approverUserId) {
      return;
    }

    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;
    this.travelReimbursementService.sendForApproval(
      this.data.reimbursementId,
      { approverUserId },
      headers
    ).subscribe({
      next: () => {
        this.showLoading = false;
        this.successMessage = 'Travel Reimbursement is successfully submitted for Approval.';
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(() => {
            this.dialogRef.close(true);
          });
      },
      error: (error) => {
        this.showLoading = false;
        const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? 'Unable to submit for approval.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }
}
