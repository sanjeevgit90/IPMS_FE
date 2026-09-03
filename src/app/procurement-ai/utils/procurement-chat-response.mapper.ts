import { ChatMessage, ProcurementChatResponse } from '../models/procurement-chat.model';
import { mapStructuredDataToSection } from './procurement-structured-data.mapper';

export function mapApiResponseToChatMessage(response: ProcurementChatResponse): ChatMessage {
  return {
    text: response.message,
    fromUser: false,
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
