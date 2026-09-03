import {
  AiStructuredResponse,
  isPurchaseOrderDetailsData,
  PurchaseOrderDetailsData
} from '../models/ai-structured-response.model';
import { StructuredField, StructuredSection } from '../models/procurement-structured-response.model';

export function mapStructuredDataToSection(
  data?: AiStructuredResponse | null
): StructuredSection | undefined {
  if (!data?.type) {
    return undefined;
  }

  switch (data.type) {
    case 'PURCHASE_ORDER_DETAILS':
      return isPurchaseOrderDetailsData(data)
        ? mapPurchaseOrderDetails(data)
        : undefined;
    default:
      return undefined;
  }
}

function mapPurchaseOrderDetails(data: PurchaseOrderDetailsData): StructuredSection | undefined {
  const fields: StructuredField[] = [];

  addTextField(fields, 'PO Number', data.purchaseOrderNo, true);
  addDateField(fields, 'Order Date', data.orderDate);
  addTextField(fields, 'Project', data.projectName);
  addTextField(fields, 'Supplier', data.supplierName);
  addStatusField(fields, 'Status', data.approvalStatus);
  addAmountField(fields, 'Total Amount', data.totalAmount, data.currency, true);

  if (!fields.length) {
    return undefined;
  }

  return {
    title: 'Purchase Order Details',
    capabilityType: 'PURCHASE_ORDER',
    fields
  };
}

function addTextField(
  fields: StructuredField[],
  label: string,
  value?: string | null,
  emphasize = false
): void {
  if (!hasRenderableString(value)) {
    return;
  }

  fields.push({
    label,
    type: 'text',
    value: value.trim(),
    emphasize
  });
}

function addDateField(fields: StructuredField[], label: string, value?: string | null): void {
  if (!hasRenderableString(value)) {
    return;
  }

  fields.push({
    label,
    type: 'date',
    value: value.trim()
  });
}

function addStatusField(fields: StructuredField[], label: string, value?: string | null): void {
  if (!hasRenderableString(value)) {
    return;
  }

  fields.push({
    label,
    type: 'status',
    value: value.trim()
  });
}

function addAmountField(
  fields: StructuredField[],
  label: string,
  value?: number | null,
  currency?: string | null,
  emphasize = false
): void {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return;
  }

  fields.push({
    label,
    type: 'amount',
    value,
    currencyCode: currency?.trim() || undefined,
    emphasize
  });
}

function hasRenderableString(value?: string | null): boolean {
  return !!value?.trim();
}
