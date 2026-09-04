export type StructuredFieldType = 'text' | 'status' | 'date' | 'amount' | 'list';
export type StructuredPresentationType = 'fields' | 'items-table' | 'approvers-table' | 'grns-table';

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

export interface StructuredApproverRow {
  approvalLevel?: string;
  approverEmail?: string;
  status?: string;
}

export interface StructuredApproverColumn {
  key: keyof StructuredApproverRow;
  label: string;
  type: 'text' | 'status';
  align: 'left' | 'right';
}

export interface StructuredApproversTable {
  headerFields?: StructuredField[];
  columns: StructuredApproverColumn[];
  rows: StructuredApproverRow[];
  emptyMessage: string;
}

export interface StructuredGrnRow {
  grnNumber?: string;
  grnDate?: string;
  status?: string;
  projectName?: string;
}

export interface StructuredGrnColumn {
  key: keyof StructuredGrnRow;
  label: string;
  type: 'text' | 'date' | 'status';
  align: 'left' | 'right';
}

export interface StructuredGrnsTable {
  headerFields?: StructuredField[];
  columns: StructuredGrnColumn[];
  rows: StructuredGrnRow[];
  emptyMessage: string;
}

export interface StructuredSection {
  title: string;
  capabilityType?: string;
  presentationType?: StructuredPresentationType;
  fields?: StructuredField[];
  itemsTable?: StructuredItemsTable;
  approversTable?: StructuredApproversTable;
  grnsTable?: StructuredGrnsTable;
}
