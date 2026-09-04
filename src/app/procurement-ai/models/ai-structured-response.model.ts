export interface AiStructuredResponse {
  type: string;
}

export interface PurchaseOrderDetailsData extends AiStructuredResponse {
  type: 'PURCHASE_ORDER_DETAILS';
  purchaseOrderNo?: string;
  orderDate?: string;
  projectName?: string;
  supplierName?: string;
  approvalStatus?: string;
  totalAmount?: number;
  currency?: string;
}

export interface PurchaseOrderItemData {
  product?: string;
  description?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
}

export interface PurchaseOrderItemsData extends AiStructuredResponse {
  type: 'PURCHASE_ORDER_ITEMS';
  purchaseOrderNo?: string;
  currency?: string;
  items?: PurchaseOrderItemData[];
}

export interface PurchaseOrderApproverData {
  approvalLevel?: string;
  approverEmail?: string;
  status?: string;
}

export interface PurchaseOrderApprovalData extends AiStructuredResponse {
  type: 'PURCHASE_ORDER_APPROVAL';
  purchaseOrderNo?: string;
  approvalStatus?: string;
  approvers?: PurchaseOrderApproverData[];
}

export interface PurchaseOrderGrnData {
  grnNumber?: string;
  grnDate?: string;
  purchaseOrderNo?: string;
  status?: string;
  projectName?: string;
}

export interface PurchaseOrderGrnsData extends AiStructuredResponse {
  type: 'PURCHASE_ORDER_GRN';
  purchaseOrderNo?: string;
  grns?: PurchaseOrderGrnData[];
}

export function isPurchaseOrderDetailsData(data: AiStructuredResponse): data is PurchaseOrderDetailsData {
  return data.type === 'PURCHASE_ORDER_DETAILS';
}

export function isPurchaseOrderItemsData(data: AiStructuredResponse): data is PurchaseOrderItemsData {
  return data.type === 'PURCHASE_ORDER_ITEMS';
}

export function isPurchaseOrderApprovalData(data: AiStructuredResponse): data is PurchaseOrderApprovalData {
  return data.type === 'PURCHASE_ORDER_APPROVAL';
}

export function isPurchaseOrderGrnsData(data: AiStructuredResponse): data is PurchaseOrderGrnsData {
  return data.type === 'PURCHASE_ORDER_GRN';
}
