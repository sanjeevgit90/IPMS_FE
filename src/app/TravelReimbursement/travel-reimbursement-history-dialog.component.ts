import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppGlobals } from '../global/app.global';
import { DialogService } from '../service/dialog.service';
import {
  TravelReimbursementHistoryDialogData,
  TravelReimbursementHistoryItem
} from './models/travel-reimbursement.model';
import { TravelReimbursementService } from './travel-reimbursement.service';

@Component({
  selector: 'app-travel-reimbursement-history-dialog',
  templateUrl: './travel-reimbursement-history-dialog.component.html',
  styleUrls: ['./travel-reimbursement-history-dialog.component.css'],
  providers: [TravelReimbursementService, AppGlobals, DialogService],
  standalone: false
})
export class TravelReimbursementHistoryDialogComponent implements OnInit {

  pageTitle = 'Travel Reimbursement History';
  showLoading = false;
  contextLine = '';
  historyList: TravelReimbursementHistoryItem[] = [];
  displayedColumns: string[] = ['status', 'actionBy', 'actionDate', 'remarks'];

  constructor(
    private travelReimbursementService: TravelReimbursementService,
    private dialogService: DialogService,
    public dialogRef: MatDialogRef<TravelReimbursementHistoryDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: TravelReimbursementHistoryDialogData
  ) { }

  ngOnInit(): void {
    this.contextLine = this.buildContextLine();
    this.loadHistory();
  }

  close(): void {
    this.dialogRef.close();
  }

  getStatusLabel(row: TravelReimbursementHistoryItem): string {
    const raw = row.approvalStatus ?? row.status ?? row.action ?? '';
    const normalized = raw?.toUpperCase();
    switch (normalized) {
      case 'DRAFT':
        return 'Draft';
      case 'PENDING':
        return 'Pending For Approval';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return raw?.trim() ? raw : '-';
    }
  }

  getActionBy(row: TravelReimbursementHistoryItem): string {
    const value = row.actionBy ?? row.actionedBy ?? row.updatedBy ?? row.createdBy;
    return value?.trim() ? value : '-';
  }

  getActionDate(row: TravelReimbursementHistoryItem): number | null {
    const value = row.actionDate ?? row.actionedOn ?? row.updatedDate ?? row.createdDate;
    return value ?? null;
  }

  getRemarks(row: TravelReimbursementHistoryItem): string {
    const value = row.remark ?? row.remarks;
    return value?.trim() ? value : '-';
  }

  private loadHistory(): void {
    const reimbursementId = this.data?.reimbursementId;
    if (!reimbursementId) {
      return;
    }

    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;
    this.travelReimbursementService.getTravelReimbursementHistory(reimbursementId, headers).subscribe({
      next: (resp) => {
        this.historyList = this.sortHistoryOldestFirst(resp ?? []);
        this.showLoading = false;
      },
      error: (error) => {
        this.showLoading = false;
        const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? 'Unable to load travel reimbursement history.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }

  private sortHistoryOldestFirst(items: TravelReimbursementHistoryItem[]): TravelReimbursementHistoryItem[] {
    return items.slice().sort((left, right) => {
      const leftDate = this.getActionDate(left) ?? 0;
      const rightDate = this.getActionDate(right) ?? 0;
      return leftDate - rightDate;
    });
  }

  private buildContextLine(): string {
    const parts: string[] = [];
    if (this.data?.employeeName) {
      parts.push(this.data.employeeName);
    }
    if (this.data?.reimbursementId) {
      parts.push(`Reimbursement #${this.data.reimbursementId}`);
    }
    return parts.join(' | ');
  }
}
