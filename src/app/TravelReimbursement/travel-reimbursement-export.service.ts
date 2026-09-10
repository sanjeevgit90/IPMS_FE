import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import * as ExcelJS from 'exceljs';
import { TravelReimbursementExportData, TravelReimbursementExportItem } from './models/travel-reimbursement-export.model';

type BorderStyle = ExcelJS.BorderStyle;

interface SheetLayout {
  titleRow: number;
  infoStartRow: number;
  tableHeaderRow: number;
  dataStartRow: number;
  totalRow: number;
  signatureLabelRow: number;
  signatureNameRow: number;
  lastRow: number;
  lastCol: number;
}

@Injectable({
  providedIn: 'root'
})
export class TravelReimbursementExportService {

  private readonly sheetName = 'Travel Reimbursement';
  private readonly logoPath = 'assets/Images/letterhead/AurionPro-logo1.png';

  private readonly fontFamily = 'Calibri';
  private readonly dateNumFmt = 'dd-mm-yyyy';
  private readonly amountNumFmt = '#,##0.00';

  private readonly thinBorder: Partial<ExcelJS.Border> = { style: 'thin' as BorderStyle, color: { argb: 'FF808080' } };
  private readonly mediumBorder: Partial<ExcelJS.Border> = { style: 'medium' as BorderStyle, color: { argb: 'FF404040' } };

  private readonly exportNotes: string[] = [
    'FILL SEPARATE FORMS FOR DIFFERENT TRIPS.',
    'ATTACH COPIES OF BOARDING PASS/TRAIN TICKETS.',
    'ATTACH LIST OF DATES AND AMOUNTS RECEIVED FROM THE COMPANY.',
    'ALL BILLS/RECEIPTS ARE TO BE ATTACHED.',
    'FOR PER DIEM CLAIM ATTACH SEPARATE FORM WITH TIME SHEET DULY APPROVED AND VERIFIED BY PM & HR'
  ];

  constructor(private http: HttpClient) { }

  exportTravelReimbursement(data: TravelReimbursementExportData): Observable<void> {
    return forkJoin({
      logo: this.http.get(this.logoPath, { responseType: 'arraybuffer' })
    }).pipe(
      switchMap(({ logo }) => from(this.generateWorkbook(logo, data))),
      catchError(() => throwError(() => new Error('Failed to export travel reimbursement to Excel.')))
    );
  }

  private async generateWorkbook(logoBuffer: ArrayBuffer, data: TravelReimbursementExportData): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'IPMS';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(this.sheetName, {
      pageSetup: {
        paperSize: 9,
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
          left: 0.4,
          right: 0.4,
          top: 0.5,
          bottom: 0.5,
          header: 0.3,
          footer: 0.3
        },
        showGridLines: false
      },
      views: [{ showGridLines: false }]
    });

    this.configureColumns(worksheet);
    this.addLogo(workbook, worksheet, logoBuffer);

    const activeItems = data.items ?? [];
    const layout = this.buildDocumentLayout(activeItems.length);

    this.populateTitle(worksheet, layout);
    this.populateEmployeeInfo(worksheet, layout, data);
    this.populateTableHeader(worksheet, layout);
    this.populateExpenseRows(worksheet, layout, activeItems);

    this.populateTotalRow(worksheet, layout, data.totalAmount);
    this.populateSignatureSection(worksheet, layout, data);
    const lastRow = this.populateNotesSection(worksheet, layout);
    this.applyPrintSettings(worksheet, layout, lastRow);

    const buffer = await workbook.xlsx.writeBuffer();
    this.downloadWorkbook(buffer, this.buildFilename(data));
  }

  private configureColumns(worksheet: ExcelJS.Worksheet): void {
    worksheet.columns = [
      { key: 'date', width: 13 },
      { key: 'particular', width: 32 },
      { key: 'amount', width: 14 },
      { key: 'remarks', width: 28 },
      { key: 'billAttached', width: 14 },
      { key: 'billFileName', width: 28 }
    ];
  }

  private addLogo(workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet, logoBuffer: ArrayBuffer): void {
    const logoWidth = 155;
    const logoHeight = 46;
    const imageId = workbook.addImage({
      buffer: logoBuffer,
      extension: 'png'
    });

    worksheet.getRow(1).height = 18;
    worksheet.getRow(2).height = 18;
    worksheet.getRow(3).height = 18;

    const logoStartCol = this.getRightAlignedImageColumn(worksheet, 6, logoWidth);

    worksheet.addImage(imageId, {
      tl: { col: logoStartCol, row: 0.15 },
      ext: { width: logoWidth, height: logoHeight }
    });
  }

  private getRightAlignedImageColumn(worksheet: ExcelJS.Worksheet, lastCol: number, imageWidthPx: number): number {
    const pixelsPerWidthUnit = 7;
    let totalWidthPx = 0;

    for (let col = 1; col <= lastCol; col++) {
      totalWidthPx += (worksheet.getColumn(col).width ?? 10) * pixelsPerWidthUnit;
    }

    const leftPx = Math.max(0, totalWidthPx - imageWidthPx);
    let accumulatedPx = 0;

    for (let col = 1; col <= lastCol; col++) {
      const columnWidthPx = (worksheet.getColumn(col).width ?? 10) * pixelsPerWidthUnit;
      if (accumulatedPx + columnWidthPx >= leftPx) {
        const offsetInCol = (leftPx - accumulatedPx) / columnWidthPx;
        return col - 1 + offsetInCol;
      }
      accumulatedPx += columnWidthPx;
    }

    return lastCol - 1;
  }

  private buildDocumentLayout(itemCount: number): SheetLayout {
    const tableHeaderRow = 10;
    const dataStartRow = tableHeaderRow + 1;
    const dataEndRow = dataStartRow + Math.max(itemCount, 1) - 1;
    const totalRow = dataEndRow + 2;
    const signatureLabelRow = totalRow + 2;
    const signatureNameRow = signatureLabelRow + 1;

    return {
      titleRow: 4,
      infoStartRow: 5,
      tableHeaderRow,
      dataStartRow,
      totalRow,
      signatureLabelRow,
      signatureNameRow,
      lastRow: signatureNameRow + 1,
      lastCol: 6
    };
  }

  private populateTitle(worksheet: ExcelJS.Worksheet, layout: SheetLayout): void {
    worksheet.mergeCells(layout.titleRow, 1, layout.titleRow, layout.lastCol);
    const titleCell = worksheet.getCell(layout.titleRow, 1);
    titleCell.value = 'TRAVEL REIMBURSEMENT';
    titleCell.font = { name: this.fontFamily, size: 16, bold: true, color: { argb: 'FF1F3864' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(layout.titleRow).height = 28;
  }

  private populateEmployeeInfo(
    worksheet: ExcelJS.Worksheet,
    layout: SheetLayout,
    data: TravelReimbursementExportData
  ): void {
    const infoRows: Array<Array<{ label: string; value: string | number }>> = [
      [
        { label: 'Reimbursement No.', value: this.displayValue(data.entityId) },
        { label: 'Employee Name', value: this.displayValue(data.employeeName) }
      ],
      [
        { label: 'Employee ID', value: this.displayValue(data.employeeId) },
        { label: 'Band / Grade', value: this.displayValue(data.bandGrade) }
      ],
      [
        { label: 'City Visited', value: this.displayValue(data.cityVisited) },
        { label: 'Project Name', value: this.displayValue(data.projectName) }
      ],
      [
        { label: 'Project PIN', value: this.displayValue(data.projectPin) },
        { label: 'Travel Period', value: this.formatTravelPeriod(data.fromDate, data.toDate) }
      ]
    ];

    infoRows.forEach((pairs, index) => {
      const rowNumber = layout.infoStartRow + index;
      const row = worksheet.getRow(rowNumber);
      row.height = 20;

      this.setInfoPair(worksheet, rowNumber, 1, 2, pairs[0].label, pairs[0].value);
      this.setInfoPair(worksheet, rowNumber, 4, 2, pairs[1].label, pairs[1].value);
    });
  }

  private setInfoPair(
    worksheet: ExcelJS.Worksheet,
    rowNumber: number,
    labelCol: number,
    valueSpan: number,
    label: string,
    value: string | number
  ): void {
    const labelCell = worksheet.getCell(rowNumber, labelCol);
    labelCell.value = `${label}:`;
    labelCell.font = { name: this.fontFamily, size: 10, bold: true };
    labelCell.alignment = { horizontal: 'left', vertical: 'middle' };

    const valueStartCol = labelCol + 1;
    const valueEndCol = valueStartCol + valueSpan - 1;
    worksheet.mergeCells(rowNumber, valueStartCol, rowNumber, valueEndCol);
    const valueCell = worksheet.getCell(rowNumber, valueStartCol);
    valueCell.value = value;
    valueCell.font = { name: this.fontFamily, size: 10 };
    valueCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
  }

  private populateTableHeader(worksheet: ExcelJS.Worksheet, layout: SheetLayout): void {
    const headers = ['Date', 'Particular', 'Amount', 'Remarks', 'Bill Attached', 'Bill File Name'];
    const row = worksheet.getRow(layout.tableHeaderRow);
    row.height = 22;

    headers.forEach((header, index) => {
      const cell = row.getCell(index + 1);
      cell.value = header;
      cell.font = { name: this.fontFamily, size: 11, bold: true, color: { argb: 'FF1F3864' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE9EDF4' }
      };
      cell.alignment = {
        horizontal: index === 2 ? 'center' : index === 4 ? 'center' : 'center',
        vertical: 'middle',
        wrapText: true
      };
      this.applyCellBorder(cell, this.mediumBorder);
    });
  }

  private populateExpenseRows(
    worksheet: ExcelJS.Worksheet,
    layout: SheetLayout,
    items: TravelReimbursementExportItem[]
  ): void {
    const rowsToRender = items.length > 0 ? items : [this.createEmptyExpenseItem()];

    rowsToRender.forEach((item, index) => {
      const rowNumber = layout.dataStartRow + index;
      const row = worksheet.getRow(rowNumber);
      const rowHeight = this.calculateRowHeight(item);
      row.height = rowHeight;

      this.setExpenseCell(worksheet, rowNumber, 1, this.toExcelDate(item.expenseDate), 'date');
      this.setExpenseCell(worksheet, rowNumber, 2, this.displayValue(item.particular), 'text');
      this.setExpenseCell(worksheet, rowNumber, 3, this.toNumber(item.amount), 'amount');
      this.setExpenseCell(worksheet, rowNumber, 4, this.displayValue(item.remarks), 'text');
      this.setExpenseCell(worksheet, rowNumber, 5, this.displayBillAttached(item.billAttached), 'center');
      this.setExpenseCell(worksheet, rowNumber, 6, this.displayValue(item.billFileName), 'text');
    });
  }

  private setExpenseCell(
    worksheet: ExcelJS.Worksheet,
    rowNumber: number,
    colNumber: number,
    value: string | number | Date | null,
    kind: 'date' | 'amount' | 'text' | 'center'
  ): void {
    const cell = worksheet.getCell(rowNumber, colNumber);
    cell.value = value === '' ? null : value;
    cell.font = { name: this.fontFamily, size: 10 };
    cell.border = this.fullBorder(this.thinBorder);

    if (kind === 'date') {
      cell.numFmt = this.dateNumFmt;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      return;
    }

    if (kind === 'amount') {
      cell.numFmt = this.amountNumFmt;
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
      return;
    }

    if (kind === 'center') {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      return;
    }

    cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
  }

  private populateTotalRow(worksheet: ExcelJS.Worksheet, layout: SheetLayout, totalAmount: number): void {
    const row = worksheet.getRow(layout.totalRow);
    row.height = 24;

    worksheet.mergeCells(layout.totalRow, 1, layout.totalRow, 2);
    const labelCell = worksheet.getCell(layout.totalRow, 1);
    labelCell.value = 'TOTAL AMOUNT';
    labelCell.font = { name: this.fontFamily, size: 12, bold: true, color: { argb: 'FF1F3864' } };
    labelCell.alignment = { horizontal: 'right', vertical: 'middle' };
    this.applyCellBorder(labelCell, this.mediumBorder);

    worksheet.mergeCells(layout.totalRow, 3, layout.totalRow, layout.lastCol);
    const amountCell = worksheet.getCell(layout.totalRow, 3);
    amountCell.value = totalAmount;
    amountCell.numFmt = this.amountNumFmt;
    amountCell.font = { name: this.fontFamily, size: 12, bold: true };
    amountCell.alignment = { horizontal: 'right', vertical: 'middle' };
    amountCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF4F6F9' }
    };
    this.applyCellBorder(amountCell, this.mediumBorder);

    for (let col = 4; col <= layout.lastCol; col++) {
      const borderCell = worksheet.getCell(layout.totalRow, col);
      borderCell.alignment = { vertical: 'middle' };
      this.applyCellBorder(borderCell, this.mediumBorder);
      borderCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF4F6F9' }
      };
    }
  }

  private populateSignatureSection(
    worksheet: ExcelJS.Worksheet,
    layout: SheetLayout,
    data: TravelReimbursementExportData
  ): void {
    const headers = ['Prepared By', 'Signature', 'Verified By', 'Signature', 'Approved By', 'Signature'];
    const names = [
      this.displayValue(data.preparedBy),
      '',
      this.displayValue(data.verifiedBy),
      '',
      this.displayValue(data.approvedBy),
      ''
    ];

    const labelRow = worksheet.getRow(layout.signatureLabelRow);
    labelRow.height = 20;
    headers.forEach((header, index) => {
      const cell = labelRow.getCell(index + 1);
      cell.value = header;
      cell.font = { name: this.fontFamily, size: 10, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      this.applyCellBorder(cell, this.thinBorder);
    });

    const nameRow = worksheet.getRow(layout.signatureNameRow);
    nameRow.height = 56;
    names.forEach((name, index) => {
      const cell = nameRow.getCell(index + 1);
      cell.value = name;
      cell.font = { name: this.fontFamily, size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      this.applyCellBorder(cell, this.thinBorder);

      if (index % 2 === 1) {
        cell.border = {
          top: this.thinBorder,
          left: this.thinBorder,
          right: this.thinBorder,
          bottom: { style: 'medium' as BorderStyle, color: { argb: 'FF404040' } }
        };
      }
    });
  }

  private populateNotesSection(worksheet: ExcelJS.Worksheet, layout: SheetLayout): number {
    const notesTitleRow = layout.signatureNameRow + 2;
    const notesEndRow = notesTitleRow + this.exportNotes.length;

    worksheet.mergeCells(notesTitleRow, 1, notesTitleRow, layout.lastCol);
    const titleCell = worksheet.getCell(notesTitleRow, 1);
    titleCell.value = 'Notes';
    titleCell.font = { name: this.fontFamily, size: 10, bold: true, color: { argb: 'FF1F3864' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE9EDF4' }
    };
    titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
    this.applyCellBorder(titleCell, this.mediumBorder);
    worksheet.getRow(notesTitleRow).height = 22;

    const mergedDescriptionWidth = this.getMergedColumnWidth(worksheet, 2, layout.lastCol);

    this.exportNotes.forEach((note, index) => {
      const rowNumber = notesTitleRow + 1 + index;
      const row = worksheet.getRow(rowNumber);
      row.height = this.calculateNoteRowHeight(note, mergedDescriptionWidth);

      const numberCell = worksheet.getCell(rowNumber, 1);
      numberCell.value = index + 1;
      numberCell.font = { name: this.fontFamily, size: 10 };
      numberCell.alignment = { horizontal: 'center', vertical: 'middle' };
      this.applyCellBorder(numberCell, this.thinBorder);

      worksheet.mergeCells(rowNumber, 2, rowNumber, layout.lastCol);
      const noteCell = worksheet.getCell(rowNumber, 2);
      noteCell.value = note;
      noteCell.font = { name: this.fontFamily, size: 10 };
      noteCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      this.applyCellBorder(noteCell, this.thinBorder);
    });

    return notesEndRow;
  }

  private getMergedColumnWidth(worksheet: ExcelJS.Worksheet, startCol: number, endCol: number): number {
    let totalWidth = 0;
    for (let col = startCol; col <= endCol; col++) {
      const column = worksheet.getColumn(col);
      totalWidth += column.width ?? 10;
    }
    return totalWidth;
  }

  private calculateNoteRowHeight(noteText: string, mergedColumnWidth: number): number {
    const charsPerLine = Math.max(35, Math.floor(mergedColumnWidth * 1.05));
    const lines = Math.max(1, Math.ceil(noteText.length / charsPerLine));
    return Math.min(72, 16 + lines * 12);
  }

  private applyPrintSettings(worksheet: ExcelJS.Worksheet, layout: SheetLayout, lastRow: number): void {
    const lastColLetter = this.columnLetter(layout.lastCol);
    worksheet.pageSetup.printArea = `A1:${lastColLetter}${lastRow}`;
    worksheet.pageSetup.printTitlesRow = `${layout.tableHeaderRow}:${layout.tableHeaderRow}`;
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

  private createEmptyExpenseItem(): TravelReimbursementExportItem {
    return {
      expenseDate: null,
      particular: null,
      amount: null,
      remarks: null,
      billAttached: null,
      billFileName: null
    };
  }

  private calculateRowHeight(item: TravelReimbursementExportItem): number {
    const textLengths = [
      this.displayValue(item.particular).length,
      this.displayValue(item.remarks).length,
      this.displayValue(item.billFileName).length
    ];
    const maxLines = Math.max(
      1,
      ...textLengths.map(length => Math.ceil(length / 28))
    );
    return Math.min(72, 18 + (maxLines - 1) * 12);
  }

  private formatTravelPeriod(fromDate: number | null, toDate: number | null): string {
    const from = this.formatDisplayDate(fromDate);
    const to = this.formatDisplayDate(toDate);
    if (!from && !to) {
      return '';
    }
    if (from && to) {
      return `${from} to ${to}`;
    }
    return from || to;
  }

  private formatDisplayDate(epoch: number | null): string {
    if (!epoch) {
      return '';
    }
    const date = new Date(epoch);
    if (isNaN(date.getTime())) {
      return '';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private sanitizeFilename(value: string): string {
    return value.replace(/[<>:"/\\|?*]+/g, '').trim() || 'Export';
  }

  private formatDateForFilename(epoch: number | null): string {
    if (!epoch) {
      return 'date';
    }
    return this.formatDisplayDate(epoch);
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

  private toExcelDate(epoch: number | null | undefined): Date | null {
    if (!epoch) {
      return null;
    }
    const date = new Date(epoch);
    return isNaN(date.getTime()) ? null : date;
  }

  private applyCellBorder(cell: ExcelJS.Cell, border: Partial<ExcelJS.Border>): void {
    cell.border = this.fullBorder(border);
  }

  private fullBorder(border: Partial<ExcelJS.Border>): Partial<ExcelJS.Borders> {
    return {
      top: border,
      left: border,
      right: border,
      bottom: border
    };
  }

  private columnLetter(columnNumber: number): string {
    let letter = '';
    let current = columnNumber;
    while (current > 0) {
      const remainder = (current - 1) % 26;
      letter = String.fromCharCode(65 + remainder) + letter;
      current = Math.floor((current - 1) / 26);
    }
    return letter;
  }

  private downloadWorkbook(buffer: ExcelJS.Buffer, filename: string): void {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
