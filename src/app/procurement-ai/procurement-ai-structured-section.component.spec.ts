import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcurementAiStructuredSectionComponent } from './procurement-ai-structured-section.component';

describe('ProcurementAiStructuredSectionComponent', () => {
  let fixture: ComponentFixture<ProcurementAiStructuredSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcurementAiStructuredSectionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcurementAiStructuredSectionComponent);
  });

  it('renders purchase order details fields', () => {
    fixture.componentInstance.section = {
      title: 'Purchase Order Details',
      presentationType: 'fields',
      fields: [
        { label: 'PO Number', type: 'text', value: 'test123', emphasize: true },
        { label: 'Status', type: 'status', value: 'PENDING' }
      ]
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Purchase Order Details');
    expect(compiled.textContent).toContain('test123');
    expect(compiled.querySelector('.badge-warning')?.textContent).toContain('PENDING');
    expect(compiled.querySelector('.procurement-ai-items-table')).toBeNull();
  });

  it('renders purchase order items table', () => {
    fixture.componentInstance.section = {
      title: 'Purchase Order Items',
      presentationType: 'items-table',
      itemsTable: {
        headerFields: [{ label: 'PO Number', type: 'text', value: 'chatboat_1', emphasize: true }],
        columns: [
          { key: 'product', label: 'Product / Item', type: 'text', align: 'left' },
          { key: 'productCode', label: 'Product Code', type: 'text', align: 'left' },
          { key: 'quantity', label: 'Quantity', type: 'number', align: 'right' },
          { key: 'unit', label: 'Unit', type: 'text', align: 'left' },
          { key: 'unitPrice', label: 'Unit Price', type: 'amount', align: 'right' }
        ],
        rows: [
          { product: 'Core Dark Fiber Cable', quantity: 1, unit: 'Box', unitPrice: 200 }
        ],
        emptyMessage: 'No items/products were found for this purchase order.',
        currencyCode: 'USD'
      }
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.procurement-ai-items-table')).not.toBeNull();
    expect(compiled.textContent).toContain('Core Dark Fiber Cable');
    expect(compiled.textContent).not.toContain('Line Total');
    expect(compiled.textContent).toContain('USD 200.00');
    expect(compiled.textContent).toContain('chatboat_1');
  });

  it('renders missing optional product code as an em dash', () => {
    fixture.componentInstance.section = {
      title: 'Purchase Order Items',
      presentationType: 'items-table',
      itemsTable: {
        headerFields: [{ label: 'PO Number', type: 'text', value: 'chatboat_1', emphasize: true }],
        columns: [
          { key: 'product', label: 'Product / Item', type: 'text', align: 'left' },
          { key: 'productCode', label: 'Product Code', type: 'text', align: 'left' },
          { key: 'quantity', label: 'Quantity', type: 'number', align: 'right' },
          { key: 'unit', label: 'Unit', type: 'text', align: 'left' },
          { key: 'unitPrice', label: 'Unit Price', type: 'amount', align: 'right' }
        ],
        rows: [
          { product: 'Core Dark Fiber Cable', quantity: 1, unit: 'Box', unitPrice: 200 }
        ],
        emptyMessage: 'No items/products were found for this purchase order.',
        currencyCode: 'USD'
      }
    };
    fixture.detectChanges();

    const cells = Array.from(
      fixture.nativeElement.querySelectorAll('.procurement-ai-items-table tbody td')
    ) as HTMLElement[];
    expect(cells[0].textContent?.trim()).toBe('Core Dark Fiber Cable');
    expect(cells[1].textContent?.trim()).toBe('—');
  });

  it('renders empty-state message when there are no items', () => {
    fixture.componentInstance.section = {
      title: 'Purchase Order Items',
      presentationType: 'items-table',
      itemsTable: {
        headerFields: [{ label: 'PO Number', type: 'text', value: 'chatboat_1', emphasize: true }],
        columns: [],
        rows: [],
        emptyMessage: 'No items/products were found for this purchase order.'
      }
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.procurement-ai-items-empty')?.textContent)
      .toContain('No items/products were found for this purchase order.');
  });
});
