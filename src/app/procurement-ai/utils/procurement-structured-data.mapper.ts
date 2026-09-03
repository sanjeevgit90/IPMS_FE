import {
  AiStructuredResponse,
  isPurchaseOrderApprovalData,
  isPurchaseOrderDetailsData,
  isPurchaseOrderItemsData,
  PurchaseOrderApprovalData,
  PurchaseOrderApproverData,
  PurchaseOrderDetailsData,
  PurchaseOrderItemData,
  PurchaseOrderItemsData
} from '../models/ai-structured-response.model';
import {
  StructuredApproverColumn,
  StructuredApproverRow,
  StructuredField,
  StructuredItemColumn,
  StructuredItemRow,
  StructuredSection
} from '../models/procurement-structured-response.model';
import { formatUserFriendlyStatus } from './procurement-field-formatter';

const ITEM_COLUMN_DEFINITIONS: StructuredItemColumn[] = [
  { key: 'product', label: 'Product / Item', type: 'text', align: 'left' },
  { key: 'quantity', label: 'Quantity', type: 'number', align: 'right' },
  { key: 'unit', label: 'Unit', type: 'text', align: 'left' },
  { key: 'unitPrice', label: 'Unit Price', type: 'amount', align: 'right' }
];

const APPROVER_COLUMN_DEFINITIONS: StructuredApproverColumn[] = [
  { key: 'approvalLevel', label: 'Approval Level', type: 'text', align: 'left' },
  { key: 'approverEmail', label: 'Email', type: 'text', align: 'left' },
  { key: 'status', label: 'Status', type: 'status', align: 'left' }
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
    case 'PURCHASE_ORDER_APPROVAL':
      return isPurchaseOrderApprovalData(data)
        ? mapPurchaseOrderApproval(data)
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
  const columns = [...ITEM_COLUMN_DEFINITIONS];
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

function mapPurchaseOrderApproval(data: PurchaseOrderApprovalData): StructuredSection {
  const approvers = Array.isArray(data.approvers) ? data.approvers : [];
  const rows = approvers
    .map(approver => sanitizePurchaseOrderApprover(approver))
    .filter(row => hasRenderableApproverRow(row));
  const headerFields: StructuredField[] = [];

  addTextField(headerFields, 'PO Number', data.purchaseOrderNo, true);
  addFriendlyStatusField(headerFields, 'Approval Status', data.approvalStatus);

  return {
    title: 'Purchase Order Approval',
    capabilityType: 'PURCHASE_ORDER',
    presentationType: 'approvers-table',
    approversTable: {
      headerFields,
      columns: [...APPROVER_COLUMN_DEFINITIONS],
      rows,
      emptyMessage: 'No pending approvals for this purchase order.'
    }
  };
}

function sanitizePurchaseOrderApprover(approver: PurchaseOrderApproverData): StructuredApproverRow {
  return {
    approvalLevel: hasRenderableString(approver.approvalLevel) ? approver.approvalLevel.trim() : undefined,
    approverEmail: hasRenderableString(approver.approverEmail) ? approver.approverEmail.trim() : undefined,
    status: hasRenderableString(approver.status) ? approver.status.trim() : undefined
  };
}

function hasRenderableApproverRow(row: StructuredApproverRow): boolean {
  return APPROVER_COLUMN_DEFINITIONS.some(column => hasRenderableCellValue(row[column.key]));
}

function sanitizePurchaseOrderItem(item: PurchaseOrderItemData): StructuredItemRow {
  return {
    product: hasRenderableString(item.product) ? item.product.trim() : undefined,
    quantity: isValidNumber(item.quantity) ? item.quantity : undefined,
    unit: hasRenderableString(item.unit) ? item.unit.trim() : undefined,
    unitPrice: isValidNumber(item.unitPrice) ? item.unitPrice : undefined
  };
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

function addFriendlyStatusField(fields: StructuredField[], label: string, value?: string | null): void {
  if (!hasRenderableString(value)) {
    return;
  }

  fields.push({
    label,
    type: 'status',
    value: formatUserFriendlyStatus(value)
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
