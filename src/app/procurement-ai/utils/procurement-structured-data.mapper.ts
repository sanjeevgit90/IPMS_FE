import {
  AiStructuredResponse,
  isPurchaseOrderDetailsData,
  isPurchaseOrderItemsData,
  PurchaseOrderDetailsData,
  PurchaseOrderItemData,
  PurchaseOrderItemsData
} from '../models/ai-structured-response.model';
import {
  StructuredField,
  StructuredItemColumn,
  StructuredItemRow,
  StructuredSection
} from '../models/procurement-structured-response.model';

const ITEM_COLUMN_DEFINITIONS: StructuredItemColumn[] = [
  { key: 'productName', label: 'Product / Item', type: 'text', align: 'left' },
  { key: 'productCode', label: 'Product Code', type: 'text', align: 'left' },
  { key: 'quantity', label: 'Quantity', type: 'number', align: 'right' },
  { key: 'unit', label: 'Unit', type: 'text', align: 'left' },
  { key: 'unitPrice', label: 'Unit Price', type: 'amount', align: 'right' },
  { key: 'lineTotal', label: 'Line Total', type: 'amount', align: 'right' }
];

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
    case 'PURCHASE_ORDER_ITEMS':
      return isPurchaseOrderItemsData(data)
        ? mapPurchaseOrderItems(data)
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
    presentationType: 'fields',
    fields
  };
}

function mapPurchaseOrderItems(data: PurchaseOrderItemsData): StructuredSection {
  const currency = data.currency?.trim();
  const items = Array.isArray(data.items) ? data.items : [];
  const rows = items
    .map(item => sanitizePurchaseOrderItem(item))
    .filter(row => hasRenderableItemRow(row));
  const columns = buildVisibleItemColumns(rows);
  const headerFields: StructuredField[] = [];
  addTextField(headerFields, 'PO Number', data.purchaseOrderNo, true);

  return {
    title: 'Purchase Order Items',
    capabilityType: 'PURCHASE_ORDER',
    presentationType: 'items-table',
    itemsTable: {
      headerFields,
      columns,
      rows,
      emptyMessage: 'No items/products were found for this purchase order.',
      currencyCode: currency
    }
  };
}

function sanitizePurchaseOrderItem(item: PurchaseOrderItemData): StructuredItemRow {
  return {
    productName: hasRenderableString(item.productName) ? item.productName.trim() : undefined,
    productCode: hasRenderableString(item.productCode) ? item.productCode.trim() : undefined,
    quantity: isValidNumber(item.quantity) ? item.quantity : undefined,
    unit: hasRenderableString(item.unit) ? item.unit.trim() : undefined,
    unitPrice: isValidNumber(item.unitPrice) ? item.unitPrice : undefined,
    lineTotal: isValidNumber(item.lineTotal) ? item.lineTotal : undefined
  };
}

function buildVisibleItemColumns(rows: StructuredItemRow[]): StructuredItemColumn[] {
  return ITEM_COLUMN_DEFINITIONS.filter(column =>
    rows.some(row => hasRenderableCellValue(row[column.key]))
  );
}

function hasRenderableItemRow(row: StructuredItemRow): boolean {
  return ITEM_COLUMN_DEFINITIONS.some(column => hasRenderableCellValue(row[column.key]));
}

function hasRenderableCellValue(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  return !isNaN(Number(value));
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
  if (!isValidNumber(value)) {
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

function isValidNumber(value?: number | null): boolean {
  return value !== null && value !== undefined && !isNaN(Number(value));
}
