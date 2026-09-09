import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../global/app.global';
import { DialogService } from '../../service/dialog.service';
import { FileuploadService } from '../../service/fileupload.service';
import { MyprofileService } from '../../ConfigurationMgmt/myprofile/myprofile.service';
import { ProjectMasterService } from '../../ProjectMgmt/ProjectMaster/projectmaster.service';
import { TravelReimbursementService } from '../travel-reimbursement.service';
import { TravelReimbursementExportService } from '../travel-reimbursement-export.service';
import { BILL_ATTACHED_OPTIONS } from '../travel-reimbursement.constants';
import {
  ProjectDetails,
  SelectionOption,
  TravelReimbursement,
  TravelReimbursementItem,
  TravelReimbursementItemRequest,
  TravelReimbursementSaveRequest,
  UploadedFileRecord,
  UserProfileSummary
} from '../models/travel-reimbursement.model';
import {
  TravelReimbursementExportData,
  TravelReimbursementExportItem
} from '../models/travel-reimbursement-export.model';

function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const fromDate = group.get('fromDate')?.value;
  const toDate = group.get('toDate')?.value;
  if (fromDate && toDate && new Date(fromDate).getTime() > new Date(toDate).getTime()) {
    return { dateRange: true };
  }
  return null;
}

@Component({
  selector: 'app-add-travel-reimbursement',
  templateUrl: './add-travel-reimbursement.component.html',
  styleUrls: ['./add-travel-reimbursement.component.css'],
  providers: [
    TravelReimbursementService,
    AppGlobals,
    DialogService,
    FileuploadService,
    MyprofileService,
    ProjectMasterService
  ],
  standalone: false
})
export class AddTravelReimbursementComponent implements OnInit {

  PageTitle = 'Add Travel Reimbursement';
  showLoading = false;
  isSubmitted = false;
  add = true;
  edit = false;
  view = false;
  entityId: number | null = null;
  matSelectDuration = this.global.matSelectDurationTime;

  billAttachedOptions = BILL_ATTACHED_OPTIONS;
  projectList: SelectionOption[] = [];

  preparedSignatureFiles: UploadedFileRecord[] = [];
  verifiedSignatureFiles: UploadedFileRecord[] = [];
  approvedSignatureFiles: UploadedFileRecord[] = [];
  itemBillFiles: UploadedFileRecord[][] = [];

  travelReimbursementForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private travelReimbursementService: TravelReimbursementService,
    private myprofileService: MyprofileService,
    private projectMasterService: ProjectMasterService,
    private fileuploadService: FileuploadService,
    private travelReimbursementExportService: TravelReimbursementExportService,
    private global: AppGlobals,
    private dialogService: DialogService
  ) {
    this.travelReimbursementForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadProjectList();
    this.populateEmployeeFromProfile();

    const page = this.route.snapshot.params['page'];
    const id = this.route.snapshot.params['id'];

    if (page === 'edit') {
      this.PageTitle = 'Update Travel Reimbursement';
      this.add = false;
      this.edit = true;
      this.entityId = Number(id);
      this.loadTravelReimbursement(this.entityId);
    } else if (page === 'view') {
      this.PageTitle = 'View Travel Reimbursement';
      this.add = false;
      this.view = true;
      this.entityId = Number(id);
      this.loadTravelReimbursement(this.entityId, true);
    } else {
      this.addExpenseItem();
    }
  }

  get itemsFormArray(): FormArray {
    return this.travelReimbursementForm.get('items') as FormArray;
  }

  get formControls(): Record<string, AbstractControl> {
    return this.travelReimbursementForm.controls;
  }

  getItemFormGroup(index: number): FormGroup {
    return this.itemsFormArray.at(index) as FormGroup;
  }

  isPreparedSignatureMissing(): boolean {
    return !this.fileuploadService.hasfile(this.preparedSignatureFiles);
  }

  isBillAttachedYes(index: number): boolean {
    return this.getItemFormGroup(index).get('billAttached')?.value === 'Y';
  }

  getExpenseItemSerialNumber(index: number): number {
    let serial = 0;
    for (let i = 0; i < this.itemsFormArray.length; i++) {
      if (this.isItemRowVisible(i)) {
        serial++;
        if (i === index) {
          return serial;
        }
      }
    }
    return 0;
  }

  isBillFileMissing(index: number): boolean {
    const itemGroup = this.getItemFormGroup(index);
    if (itemGroup.get('billAttached')?.value !== 'Y') {
      return false;
    }

    const billFiles = this.itemBillFiles[index] ?? [];
    if (this.fileuploadService.hasfile(billFiles)) {
      return false;
    }

    return !itemGroup.get('billFileReference')?.value;
  }

  getTotalAmount(): number {
    return this.itemsFormArray.controls
      .filter(control => !control.get('isDeleted')?.value)
      .reduce((sum, control) => {
        const amount = Number(control.get('amount')?.value ?? 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
  }

  back(): void {
    this.router.navigate(['/searchTravelReimbursement']);
  }

  addExpenseItem(item?: TravelReimbursementItem): void {
    this.itemsFormArray.push(this.createItemGroup(item));
    this.itemBillFiles.push(this.buildBillFilesForItem(item));
  }

  duplicateExpenseItem(index: number): void {
    const source = this.getItemFormGroup(index).getRawValue();
    const expenseDate = source.expenseDate instanceof Date
      ? source.expenseDate.getTime()
      : source.expenseDate;

    const duplicateItem: TravelReimbursementItem = {
      entityId: null,
      expenseDate,
      particular: source.particular,
      amount: source.amount,
      remarks: source.remarks,
      billAttached: source.billAttached,
      billFileName: source.billFileName,
      billFileReference: source.billFileReference,
      isDeleted: false
    };

    const insertIndex = index + 1;
    this.itemsFormArray.insert(insertIndex, this.createItemGroup(duplicateItem));
    this.itemBillFiles.splice(insertIndex, 0, this.copyBillFilesFromRow(index, duplicateItem));
  }

  removeExpenseItem(index: number): void {
    const itemGroup = this.itemsFormArray.at(index) as FormGroup;
    const existingEntityId = itemGroup.get('entityId')?.value;
    if (existingEntityId) {
      itemGroup.patchValue({ isDeleted: true });
      itemGroup.disable();
    } else {
      this.itemsFormArray.removeAt(index);
      this.itemBillFiles.splice(index, 1);
    }
  }

  isItemRowVisible(index: number): boolean {
    return !this.itemsFormArray.at(index).get('isDeleted')?.value;
  }

  onProjectChange(projectId: string): void {
    if (!projectId) {
      this.travelReimbursementForm.patchValue({ projectName: null, projectPin: null });
      return;
    }

    this.projectMasterService.projectById(projectId, this.getAuthHeaders()).subscribe({
      next: (resp: ProjectDetails) => {
        this.travelReimbursementForm.patchValue({
          projectName: resp.projectName ?? null,
          projectPin: resp.projectPin ?? null
        });
      },
      error: (error) => this.showError(error, 'Unable to load project details.')
    });
  }

  saveTravelReimbursement(): void {
    this.submit(false);
  }

  updateTravelReimbursement(): void {
    this.submit(true);
  }

  exportToExcel(): void {
    const exportData = this.buildExportData();
    if (!exportData) {
      this.dialogService.openConfirmDialog('Travel reimbursement data is not available for export.');
      return;
    }

    this.travelReimbursementExportService.exportTravelReimbursement(exportData).subscribe({
      error: () => {
        this.dialogService.openConfirmDialog('Failed to export travel reimbursement to Excel.');
      }
    });
  }

  private buildExportData(): TravelReimbursementExportData | null {
    if (!this.view || !this.entityId) {
      return null;
    }

    const formValue = this.travelReimbursementForm.getRawValue();
    const items: TravelReimbursementExportItem[] = this.itemsFormArray.controls
      .filter(control => !control.get('isDeleted')?.value)
      .map(control => {
        const itemValue = control.getRawValue();
        return {
          expenseDate: this.toEpoch(itemValue.expenseDate),
          particular: itemValue.particular ?? null,
          amount: itemValue.amount ?? null,
          remarks: itemValue.remarks ?? null,
          billAttached: itemValue.billAttached ?? null
        };
      });

    return {
      entityId: this.entityId,
      employeeName: formValue.employeeName ?? null,
      employeeId: formValue.employeeId ?? null,
      bandGrade: formValue.bandGrade ?? null,
      cityVisited: formValue.cityVisited ?? null,
      projectName: formValue.projectName ?? null,
      projectPin: formValue.projectPin ?? null,
      fromDate: this.toEpoch(formValue.fromDate),
      toDate: this.toEpoch(formValue.toDate),
      preparedBy: formValue.preparedBy ?? null,
      verifiedBy: formValue.verifiedBy ?? null,
      approvedBy: formValue.approvedBy ?? null,
      items
    };
  }

  private submit(isUpdate: boolean): void {
    this.isSubmitted = true;
    this.markAllAsTouched();
    this.travelReimbursementForm.updateValueAndValidity();

    if (isUpdate && !this.entityId) {
      return;
    }

    if (!this.validateBeforeSubmit()) {
      return;
    }

    const payload = this.buildPayload(isUpdate ? this.entityId! : undefined);
    const headers = this.getAuthHeaders();
    this.showLoading = true;

    const request$ = isUpdate
      ? this.travelReimbursementService.updateTravelReimbursement(this.entityId!, payload, headers)
      : this.travelReimbursementService.saveTravelReimbursement(payload, headers);

    const successMessage = isUpdate
      ? 'Travel reimbursement updated successfully.'
      : 'Travel reimbursement saved successfully.';

    request$.subscribe({
      next: () => {
        this.showLoading = false;
        this.dialogService.openConfirmDialog(successMessage)
          .afterClosed().subscribe(() => this.router.navigate(['/searchTravelReimbursement']));
      },
      error: (error) => this.handleApiError(error)
    });
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      employeeName: [null, [Validators.maxLength(100)]],
      employeeId: [null, [Validators.maxLength(6)]],
      cityVisited: [null, [Validators.required, Validators.maxLength(100)]],
      selectedProjectId: [null, Validators.required],
      projectName: [null, [Validators.maxLength(100)]],
      projectPin: [null, [Validators.maxLength(100)]],
      bandGrade: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      preparedBy: [null, [Validators.maxLength(100)]],
      preparedSignatureReference: [null, Validators.maxLength(100)],
      verifiedBy: [null, Validators.maxLength(100)],
      verifiedSignatureReference: [null, Validators.maxLength(100)],
      approvedBy: [null, Validators.maxLength(100)],
      approvedSignatureReference: [null, Validators.maxLength(100)],
      items: this.formBuilder.array([], Validators.required)
    }, { validators: dateRangeValidator });
  }

  private buildBillFilesForItem(item?: TravelReimbursementItem): UploadedFileRecord[] {
    if (item?.billAttached !== 'Y' || !item.billFileReference) {
      return [];
    }
    return this.fileuploadService.getSingleFileArray(item.billFileReference);
  }

  private copyBillFilesFromRow(index: number, item: TravelReimbursementItem): UploadedFileRecord[] {
    if (item.billAttached !== 'Y') {
      return [];
    }

    const billPath = this.fileuploadService.getFirstFilePath(this.itemBillFiles[index] ?? [])
      || item.billFileReference;

    return billPath ? this.fileuploadService.getSingleFileArray(billPath) : [];
  }

  private createItemGroup(item?: TravelReimbursementItem): FormGroup {
    return this.formBuilder.group({
      entityId: [item?.entityId ?? null],
      expenseDate: [item?.expenseDate ? new Date(item.expenseDate) : null, Validators.required],
      particular: [item?.particular ?? null, [Validators.required, Validators.maxLength(100)]],
      amount: [item?.amount ?? null, [Validators.required, Validators.min(0.01), Validators.max(9999999999)]],
      remarks: [item?.remarks ?? null, Validators.maxLength(100)],
      billAttached: [item?.billAttached ?? 'N', Validators.required],
      billFileName: [item?.billFileName ?? null, Validators.maxLength(100)],
      billFileReference: [item?.billFileReference ?? null],
      isDeleted: [item?.isDeleted ?? false]
    });
  }

  private loadProjectList(): void {
    this.travelReimbursementService.getProjectSelectionList(this.getAuthHeaders()).subscribe({
      next: (resp) => {
        this.projectList = resp ?? [];
        this.resolveProjectSelectionIfNeeded();
      },
      error: (error) => this.showError(error, 'Unable to load project list.')
    });
  }

  private populateEmployeeFromProfile(): void {
    this.myprofileService.getProfile(null, this.getAuthHeaders()).subscribe({
      next: (resp: UserProfileSummary) => {
        const employeeName = `${resp.firstName ?? ''} ${resp.lastName ?? ''}`.trim();
        this.travelReimbursementForm.patchValue({
          employeeId: resp.entityId ?? null,
          employeeName,
          preparedBy: employeeName
        });
      },
      error: (error) => this.showError(error, 'Unable to load user profile.')
    });
  }

  private loadTravelReimbursement(entityId: number, disableOnLoad = false): void {
    this.showLoading = true;
    this.travelReimbursementService.getTravelReimbursementById(entityId, this.getAuthHeaders()).subscribe({
      next: (resp: TravelReimbursement) => {
        this.showLoading = false;
        this.patchFormFromResponse(resp);
        if (disableOnLoad) {
          this.disableAllFields();
        }
      },
      error: (error) => this.handleApiError(error)
    });
  }

  private patchFormFromResponse(resp: TravelReimbursement): void {
    this.itemsFormArray.clear();
    this.itemBillFiles = [];

    this.travelReimbursementForm.patchValue({
      employeeName: resp.employeeName ?? null,
      employeeId: resp.employeeId ?? null,
      cityVisited: resp.cityVisited ?? null,
      projectName: resp.projectName ?? null,
      projectPin: resp.projectPin ?? null,
      bandGrade: resp.bandGrade ?? null,
      fromDate: resp.fromDate ? new Date(resp.fromDate) : null,
      toDate: resp.toDate ? new Date(resp.toDate) : null,
      preparedBy: resp.preparedBy ?? null,
      preparedSignatureReference: resp.preparedSignatureReference ?? null,
      verifiedBy: resp.verifiedBy ?? null,
      verifiedSignatureReference: resp.verifiedSignatureReference ?? null,
      approvedBy: resp.approvedBy ?? null,
      approvedSignatureReference: resp.approvedSignatureReference ?? null
    });

    this.preparedSignatureFiles = this.toFileArray(resp.preparedSignatureReference);
    this.verifiedSignatureFiles = this.toFileArray(resp.verifiedSignatureReference);
    this.approvedSignatureFiles = this.toFileArray(resp.approvedSignatureReference);

    const items = resp.items ?? [];
    if (items.length) {
      items.forEach(item => this.addExpenseItem(item));
    } else {
      this.addExpenseItem();
    }

    this.resolveProjectSelectionIfNeeded();
  }

  private resolveProjectSelectionIfNeeded(): void {
    const projectPin = this.travelReimbursementForm.get('projectPin')?.value as string | null;
    if (!projectPin || !this.projectList.length) {
      return;
    }

    const matchedProject = this.projectList.find(project => {
      const pin = this.extractProjectPin(project.selectionvalue);
      return pin && pin.toLowerCase() === projectPin.toLowerCase();
    });

    if (matchedProject) {
      this.travelReimbursementForm.patchValue({ selectedProjectId: matchedProject.selectionid });
    }
  }

  private extractProjectPin(selectionValue: string): string | null {
    const match = selectionValue.match(/\(([^)]+)\)\s*$/);
    return match ? match[1].trim() : null;
  }

  private disableAllFields(): void {
    this.travelReimbursementForm.disable({ emitEvent: false });
    this.itemsFormArray.controls.forEach(control => control.disable({ emitEvent: false }));
  }

  private validateBeforeSubmit(): boolean {
    if (this.travelReimbursementForm.invalid) {
      return false;
    }

    const formValue = this.travelReimbursementForm.getRawValue();
    if (!formValue.projectName || !formValue.projectPin) {
      this.dialogService.openConfirmDialog('Please select a project.');
      return false;
    }

    if (!this.fileuploadService.hasfile(this.preparedSignatureFiles)) {
      this.dialogService.openConfirmDialog('Please upload prepared signature.');
      return false;
    }
    if (!this.fileuploadService.allFilesUploaded(this.preparedSignatureFiles)) {
      this.dialogService.openConfirmDialog('Files uploading...');
      return false;
    }

    const optionalSignatures = [this.verifiedSignatureFiles, this.approvedSignatureFiles];
    for (const files of optionalSignatures) {
      if (files.length > 0 && !this.fileuploadService.allFilesUploaded(files)) {
        this.dialogService.openConfirmDialog('Files uploading...');
        return false;
      }
    }

    const activeItems = this.getActiveItemControls();
    if (!activeItems.length) {
      this.dialogService.openConfirmDialog('At least one expense item is required.');
      return false;
    }

    const fromDate = this.toEpoch(this.travelReimbursementForm.get('fromDate')?.value);
    const toDate = this.toEpoch(this.travelReimbursementForm.get('toDate')?.value);

    for (let index = 0; index < activeItems.length; index++) {
      const itemGroup = activeItems[index];
      if (itemGroup.invalid) {
        return false;
      }

      const expenseDate = this.toEpoch(itemGroup.get('expenseDate')?.value);
      if (fromDate && toDate && expenseDate && (expenseDate < fromDate || expenseDate > toDate)) {
        this.dialogService.openConfirmDialog(`Expense date for item ${index + 1} must be within travel from/to dates.`);
        return false;
      }

      const rowIndex = this.itemsFormArray.controls.indexOf(itemGroup);
      const billAttached = itemGroup.get('billAttached')?.value;
      const billFiles = this.itemBillFiles[rowIndex] ?? [];
      const hasExistingBillReference = !!itemGroup.get('billFileReference')?.value;

      if (billAttached === 'Y' && !this.fileuploadService.hasfile(billFiles) && !hasExistingBillReference) {
        this.dialogService.openConfirmDialog(`Please upload bill file for item ${index + 1}.`);
        return false;
      }

      if (billFiles.length > 0 && !this.fileuploadService.allFilesUploaded(billFiles)) {
        this.dialogService.openConfirmDialog('Files uploading...');
        return false;
      }
    }

    return true;
  }

  private markAllAsTouched(): void {
    this.travelReimbursementForm.markAllAsTouched();
    this.itemsFormArray.controls.forEach(control => {
      if (!control.get('isDeleted')?.value) {
        control.markAllAsTouched();
      }
    });
  }

  private buildPayload(entityId?: number): TravelReimbursementSaveRequest {
    const formValue = this.travelReimbursementForm.getRawValue();
    const fromDate = this.toEpoch(formValue.fromDate);
    const toDate = this.toEpoch(formValue.toDate);

    const items: TravelReimbursementItemRequest[] = this.itemsFormArray.controls.map((control, index) => {
      const itemValue = (control as FormGroup).getRawValue();
      const billFiles = this.itemBillFiles[index] ?? [];
      const billFileReference = this.fileuploadService.getFirstFilePath(billFiles) || itemValue.billFileReference;

      return {
        entityId: itemValue.entityId ?? null,
        expenseDate: this.toEpoch(itemValue.expenseDate) ?? 0,
        particular: itemValue.particular,
        amount: Number(itemValue.amount),
        remarks: itemValue.remarks ?? null,
        billAttached: itemValue.billAttached,
        billFileName: itemValue.billFileName ?? (billFiles[0]?.uploadedFileName ?? null),
        billFileReference: billFileReference || null,
        isDeleted: itemValue.isDeleted ? true : null
      };
    });

    return {
      entityId: entityId ?? null,
      employeeId: formValue.employeeId,
      employeeName: formValue.employeeName,
      cityVisited: formValue.cityVisited,
      projectName: formValue.projectName,
      projectPin: formValue.projectPin,
      bandGrade: formValue.bandGrade,
      fromDate: fromDate ?? 0,
      toDate: toDate ?? 0,
      preparedBy: formValue.preparedBy,
      preparedSignatureReference: this.fileuploadService.getFirstFilePath(this.preparedSignatureFiles)
        || formValue.preparedSignatureReference,
      verifiedBy: formValue.verifiedBy ?? null,
      verifiedSignatureReference: this.fileuploadService.getFirstFilePath(this.verifiedSignatureFiles)
        || formValue.verifiedSignatureReference,
      approvedBy: formValue.approvedBy ?? null,
      approvedSignatureReference: this.fileuploadService.getFirstFilePath(this.approvedSignatureFiles)
        || formValue.approvedSignatureReference,
      items
    };
  }

  private getActiveItemControls(): FormGroup[] {
    return this.itemsFormArray.controls
      .filter(control => !control.get('isDeleted')?.value)
      .map(control => control as FormGroup);
  }

  private toFileArray(fileReference?: string | null): UploadedFileRecord[] {
    return fileReference ? this.fileuploadService.getSingleFileArray(fileReference) : [];
  }

  private toEpoch(value: Date | number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return value;
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed.getTime();
  }

  private getAuthHeaders(): Record<string, string> {
    return { Authorization: sessionStorage.getItem('token') ?? '' };
  }

  private showError(error: { error?: { errorDetail?: string[] }; message?: string }, fallback: string): void {
    const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? fallback;
    this.dialogService.openConfirmDialog(errStr);
  }

  private handleApiError(error: { error?: { errorDetail?: string[] }; message?: string }): void {
    this.showLoading = false;
    this.showError(error, 'Request failed.');
  }
}
