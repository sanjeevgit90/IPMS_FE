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

export function isPurchaseOrderDetailsData(data: AiStructuredResponse): data is PurchaseOrderDetailsData {
  return data.type === 'PURCHASE_ORDER_DETAILS';
}

export function isPurchaseOrderItemsData(data: AiStructuredResponse): data is PurchaseOrderItemsData {
  return data.type === 'PURCHASE_ORDER_ITEMS';
}
