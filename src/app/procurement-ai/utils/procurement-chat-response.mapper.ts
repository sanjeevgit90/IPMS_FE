import { ChatMessage, ProcurementChatResponse, SuggestedQuestionGroup } from '../models/procurement-chat.model';
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
    suggestedQuestionGroups: normalizeSuggestedQuestionGroups(response.suggestedQuestionGroups),
    structuredSection: mapStructuredDataToSection(response.data)
  };
}

export function normalizeSuggestedQuestionGroups(
  groups?: SuggestedQuestionGroup[] | null
): SuggestedQuestionGroup[] | undefined {
  if (!groups?.length) {
    return undefined;
  }

  const normalized: SuggestedQuestionGroup[] = [];

  for (const item of groups) {
    const groupName = item?.group?.trim();
    if (!groupName) {
      continue;
    }

    const questions = Array.isArray(item.questions)
      ? item.questions
          .map(question => question?.trim())
          .filter((question): question is string => !!question)
      : [];

    if (!questions.length) {
      continue;
    }

    normalized.push({
      group: groupName,
      questions
    });
  }

  return normalized.length ? normalized : undefined;
}
