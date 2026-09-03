export type StructuredFieldType = 'text' | 'status' | 'date' | 'amount' | 'list';

export interface StructuredField {
  label: string;
  type: StructuredFieldType;
  value?: string | number | null;
  currencyCode?: string;
  listItems?: string[];
  emphasize?: boolean;
}

export interface StructuredSection {
  title: string;
  capabilityType?: string;
  fields: StructuredField[];
}
