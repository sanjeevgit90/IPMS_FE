import { AiStructuredResponse } from './ai-structured-response.model';
import { StructuredSection } from './procurement-structured-response.model';

export interface ProcurementChatRequest {
  message: string;
}

export interface ProcurementChatResponse {
  message: string;
  source: string | null;
  data?: AiStructuredResponse | null;
  suggestedQuestions?: string[];
}

export interface ChatMessage {
  text: string;
  fromUser: boolean;
  isError?: boolean;
  suppressMessageText?: boolean;
  suggestedQuestions?: string[];
  structuredSection?: StructuredSection;
}
