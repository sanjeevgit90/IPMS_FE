export interface TravelReimbursementExportItem {
  expenseDate: number | null;
  particular: string | null;
  amount: number | null;
  remarks: string | null;
  billAttached: string | null;
  billFileName: string | null;
}

export interface TravelReimbursementExportData {
  entityId: number | null;
  employeeName: string | null;
  employeeId: number | null;
  bandGrade: number | null;
  cityVisited: string | null;
  projectName: string | null;
  projectPin: string | null;
  fromDate: number | null;
  toDate: number | null;
  preparedBy: string | null;
  preparedSignatureReference: string | null;
  verifiedBy: string | null;
  approvedBy: string | null;
  totalAmount: number;
  items: TravelReimbursementExportItem[];
}
