import { mapStructuredDataToSection } from './procurement-structured-data.mapper';
import {
  PurchaseOrderDetailsData,
  PurchaseOrderItemsData
} from '../models/ai-structured-response.model';

describe('procurement-structured-data.mapper', () => {
  const purchaseOrderDetails: PurchaseOrderDetailsData = {
    type: 'PURCHASE_ORDER_DETAILS',
    purchaseOrderNo: 'test123',
    orderDate: '2023-07-19',
    projectName: '3D City Jaipur',
    supplierName: ' Savitri techno industries limited',
    approvalStatus: 'PENDING',
    totalAmount: 0,
    currency: 'AFA-Afghani'
  };

  it('still maps PURCHASE_ORDER_DETAILS correctly', () => {
    const section = mapStructuredDataToSection(purchaseOrderDetails);

    expect(section?.presentationType).toBe('fields');
    expect(section?.title).toBe('Purchase Order Details');
    expect(section?.fields?.map(field => field.label)).toEqual([
      'PO Number',
      'Order Date',
      'Project',
      'Supplier',
      'Status',
      'Total Amount'
    ]);
  });

  it('maps PURCHASE_ORDER_ITEMS to an items table section', () => {
    const data: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      currency: 'USD',
      items: [
        {
          productName: 'Core Dark Fiber Cable',
          productCode: 'CDF-001',
          quantity: 1,
          unit: 'Box',
          unitPrice: 200,
          lineTotal: 200
        }
      ]
    };

    const section = mapStructuredDataToSection(data);

    expect(section?.presentationType).toBe('items-table');
    expect(section?.title).toBe('Purchase Order Items');
    expect(section?.itemsTable?.rows.length).toBe(1);
    expect(section?.itemsTable?.rows[0].productName).toBe('Core Dark Fiber Cable');
    expect(section?.itemsTable?.headerFields?.[0].value).toBe('chatboat_1');
  });

  it('renders multiple items as multiple rows', () => {
    const data: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      items: [
        { productName: 'Item A', quantity: 1, unit: 'Box', unitPrice: 10 },
        { productName: 'Item B', quantity: 2, unit: 'Each', unitPrice: 5, lineTotal: 10 }
      ]
    };
    const section = mapStructuredDataToSection(data);

    expect(section?.itemsTable?.rows.length).toBe(2);
  });

  it('omits columns when optional values are missing across all rows', () => {
    const data: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      items: [
        { productName: 'Core Dark Fiber Cable', quantity: 1, unit: 'Box', unitPrice: 200 }
      ]
    };
    const section = mapStructuredDataToSection(data);

    const columnKeys = section?.itemsTable?.columns.map(column => column.key);
    expect(columnKeys).toEqual(['productName', 'quantity', 'unit', 'unitPrice']);
    expect(columnKeys).not.toContain('productCode');
    expect(columnKeys).not.toContain('lineTotal');
  });

  it('handles an empty item list with an empty-state message', () => {
    const data: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      items: []
    };
    const section = mapStructuredDataToSection(data);

    expect(section?.itemsTable?.rows.length).toBe(0);
    expect(section?.itemsTable?.emptyMessage)
      .toBe('No items/products were found for this purchase order.');
  });

  it('does not expose unsupported internal fields from item payloads', () => {
    const data: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      items: [
        {
          productName: 'Cable',
          quantity: 1,
          unit: 'Box',
          unitPrice: 10,
          ...( { productId: '999', organizationId: '42' } as Record<string, unknown> )
        }
      ]
    };
    const section = mapStructuredDataToSection(data);

    const row = section?.itemsTable?.rows[0] as Record<string, unknown> | undefined;
    expect(row?.productName).toBe('Cable');
    expect(row?.productId).toBeUndefined();
    expect(row?.organizationId).toBeUndefined();
  });
});
