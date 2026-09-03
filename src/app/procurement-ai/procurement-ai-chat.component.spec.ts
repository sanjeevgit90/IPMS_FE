import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { ProcurementAiChatComponent } from './procurement-ai-chat.component';
import { ProcurementAiChatService } from './procurement-ai-chat.service';
import { ProcurementAiStructuredSectionComponent } from './procurement-ai-structured-section.component';

const purchaseOrderDetailsResponse = {
  message: 'Here are the details for PO test123.',
  source: 'PURCHASE_ORDER',
  data: {
    type: 'PURCHASE_ORDER_DETAILS',
    purchaseOrderNo: 'test123',
    orderDate: '2023-07-19',
    projectName: '3D City Jaipur',
    supplierName: ' Savitri techno industries limited',
    approvalStatus: 'PENDING',
    totalAmount: 0,
    currency: 'AFA-Afghani'
  },
  suggestedQuestions: ['Which supplier is associated with PO test123?']
};

const purchaseOrderItemsResponse = {
  message: 'Here are the items/products in PO chatboat_1.',
  source: 'PURCHASE_ORDER',
  data: {
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
      },
      {
        productName: 'Patch Panel',
        quantity: 2,
        unit: 'Each',
        unitPrice: 50,
        lineTotal: 100
      }
    ]
  },
  suggestedQuestions: ['Show me the details of PO chatboat_1']
};

describe('ProcurementAiChatComponent', () => {
  let component: ProcurementAiChatComponent;
  let fixture: ComponentFixture<ProcurementAiChatComponent>;
  let chatService: jasmine.SpyObj<ProcurementAiChatService>;

  beforeEach(async () => {
    chatService = jasmine.createSpyObj('ProcurementAiChatService', ['sendMessage']);

    await TestBed.configureTestingModule({
      declarations: [
        ProcurementAiChatComponent,
        ProcurementAiStructuredSectionComponent
      ],
      imports: [FormsModule, MatButtonModule, MatIconModule],
      providers: [
        { provide: ProcurementAiChatService, useValue: chatService },
        { provide: Router, useValue: { events: of() } }
      ]
    }).compileComponents();

    sessionStorage.setItem('token', 'test-token');
    fixture = TestBed.createComponent(ProcurementAiChatComponent);
    component = fixture.componentInstance;
    component.isAuthenticated = true;
    component.panelOpen = true;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('displays suggested questions when returned by the API', () => {
    chatService.sendMessage.and.returnValue(of({
      message: 'The status of PO test123 is PENDING.',
      source: 'PURCHASE_ORDER',
      data: null,
      suggestedQuestions: [
        'Show me the details of PO test123',
        'Which supplier is associated with PO test123?'
      ]
    }));

    component.draftMessage = 'What is the status of PO test123?';
    component.send();
    fixture.detectChanges();

    const suggestionChips = fixture.nativeElement.querySelectorAll('.procurement-ai-suggestion-chip');
    expect(suggestionChips.length).toBe(2);
    expect(suggestionChips[0].textContent).toContain('Show me the details of PO test123');
  });

  it('renders PURCHASE_ORDER_DETAILS structured card from response.data', () => {
    chatService.sendMessage.and.returnValue(of(purchaseOrderDetailsResponse));

    component.draftMessage = 'Show me the details of PO test123';
    component.send();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Purchase Order Details');
    expect(compiled.textContent).toContain('test123');
    expect(compiled.textContent).toContain('July 19, 2023');
    expect(compiled.querySelector('.procurement-ai-items-table')).toBeNull();
  });

  it('renders PURCHASE_ORDER_ITEMS as a table from response.data', () => {
    chatService.sendMessage.and.returnValue(of(purchaseOrderItemsResponse));

    component.draftMessage = 'Show the items/products in PO chatboat_1';
    component.send();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Purchase Order Items');
    expect(compiled.textContent).toContain('chatboat_1');
    expect(compiled.textContent).toContain('Core Dark Fiber Cable');
    expect(compiled.textContent).toContain('Patch Panel');
    expect(compiled.querySelector('.procurement-ai-items-table')).not.toBeNull();
    expect(compiled.querySelectorAll('.procurement-ai-items-table tbody tr').length).toBe(2);
    expect(compiled.querySelector('.procurement-ai-suggestion-chip')).not.toBeNull();
  });

  it('does not display suggestions when the array is empty', () => {
    chatService.sendMessage.and.returnValue(of({
      message: 'Please provide a purchase order number.',
      source: null,
      data: null,
      suggestedQuestions: []
    }));

    component.draftMessage = 'Hello';
    component.send();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.procurement-ai-suggestions')).toBeNull();
    expect(component.messages[component.messages.length - 1].suggestedQuestions).toBeUndefined();
  });

  it('sends the exact clicked suggested question through the existing chat flow', () => {
    chatService.sendMessage.and.returnValues(
      of({
        message: 'The status of PO test123 is PENDING.',
        source: 'PURCHASE_ORDER',
        data: null,
        suggestedQuestions: ['Show me the details of PO test123']
      }),
      of({
        ...purchaseOrderItemsResponse,
        suggestedQuestions: []
      })
    );

    component.draftMessage = 'What is the status of PO test123?';
    component.send();

    component.onSuggestedQuestionClick('Show me the details of PO test123');

    expect(chatService.sendMessage).toHaveBeenCalledTimes(2);
    expect(chatService.sendMessage).toHaveBeenCalledWith('Show me the details of PO test123');
    expect(component.messages.some(message => message.structuredSection?.presentationType === 'items-table'))
      .toBeTrue();
  });

  it('displays suggestions only on the AI message that returned them', () => {
    chatService.sendMessage.and.returnValues(
      of({
        message: 'First response',
        source: 'PURCHASE_ORDER',
        data: null,
        suggestedQuestions: ['Follow up question']
      }),
      of({
        message: 'Second response',
        source: 'PURCHASE_ORDER',
        data: null,
        suggestedQuestions: ['Another follow up']
      })
    );

    component.draftMessage = 'First question';
    component.send();
    component.onSuggestedQuestionClick('Follow up question');
    fixture.detectChanges();

    const suggestionLists = fixture.nativeElement.querySelectorAll('.procurement-ai-suggestion-list');
    expect(suggestionLists.length).toBe(2);
    expect(suggestionLists[0].textContent).toContain('Follow up question');
    expect(suggestionLists[1].textContent).toContain('Another follow up');
  });

  it('keeps normal typed-question behavior working when data is null', () => {
    chatService.sendMessage.and.returnValue(of({
      message: 'The status of PO test123 is PENDING.',
      source: 'PURCHASE_ORDER',
      data: null,
      suggestedQuestions: []
    }));

    component.draftMessage = 'What is the status of PO test123?';
    component.send();
    fixture.detectChanges();

    expect(chatService.sendMessage).toHaveBeenCalledWith('What is the status of PO test123?');
    expect(fixture.nativeElement.querySelector('.procurement-ai-structured-section')).toBeNull();
    expect(component.messages[1].text).toBe('The status of PO test123 is PENDING.');
  });

  it('shows empty-state message for PURCHASE_ORDER_ITEMS with no rows', () => {
    chatService.sendMessage.and.returnValue(of({
      message: 'No items found.',
      source: 'PURCHASE_ORDER',
      data: {
        type: 'PURCHASE_ORDER_ITEMS',
        purchaseOrderNo: 'chatboat_1',
        items: []
      },
      suggestedQuestions: []
    }));

    component.draftMessage = 'Show items';
    component.send();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.procurement-ai-items-empty')?.textContent)
      .toContain('No items/products were found for this purchase order.');
  });

  it('prevents duplicate submissions while a request is in progress', () => {
    chatService.sendMessage.and.returnValue(of({
      message: 'Response',
      source: 'PURCHASE_ORDER',
      data: null,
      suggestedQuestions: ['Next question']
    }));

    component.isLoading = true;
    component.onSuggestedQuestionClick('Next question');

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });
});
