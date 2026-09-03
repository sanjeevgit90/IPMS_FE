import { mapApiResponseToChatMessage } from './procurement-chat-response.mapper';
import {
  PurchaseOrderApprovalData,
  PurchaseOrderDetailsData,
  PurchaseOrderItemsData
} from '../models/ai-structured-response.model';

describe('procurement-chat-response.mapper', () => {
  it('suppresses message text for PURCHASE_ORDER_ITEMS responses', () => {
    const itemsData: PurchaseOrderItemsData = {
      type: 'PURCHASE_ORDER_ITEMS',
      purchaseOrderNo: 'chatboat_1',
      items: [
        { product: 'Core Dark Fiber Cable', quantity: 10, unit: 'Box', unitPrice: 200 }
      ]
    };

    const message = mapApiResponseToChatMessage({
      message: 'Here are the items from the PO chatboat_1: * 1 x Core Dark Fiber Cable',
      source: 'PURCHASE_ORDER',
      data: itemsData,
      suggestedQuestions: ['Show me the details of PO chatboat_1']
    });

    expect(message.suppressMessageText).toBeTrue();
    expect(message.text).toBe('Here are the items from the PO chatboat_1: * 1 x Core Dark Fiber Cable');
    expect(message.structuredSection?.presentationType).toBe('items-table');
    expect(message.suggestedQuestions).toEqual(['Show me the details of PO chatboat_1']);
  });

  it('suppresses message text for PURCHASE_ORDER_APPROVAL responses', () => {
    const approvalData: PurchaseOrderApprovalData = {
      type: 'PURCHASE_ORDER_APPROVAL',
      purchaseOrderNo: 'chatboat_1',
      approvalStatus: 'DELIVERY_HEAD_PENDING',
      approvers: [
        {
          approvalLevel: 'DELIVERY HEAD',
          approverEmail: 'ravindra.singh@aurionpro.com',
          status: 'PENDING'
        }
      ]
    };

    const message = mapApiResponseToChatMessage({
      message: 'The pending approver for PO chatboat_1 is ravindra.singh@aurionpro.com.',
      source: 'PURCHASE_ORDER',
      data: approvalData,
      suggestedQuestions: ['Show me the details of PO chatboat_1']
    });

    expect(message.suppressMessageText).toBeTrue();
    expect(message.structuredSection?.presentationType).toBe('approvers-table');
    expect(message.suggestedQuestions).toEqual(['Show me the details of PO chatboat_1']);
  });

  it('keeps message text for PURCHASE_ORDER_DETAILS responses', () => {
    const detailsData: PurchaseOrderDetailsData = {
      type: 'PURCHASE_ORDER_DETAILS',
      purchaseOrderNo: 'test123',
      approvalStatus: 'PENDING'
    };

    const message = mapApiResponseToChatMessage({
      message: 'Here are the details for PO test123.',
      source: 'PURCHASE_ORDER',
      data: detailsData,
      suggestedQuestions: []
    });

    expect(message.suppressMessageText).toBeFalsy();
    expect(message.text).toBe('Here are the details for PO test123.');
    expect(message.structuredSection?.presentationType).toBe('fields');
  });

  it('keeps message text for normal PO status responses', () => {
    const message = mapApiResponseToChatMessage({
      message: 'The status of PO test123 is PENDING.',
      source: 'PURCHASE_ORDER',
      data: null,
      suggestedQuestions: []
    });

    expect(message.suppressMessageText).toBeFalsy();
    expect(message.text).toBe('The status of PO test123 is PENDING.');
    expect(message.structuredSection).toBeUndefined();
  });
});
