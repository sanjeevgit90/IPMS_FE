import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AppGlobals } from '../global/app.global';
import { DialogService } from '../service/dialog.service';
import { TravelReimbursementService } from './travel-reimbursement.service';
import { TravelReimbursementApprovalTask } from './models/travel-reimbursement.model';
import { TRAVEL_REIMBURSEMENT_APPROVAL_TASK_SESSION_KEY } from './travel-reimbursement.constants';
import { TravelReimbursementRejectDialogComponent } from './travel-reimbursement-reject-dialog.component';

@Component({
  selector: 'app-travel-reimbursement-approval-task',
  templateUrl: './travel-reimbursement-approval-task.component.html',
  providers: [TravelReimbursementService, AppGlobals, DialogService],
  standalone: false
})
export class TravelReimbursementApprovalTaskComponent implements OnInit {

  displayedColumns: string[] = [
    'employeeName',
    'cityVisited',
    'projectName',
    'fromDate',
    'toDate',
    'totalAmount',
    'approvalStatus',
    'action'
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
    sessionStorage.setItem(
      TRAVEL_REIMBURSEMENT_APPROVAL_TASK_SESSION_KEY,
      String(row.reimbursementId)
    );
    this.router.navigate(['/updateTravelReimbursement', row.reimbursementId, 'view'], {
      state: { source: 'APPROVAL_TASK' }
    });
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
