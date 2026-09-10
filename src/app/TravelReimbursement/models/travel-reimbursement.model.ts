export interface SelectionOption {
  selectionid: string;
  selectionvalue: string;
}

export interface TravelReimbursementItem {
  entityId?: number | null;
  expenseDate?: number | null;
  particular?: string | null;
  amount?: number | null;
  remarks?: string | null;
  billAttached?: string | null;
  billFileName?: string | null;
  billFileReference?: string | null;
  isDeleted?: boolean | null;
}

export interface TravelReimbursement {
  entityId?: number | null;
  employeeId?: number | null;
  employeeName?: string | null;
  cityVisited?: string | null;
  projectName?: string | null;
  projectPin?: string | null;
  bandGrade?: number | null;
  fromDate?: number | null;
  toDate?: number | null;
  totalAmount?: number | null;
  approvalStatus?: string | null;
  preparedBy?: string | null;
  preparedSignatureReference?: string | null;
  verifiedBy?: string | null;
  verifiedSignatureReference?: string | null;
  approvedBy?: string | null;
  approvedSignatureReference?: string | null;
  items?: TravelReimbursementItem[];
}

export interface TravelReimbursementSaveRequest {
  entityId?: number | null;
  employeeId?: number | null;
  employeeName?: string | null;
  cityVisited: string;
  projectName: string;
  projectPin: string;
  bandGrade?: number | null;
  fromDate: number;
  toDate: number;
  preparedBy?: string | null;
  preparedSignatureReference?: string | null;
  verifiedBy?: string | null;
  verifiedSignatureReference?: string | null;
  approvedBy?: string | null;
  approvedSignatureReference?: string | null;
  items: TravelReimbursementItemRequest[];
}

export interface TravelReimbursementItemRequest {
  entityId?: number | null;
  expenseDate: number;
  particular: string;
  amount: number;
  remarks?: string | null;
  billAttached: string;
  billFileName?: string | null;
  billFileReference?: string | null;
  isDeleted?: boolean | null;
}

export interface UserProfileSummary {
  entityId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImage?: string | null;
}

export interface ProjectDetails {
  projectName?: string | null;
  projectPin?: string | null;
}

export interface SendForApprovalRequest {
  approverUserId: number;
}

export interface TravelReimbursementApprovalTask {
  taskId?: number | null;
  reimbursementId?: number | null;
  employeeName?: string | null;
  employeeId?: number | null;
  cityVisited?: string | null;
  projectName?: string | null;
  projectPin?: string | null;
  bandGrade?: number | null;
  fromDate?: number | null;
  toDate?: number | null;
  totalAmount?: number | null;
  approvalStatus?: string | null;
}

export interface TravelReimbursementRejectRequest {
  remark?: string | null;
}

export interface UploadedFileRecord {
  data?: { name: string; size: number };
  inProgress?: boolean;
  progress?: number;
  uploadedFileName?: string;
  uploadedFilePath?: string;
  uploadStatus?: string;
}
