import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { TravelReimbursementExportData, TravelReimbursementExportItem } from './models/travel-reimbursement-export.model';

@Injectable({
  providedIn: 'root'
})
export class TravelReimbursementExportService {

  private readonly templatePath = 'assets/templates/travel-reimbursement-expense-report.xlsx';
  private readonly sheetName = 'Domestic';

  private readonly dataStartRow = 13;
  private readonly fixedTotalRow = 26;
  private readonly fixedSignatureLabelRow = 30;
  private readonly fixedSignatureValueRow = 31;
  private readonly fixedNotesTitleRow = 33;
  private readonly templateDataRowCount = 13;

  constructor(private http: HttpClient) { }

  exportTravelReimbursement(data: TravelReimbursementExportData): Observable<void> {
    return this.http.get(this.templatePath, { responseType: 'arraybuffer' }).pipe(
      switchMap((buffer) => from(this.generateWorkbook(buffer, data))),
      catchError(() => throwError(() => new Error('Failed to export travel reimbursement to Excel.')))
    );
  }

  private async generateWorkbook(buffer: ArrayBuffer, data: TravelReimbursementExportData): Promise<void> {
    const workbook = XLSX.read(buffer, { type: 'array', cellStyles: true });
    const worksheet = workbook.Sheets[this.sheetName];

    if (!worksheet) {
      throw new Error(`Worksheet "${this.sheetName}" was not found in the export template.`);
    }

    this.populateHeader(worksheet, data);
    this.clearTemplateDataRows(worksheet);

    const activeItems = data.items ?? [];
    activeItems.forEach((item, index) => {
      this.populateExpenseRow(worksheet, this.dataStartRow + index, item);
    });

    const totalAmount = this.calculateTotalAmount(activeItems);
    const totalRow = activeItems.length > this.templateDataRowCount
      ? this.dataStartRow + activeItems.length + 1
      : this.fixedTotalRow;

    this.populateTotalRow(worksheet, totalRow, totalAmount);
    if (totalRow !== this.fixedTotalRow) {
      this.clearFixedSignatureAndNotes(worksheet);
    }
    this.populateSignatureSection(worksheet, totalRow, data);
    this.populateNotesSection(worksheet, totalRow);
    this.updateSheetRange(worksheet);

    XLSX.writeFile(workbook, this.buildFilename(data));
  }

  private populateHeader(worksheet: XLSX.WorkSheet, data: TravelReimbursementExportData): void {
    this.setCellAddress(worksheet, 'A6', `Emp. Name: ${this.displayValue(data.employeeName)}`);
    this.setCellAddress(worksheet, 'A7', `Emp. ID: ${this.displayValue(data.employeeId)}`);
    this.setCellAddress(worksheet, 'D7', `Band: ${this.displayValue(data.bandGrade)}`);
    this.setCellAddress(worksheet, 'F7', 'Grade:');
    this.setCellAddress(worksheet, 'A8', `City Visited: ${this.displayValue(data.cityVisited)}`);
    this.setCellAddress(worksheet, 'A9', `Project Name:- ${this.displayValue(data.projectName)}`);
    this.setCellAddress(worksheet, 'A10', `Project PIN:-  ${this.displayValue(data.projectPin)}`);
    this.setCellAddress(worksheet, 'A11', 'From Date :');
    this.setCellAddress(worksheet, 'B11', this.toExcelDate(data.fromDate), 'n');
    this.setCellAddress(worksheet, 'C11', 'To Date:');
    this.setCellAddress(worksheet, 'D11', this.toExcelDate(data.toDate), 'n');
  }

  private clearTemplateDataRows(worksheet: XLSX.WorkSheet): void {
    for (let row = this.dataStartRow; row < this.dataStartRow + this.templateDataRowCount; row++) {
      this.clearCellAt(worksheet, row, 0);
      this.clearCellAt(worksheet, row, 1);
      this.clearCellAt(worksheet, row, 5);
      this.clearCellAt(worksheet, row, 6);
      this.clearCellAt(worksheet, row, 7);
    }

    this.clearCellAt(worksheet, this.fixedTotalRow, 1);
    this.clearCellAt(worksheet, this.fixedTotalRow, 5);
  }

  private populateExpenseRow(worksheet: XLSX.WorkSheet, row: number, item: TravelReimbursementExportItem): void {
    this.setCellAt(worksheet, row, 0, this.toExcelDate(item.expenseDate), 'n');
    this.setCellAt(worksheet, row, 1, this.displayValue(item.particular));
    this.setCellAt(worksheet, row, 5, this.toNumber(item.amount), 'n');
    this.setCellAt(worksheet, row, 6, this.displayValue(item.remarks));
    this.setCellAt(worksheet, row, 7, this.displayBillAttached(item.billAttached));
  }

  private populateTotalRow(worksheet: XLSX.WorkSheet, row: number, totalAmount: number): void {
    if (row !== this.fixedTotalRow) {
      this.clearCellAt(worksheet, this.fixedTotalRow, 1);
      this.clearCellAt(worksheet, this.fixedTotalRow, 5);
    }

    this.setCellAt(worksheet, row, 1, 'Balance Amount Receivable/Payable:');
    this.setCellAt(worksheet, row, 5, totalAmount, 'n');
  }

  private populateSignatureSection(
    worksheet: XLSX.WorkSheet,
    totalRow: number,
    data: TravelReimbursementExportData
  ): void {
    const labelRow = totalRow === this.fixedTotalRow
      ? this.fixedSignatureLabelRow
      : totalRow + 4;
    const valueRow = labelRow + 1;

    this.setCellAt(worksheet, labelRow, 0, 'Prepared By: ');
    this.setCellAt(worksheet, labelRow, 3, 'Verified By: ');
    this.setCellAt(worksheet, labelRow, 6, 'Approved By: ');

    this.setCellAt(worksheet, valueRow, 0, 'Name & Signature');
    this.setCellAt(worksheet, valueRow, 1, this.displayValue(data.preparedBy));
    this.setCellAt(worksheet, valueRow, 3, 'Name & Signature');
    this.setCellAt(worksheet, valueRow, 6, 'Name & Signature');
    this.setCellAt(worksheet, valueRow, 7, this.displayValue(data.approvedBy));
  }

  private clearFixedSignatureAndNotes(worksheet: XLSX.WorkSheet): void {
    for (let row = this.fixedSignatureLabelRow; row <= this.fixedNotesTitleRow + 5; row++) {
      for (let col = 0; col <= 7; col++) {
        this.clearCellAt(worksheet, row, col);
      }
    }
  }

  private populateNotesSection(worksheet: XLSX.WorkSheet, totalRow: number): void {
    const notesTitleRow = totalRow === this.fixedTotalRow
      ? this.fixedNotesTitleRow
      : totalRow + 7;
    const notes: string[] = [
      'FILL SEPARATE FORMS FOR DIFFERENT TRIPS. ',
      'ATTACH COPIES OF BOARDING PASS/TRAIN TICKETS.',
      'ATTACH LIST OF DATES AND AMOUNTS RECEIVED FROM THE COMPANY.',
      'ALL BILLS/RECEIPTS ARE TO BE ATTACHED.',
      'FOR PER DIEM CLAIM ATTACH SEPARATE FORM WITH TIME SHEET DULY APPROVED AND VERIFIED BY PM & HR'
    ];

    this.setCellAt(worksheet, notesTitleRow, 0, 'Notes');
    notes.forEach((note, index) => {
      this.setCellAt(worksheet, notesTitleRow + 1 + index, 0, index + 1, 'n');
      this.setCellAt(worksheet, notesTitleRow + 1 + index, 1, note);
    });
  }

  private calculateTotalAmount(items: TravelReimbursementExportItem[]): number {
    return items.reduce((sum, item) => {
      const amount = this.toNumber(item.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  }

  buildFilename(data: TravelReimbursementExportData): string {
    const reimbursementNumber = data.entityId ? String(data.entityId) : '';
    if (reimbursementNumber) {
      return this.sanitizeFilename(`Travel-Reimbursement-${reimbursementNumber}.xlsx`);
    }

    const employeeName = this.sanitizeFilename(this.displayValue(data.employeeName).replace(/\s+/g, '-'));
    const datePart = this.formatDateForFilename(data.fromDate);
    return this.sanitizeFilename(`Travel-Reimbursement-${employeeName}-${datePart}.xlsx`);
  }

  private sanitizeFilename(value: string): string {
    return value.replace(/[<>:"/\\|?*]+/g, '').trim() || 'Export';
  }

  private formatDateForFilename(epoch: number | null): string {
    if (!epoch) {
      return 'date';
    }

    const date = new Date(epoch);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private displayValue(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    return String(value);
  }

  private displayBillAttached(value: string | null | undefined): string {
    if (value === 'Y') {
      return 'Y';
    }
    if (value === 'N') {
      return 'N';
    }
    return this.displayValue(value);
  }

  private toNumber(value: number | null | undefined): number {
    const parsed = Number(value ?? 0);
    return isNaN(parsed) ? 0 : parsed;
  }

  private toExcelDate(epoch: number | null | undefined): number | '' {
    if (!epoch) {
      return '';
    }

    const date = new Date(epoch);
    if (isNaN(date.getTime())) {
      return '';
    }

    const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return (utcDate - Date.UTC(1899, 11, 30)) / 86400000;
  }

  private setCellAddress(
    worksheet: XLSX.WorkSheet,
    address: string,
    value: string | number,
    type: 's' | 'n' = 's'
  ): void {
    if (value === '') {
      delete worksheet[address];
      return;
    }

    worksheet[address] = { t: type, v: value };
  }

  private setCellAt(
    worksheet: XLSX.WorkSheet,
    row: number,
    col: number,
    value: string | number,
    type: 's' | 'n' = 's'
  ): void {
    const address = XLSX.utils.encode_cell({ r: row, c: col });
    this.setCellAddress(worksheet, address, value, type);
  }

  private clearCellAt(worksheet: XLSX.WorkSheet, row: number, col: number): void {
    const address = XLSX.utils.encode_cell({ r: row, c: col });
    delete worksheet[address];
  }

  private updateSheetRange(worksheet: XLSX.WorkSheet): void {
    const cellAddresses = Object.keys(worksheet).filter((key) => !key.startsWith('!'));
    if (!cellAddresses.length) {
      return;
    }

    const range = { s: { r: Number.MAX_SAFE_INTEGER, c: Number.MAX_SAFE_INTEGER }, e: { r: 0, c: 0 } };
    cellAddresses.forEach((address) => {
      const decoded = XLSX.utils.decode_cell(address);
      range.s.r = Math.min(range.s.r, decoded.r);
      range.s.c = Math.min(range.s.c, decoded.c);
      range.e.r = Math.max(range.e.r, decoded.r);
      range.e.c = Math.max(range.e.c, decoded.c);
    });

    worksheet['!ref'] = XLSX.utils.encode_range(range);
  }
}
