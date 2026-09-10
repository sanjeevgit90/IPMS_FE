import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AppGlobals } from '../global/app.global';
import { DialogService } from '../service/dialog.service';
import { TravelReimbursementService } from './travel-reimbursement.service';
import { SelectionOption, TravelReimbursementApprovalTask } from './models/travel-reimbursement.model';

export const BILL_ATTACHED_OPTIONS: SelectionOption[] = [
  { selectionid: 'Y', selectionvalue: 'Yes' },
  { selectionid: 'N', selectionvalue: 'No' }
];

export interface TravelReimbursementRejectDialogData {
  reimbursementId: number;
}

@Component({
  selector: 'app-travel-reimbursement-approval-task',
  template: `
    @if (showLoading) {
      <app-loader></app-loader>
    }
    <form>
      <div class="main-wrapper">
        <app-header></app-header>
        <app-leftmenu></app-leftmenu>
        <div class="page-wrapper">
          <div class="content container-fluid">
            <div class="page-header">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="page-title">{{ PageTitle }}</h3>
                  <ul class="breadcrumb">
                    <li class="breadcrumb-item"><a routerLink="/Dashboard">Dashboard</a></li>
                    <li class="breadcrumb-item active">{{ PageTitle }}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="tab-content">
              <div class="pro-overview tab-pane fade show active">
                <div class="card">
                  <div class="row align-items-center">
                    <div class="col"><div class="total-rec">Total Records: {{ totalRecords }}</div></div>
                    <div class="col-auto float-right ml-auto">
                      <mat-form-field class="search-input">
                        <input matInput (keyup)="applyFilter($event)" placeholder="Search..." />
                      </mat-form-field>
                    </div>
                  </div>
                  <table mat-table [dataSource]="taskList" matSort class="mat-elevation-z8">
                    <ng-container matColumnDef="employeeName">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Employee Name</th>
                      <td mat-cell *matCellDef="let row" data-label="Employee Name"><div class="block">{{ row.employeeName }}</div></td>
                    </ng-container>
                    <ng-container matColumnDef="employeeId">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Employee ID</th>
                      <td mat-cell *matCellDef="let row" data-label="Employee ID"><div class="block">{{ row.employeeId }}</div></td>
                    </ng-container>
                    <ng-container matColumnDef="cityVisited">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>City Visited</th>
                      <td mat-cell *matCellDef="let row" data-label="City Visited"><div class="block">{{ row.cityVisited }}</div></td>
                    </ng-container>
                    <ng-container matColumnDef="projectName">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Project Name</th>
                      <td mat-cell *matCellDef="let row" data-label="Project Name"><div class="block">{{ row.projectName }}</div></td>
                    </ng-container>
                    <ng-container matColumnDef="projectPin">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Project PIN</th>
                      <td mat-cell *matCellDef="let row" data-label="Project PIN"><div class="block">{{ row.projectPin }}</div></td>
                    </ng-container>
                    <ng-container matColumnDef="bandGrade">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Band/Grade</th>
                      <td mat-cell *matCellDef="let row" data-label="Band/Grade"><div class="block">{{ row.bandGrade }}</div></td>
                    </ng-container>
                    <ng-container matColumnDef="fromDate">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>From Date</th>
                      <td mat-cell *matCellDef="let row" data-label="From Date"><div class="block">{{ row.fromDate | date: 'dd/MM/yyyy' }}</div></td>
                    </ng-container>
                    <ng-container matColumnDef="toDate">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>To Date</th>
                      <td mat-cell *matCellDef="let row" data-label="To Date"><div class="block">{{ row.toDate | date: 'dd/MM/yyyy' }}</div></td>
                    </ng-container>
                    <ng-container matColumnDef="totalAmount">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Amount</th>
                      <td mat-cell *matCellDef="let row" data-label="Total Amount"><div class="block">{{ row.totalAmount | number: '1.2-2' }}</div></td>
                    </ng-container>
                    <ng-container matColumnDef="approvalStatus">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                      <td mat-cell *matCellDef="let row" data-label="Status">
                        <span [ngClass]="getStatusBadgeClass(row.approvalStatus)">{{ getStatusLabel(row.approvalStatus) }}</span>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="action">
                      <th mat-header-cell *matHeaderCellDef>Action</th>
                      <td mat-cell *matCellDef="let row">
                        <button mat-flat-button color="accent" [matMenuTriggerFor]="menu"><mat-icon>mouse</mat-icon> Action</button>
                        <mat-menu #menu="matMenu" class="actionmenu">
                          <button mat-menu-item matTooltip="View this record" (click)="viewTask(row)">
                            <mat-icon aria-hidden="false">visibility</mat-icon> View
                          </button>
                          @if (isPending(row)) {
                            <button mat-menu-item matTooltip="Approve this record" (click)="approveTask(row)">
                              <mat-icon aria-hidden="false">check_circle</mat-icon> Approve
                            </button>
                            <button mat-menu-item matTooltip="Reject this record" (click)="openRejectDialog(row)">
                              <mat-icon aria-hidden="false">cancel</mat-icon> Reject
                            </button>
                          }
                        </mat-menu>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                    <tr class="mat-row" *matNoDataRow>
                      <td class="mat-cell" [attr.colspan]="displayedColumns.length">{{ emptyMessage }}</td>
                    </tr>
                  </table>
                  <mat-paginator [pageSizeOptions]="itemPerPage" [pageSize]="pageSizedisplay" showFirstLastButtons></mat-paginator>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  `,
  providers: [TravelReimbursementService, AppGlobals, DialogService],
  standalone: false
})
export class TravelReimbursementApprovalTaskComponent implements OnInit {

  displayedColumns: string[] = [
    'employeeName', 'employeeId', 'cityVisited', 'projectName', 'projectPin',
    'bandGrade', 'fromDate', 'toDate', 'totalAmount', 'approvalStatus', 'action'
  ];

  taskList: MatTableDataSource<TravelReimbursementApprovalTask> =
    new MatTableDataSource<TravelReimbursementApprovalTask>([]);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  showLoading = false;
  totalRecords = 0;
  itemPerPage = this.global.pageNumer;
  pageSizedisplay = this.global.pageSize;
  PageTitle = 'Travel Reimbursement Approval Task';
  emptyMessage = 'No pending Travel Reimbursement approvals found.';
  successMessage = '';

  constructor(
    private router: Router,
    private travelReimbursementService: TravelReimbursementService,
    private global: AppGlobals,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTaskList();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.taskList.filter = filterValue.trim().toLowerCase();
    this.totalRecords = this.taskList.filteredData.length;
  }

  getStatusLabel(status?: string | null): string {
    if (status?.toUpperCase() === 'PENDING') {
      return 'Pending For Approval';
    }
    return status ?? '';
  }

  getStatusBadgeClass(status?: string | null): string {
    const normalizedStatus = status?.toUpperCase();
    if (normalizedStatus === 'PENDING') {
      return 'badge badge-warning';
    }
    if (normalizedStatus === 'APPROVED') {
      return 'badge badge-success';
    }
    if (normalizedStatus === 'REJECTED') {
      return 'badge badge-danger';
    }
    return 'badge badge-info';
  }

  isPending(row: TravelReimbursementApprovalTask): boolean {
    return row.approvalStatus?.toUpperCase() === 'PENDING';
  }

  viewTask(row: TravelReimbursementApprovalTask): void {
    if (!row.reimbursementId) {
      return;
    }
    this.router.navigate(['/updateTravelReimbursement', row.reimbursementId, 'view']);
  }

  approveTask(row: TravelReimbursementApprovalTask): void {
    if (!row.reimbursementId || !this.isPending(row)) {
      return;
    }

    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;
    this.travelReimbursementService.approveTravelReimbursement(row.reimbursementId, headers).subscribe({
      next: () => {
        this.showLoading = false;
        this.successMessage = 'Travel Reimbursement approved successfully.';
        this.dialogService.openConfirmDialog(this.successMessage)
          .afterClosed().subscribe(() => this.loadTaskList());
      },
      error: (error) => {
        this.showLoading = false;
        const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? 'Unable to approve travel reimbursement.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }

  openRejectDialog(row: TravelReimbursementApprovalTask): void {
    if (!row.reimbursementId || !this.isPending(row)) {
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { reimbursementId: row.reimbursementId };

    this.dialog.open(TravelReimbursementRejectDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          this.loadTaskList();
        }
      });
  }

  loadTaskList(): void {
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;
    this.travelReimbursementService.getPendingApprovalTasks(headers).subscribe({
      next: (resp) => {
        this.taskList = new MatTableDataSource(resp ?? []);
        this.taskList.sort = this.sort;
        this.taskList.paginator = this.paginator;
        this.totalRecords = this.taskList.data.length;
        this.showLoading = false;
      },
      error: (error) => {
        this.showLoading = false;
        const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? 'Unable to load approval tasks.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }
}

@Component({
  selector: 'app-travel-reimbursement-reject-dialog',
  template: `
    @if (showLoading) {
      <app-loader></app-loader>
    }
    <form [formGroup]="rejectForm">
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
                <div class="row">
                  <div class="col-sm-12">
                    <div class="form-group">
                      <mat-form-field class="custom-field w-100">
                        <mat-label>Remark</mat-label>
                        <textarea matInput formControlName="remark" maxlength="200" placeholder="Enter remark"></textarea>
                      </mat-form-field>
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
          <button mat-flat-button color="warn" type="button" (click)="reject()">
            <mat-icon aria-hidden="false">cancel</mat-icon> Reject
          </button>
          <button mat-flat-button color="accent" type="button" (click)="cancel()">
            <mat-icon aria-hidden="false">close</mat-icon> Cancel
          </button>
        </div>
      </mat-dialog-actions>
    </form>
  `,
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
