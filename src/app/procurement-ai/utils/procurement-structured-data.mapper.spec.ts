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

  it('maps PURCHASE_ORDER_ITEMS product field to the Product / Item column', () => {
    const data: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      items: [
        {
          product: 'Core Dark Fiber Cable',
          quantity: 1,
          unit: 'Box',
          unitPrice: 200
        }
      ]
    };

    const section = mapStructuredDataToSection(data);

    expect(section?.presentationType).toBe('items-table');
    expect(section?.title).toBe('Purchase Order Items');
    expect(section?.itemsTable?.rows.length).toBe(1);
    expect(section?.itemsTable?.rows[0].product).toBe('Core Dark Fiber Cable');
    expect(section?.itemsTable?.headerFields?.[0].value).toBe('chatboat_1');
  });

  it('renders multiple items as multiple rows', () => {
    const data: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      items: [
        { product: 'Item A', quantity: 1, unit: 'Box', unitPrice: 10 },
        { product: 'Item B', quantity: 2, unit: 'Each', unitPrice: 5 }
      ]
    };
    const section = mapStructuredDataToSection(data);

    expect(section?.itemsTable?.rows.length).toBe(2);
  });

  it('does not include Product Code or Line Total columns', () => {
    const data: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      items: [
        { product: 'Core Dark Fiber Cable', quantity: 1, unit: 'Box', unitPrice: 200 }
      ]
    };
    const section = mapStructuredDataToSection(data);

    const columnKeys = section?.itemsTable?.columns.map(column => column.key);
    expect(columnKeys).toEqual(['product', 'quantity', 'unit', 'unitPrice']);
    expect((columnKeys as string[]).includes('productCode')).toBeFalse();
    expect((columnKeys as string[]).includes('lineTotal')).toBeFalse();
  });

  it('keeps quantity, unit, and unit price columns', () => {
    const data: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      items: [
        { product: 'Core Dark Fiber Cable', quantity: 1, unit: 'Box', unitPrice: 200 }
      ]
    };
    const section = mapStructuredDataToSection(data);

    const row = section?.itemsTable?.rows[0];
    expect(row?.quantity).toBe(1);
    expect(row?.unit).toBe('Box');
    expect(row?.unitPrice).toBe(200);
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
          product: 'Cable',
          quantity: 1,
          unit: 'Box',
          unitPrice: 10,
          ...( { productId: '999', organizationId: '42', lineTotal: 100 } as Record<string, unknown> )
        }
      ]
    };
    const section = mapStructuredDataToSection(data);

    const row = section?.itemsTable?.rows[0] as Record<string, unknown> | undefined;
    expect(row?.product).toBe('Cable');
    expect(row?.productId).toBeUndefined();
    expect(row?.organizationId).toBeUndefined();
    expect(row?.lineTotal).toBeUndefined();
  });
});
