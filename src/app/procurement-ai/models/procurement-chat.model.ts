export interface ProcurementChatRequest {
  message: string;
}

export interface ProcurementChatResponse {
  message: string;
  source: string | null;
}

export interface ChatMessage {
  text: string;
  fromUser: boolean;
  isError?: boolean;
}
