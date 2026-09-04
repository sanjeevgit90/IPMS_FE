import { ChatMessage, ProcurementChatResponse } from '../models/procurement-chat.model';
import {
  AiStructuredResponse,
  isPurchaseOrderApprovalData,
  isPurchaseOrderGrnsData,
  isPurchaseOrderItemsData
} from '../models/ai-structured-response.model';
import { mapStructuredDataToSection } from './procurement-structured-data.mapper';

function shouldSuppressMessageText(data?: AiStructuredResponse | null): boolean {
  return !!data && (
    isPurchaseOrderItemsData(data) ||
    isPurchaseOrderApprovalData(data) ||
    isPurchaseOrderGrnsData(data)
  );
}

export function mapApiResponseToChatMessage(response: ProcurementChatResponse): ChatMessage {
  const suppressMessageText = shouldSuppressMessageText(response.data);

  return {
    text: response.message,
    fromUser: false,
    suppressMessageText,
    suggestedQuestions: normalizeSuggestedQuestions(response.suggestedQuestions),
    structuredSection: mapStructuredDataToSection(response.data)
  };
}
export function normalizeSuggestedQuestions(questions?: string[] | null): string[] | undefined {
  if (!questions?.length) {
    return undefined;
  }
  return questions;
}
