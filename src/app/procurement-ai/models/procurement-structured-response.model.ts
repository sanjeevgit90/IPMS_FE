export type StructuredFieldType = 'text' | 'status' | 'date' | 'amount' | 'list';
export type StructuredPresentationType = 'fields' | 'items-table';

export interface StructuredField {
  label: string;
  type: StructuredFieldType;
  value?: string | number | null;
  currencyCode?: string;
  listItems?: string[];
  emphasize?: boolean;
}

export interface StructuredItemRow {
  product?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
}

export interface StructuredItemColumn {
  key: keyof StructuredItemRow;
  label: string;
  type: 'text' | 'amount' | 'number';
  align: 'left' | 'right';
}

export interface StructuredItemsTable {
  headerFields?: StructuredField[];
  columns: StructuredItemColumn[];
  rows: StructuredItemRow[];
  emptyMessage: string;
  currencyCode?: string;
}

export interface StructuredSection {
  title: string;
  capabilityType?: string;
  presentationType?: StructuredPresentationType;
  fields?: StructuredField[];
  itemsTable?: StructuredItemsTable;
}
