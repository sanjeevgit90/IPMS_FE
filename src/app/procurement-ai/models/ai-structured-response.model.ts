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

export function isPurchaseOrderDetailsData(data: AiStructuredResponse): data is PurchaseOrderDetailsData {
  return data.type === 'PURCHASE_ORDER_DETAILS';
}
