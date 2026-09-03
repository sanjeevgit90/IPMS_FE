export interface ProcurementChatRequest {
  message: string;
}

export interface ProcurementChatResponse {
  message: string;
  source: string | null;
  suggestedQuestions?: string[];
}

export interface ChatMessage {
  text: string;
  fromUser: boolean;
  isError?: boolean;
  suggestedQuestions?: string[];
}
