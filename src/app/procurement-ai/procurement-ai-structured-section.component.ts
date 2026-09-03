import { Component, Input } from '@angular/core';
import { StructuredField, StructuredSection } from './models/procurement-structured-response.model';
import {
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

  formatValue(field: StructuredField): string {
    return formatStructuredField(field);
  }

  statusBadgeClass(field: StructuredField): string {
    return getStatusBadgeClass(field.value);
  }
}
