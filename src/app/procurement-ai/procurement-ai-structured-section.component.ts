import { Component, Input } from '@angular/core';
import {
  StructuredApproverColumn,
  StructuredApproverRow,
  StructuredField,
  StructuredGrnColumn,
  StructuredGrnRow,
  StructuredItemColumn,
  StructuredItemRow,
  StructuredSection
} from './models/procurement-structured-response.model';
import {
  formatIsoDate,
  formatStructuredAmount,
  formatStructuredField,
  formatUserFriendlyStatus,
  getStatusBadgeClass
} from './utils/procurement-field-formatter';

@Component({
  selector: 'app-procurement-ai-structured-section',
  templateUrl: './procurement-ai-structured-section.component.html',
  styleUrls: ['./procurement-ai-structured-section.component.css'],
  standalone: false
})
export class ProcurementAiStructuredSectionComponent {

  @Input() section?: StructuredSection;

  isItemsTable(section: StructuredSection): boolean {
    return section.presentationType === 'items-table' && !!section.itemsTable;
  }

  isApproversTable(section: StructuredSection): boolean {
    return section.presentationType === 'approvers-table' && !!section.approversTable;
  }

  isGrnsTable(section: StructuredSection): boolean {
    return section.presentationType === 'grns-table' && !!section.grnsTable;
  }

  isFieldsSection(section: StructuredSection): boolean {
    return !section.presentationType || section.presentationType === 'fields';
  }

  formatValue(field: StructuredField): string {
    return formatStructuredField(field);
  }

  formatCellValue(
    column: StructuredItemColumn,
    row: StructuredItemRow,
    currencyCode?: string
  ): string {
    const value = row[column.key];

    if (column.type === 'amount') {
      return formatStructuredAmount(value, currencyCode);
    }

    if (column.type === 'number') {
      return value === null || value === undefined ? '—' : String(value);
    }

    return value === null || value === undefined || value === ''
      ? '—'
      : String(value).trim();
  }

  formatApproverCellValue(column: StructuredApproverColumn, row: StructuredApproverRow): string {
    const value = row[column.key];

    if (column.type === 'status') {
      return formatUserFriendlyStatus(typeof value === 'string' ? value : String(value ?? ''));
    }

    return value === null || value === undefined || value === ''
      ? '—'
      : String(value).trim();
  }

  approverStatusBadgeClass(row: StructuredApproverRow): string {
    return getStatusBadgeClass(row.status);
  }

  formatGrnCellValue(column: StructuredGrnColumn, row: StructuredGrnRow): string {
    const value = row[column.key];

    if (column.type === 'date') {
      return formatIsoDate(typeof value === 'string' ? value : String(value ?? ''));
    }

    if (column.type === 'status') {
      return formatUserFriendlyStatus(typeof value === 'string' ? value : String(value ?? ''));
    }

    return value === null || value === undefined || value === ''
      ? '—'
      : String(value).trim();
  }

  grnStatusBadgeClass(row: StructuredGrnRow): string {
    return getStatusBadgeClass(row.status);
  }

  statusBadgeClass(field: StructuredField): string {
    return getStatusBadgeClass(field.value);
  }
}
