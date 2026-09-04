import { AiStructuredResponse } from './ai-structured-response.model';
import { StructuredSection } from './procurement-structured-response.model';

export interface ProcurementChatRequest {
  message: string;
}

export interface SuggestedQuestionGroup {
  group: string;
  questions: string[];
}

export interface ProcurementChatResponse {
  message: string;
  source: string | null;
  data?: AiStructuredResponse | null;
  suggestedQuestionGroups?: SuggestedQuestionGroup[];
}

export interface ChatMessage {
  text: string;
  fromUser: boolean;
  isError?: boolean;
  suppressMessageText?: boolean;
  suggestedQuestionGroups?: SuggestedQuestionGroup[];
  structuredSection?: StructuredSection;
}
