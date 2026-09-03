import { Component, Input } from '@angular/core';
import {
  StructuredField,
  StructuredItemColumn,
  StructuredItemRow,
  StructuredSection
} from './models/procurement-structured-response.model';
import {
  formatStructuredAmount,
  formatStructuredField,
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

  statusBadgeClass(field: StructuredField): string {
    return getStatusBadgeClass(field.value);
  }
}
