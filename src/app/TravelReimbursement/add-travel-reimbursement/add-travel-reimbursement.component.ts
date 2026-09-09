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
    this.itemBillFiles.push(
      item?.billFileReference
        ? this.fileuploadService.getSingleFileArray(item.billFileReference)
        : []
    );
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

    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.projectMasterService.projectById(projectId, headers).subscribe({
      next: (resp: ProjectDetails) => {
        this.travelReimbursementForm.patchValue({
          projectName: resp.projectName ?? null,
          projectPin: resp.projectPin ?? null
        });
      },
      error: (error) => {
        const errStr = error?.error?.errorDetail?.[0] ?? 'Unable to load project details.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }

  saveTravelReimbursement(): void {
    this.isSubmitted = true;
    this.travelReimbursementForm.updateValueAndValidity();

    if (!this.validateBeforeSubmit()) {
      return;
    }

    const payload = this.buildPayload();
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;

    this.travelReimbursementService.saveTravelReimbursement(payload, headers).subscribe({
      next: () => {
        this.showLoading = false;
        this.dialogService.openConfirmDialog('Travel reimbursement saved successfully.')
          .afterClosed().subscribe(() => this.router.navigate(['/searchTravelReimbursement']));
      },
      error: (error) => this.handleApiError(error)
    });
  }

  updateTravelReimbursement(): void {
    this.isSubmitted = true;
    this.travelReimbursementForm.updateValueAndValidity();

    if (!this.entityId || !this.validateBeforeSubmit()) {
      return;
    }

    const payload = this.buildPayload(this.entityId);
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;

    this.travelReimbursementService.updateTravelReimbursement(this.entityId, payload, headers).subscribe({
      next: () => {
        this.showLoading = false;
        this.dialogService.openConfirmDialog('Travel reimbursement updated successfully.')
          .afterClosed().subscribe(() => this.router.navigate(['/searchTravelReimbursement']));
      },
      error: (error) => this.handleApiError(error)
    });
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      employeeName: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(100)]],
      employeeId: [{ value: null, disabled: true }, [Validators.required]],
      cityVisited: [null, [Validators.required, Validators.maxLength(100)]],
      selectedProjectId: [null, Validators.required],
      projectName: [null, [Validators.required, Validators.maxLength(100)]],
      projectPin: [null, [Validators.required, Validators.maxLength(100)]],
      bandGrade: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      preparedBy: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(100)]],
      preparedSignatureReference: [null, [Validators.required, Validators.maxLength(100)]],
      verifiedBy: [null, Validators.maxLength(100)],
      verifiedSignatureReference: [null, Validators.maxLength(100)],
      approvedBy: [null, Validators.maxLength(100)],
      approvedSignatureReference: [null, Validators.maxLength(100)],
      items: this.formBuilder.array([], Validators.required)
    }, { validators: this.dateRangeValidator });
  }

  private createItemGroup(item?: TravelReimbursementItem): FormGroup {
    return this.formBuilder.group({
      entityId: [item?.entityId ?? null],
      expenseDate: [item?.expenseDate ? new Date(item.expenseDate) : null, Validators.required],
      particular: [item?.particular ?? null, [Validators.required, Validators.maxLength(100)]],
      amount: [item?.amount ?? null, [Validators.required, Validators.min(0.01), Validators.max(9999999999)]],
      remarks: [item?.remarks ?? null, Validators.maxLength(100)],
      billAttached: [item?.billAttached ?? null, Validators.required],
      billFileName: [item?.billFileName ?? null, Validators.maxLength(100)],
      billFileReference: [item?.billFileReference ?? null],
      isDeleted: [item?.isDeleted ?? false]
    });
  }

  private dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const fromDate = group.get('fromDate')?.value;
    const toDate = group.get('toDate')?.value;
    if (fromDate && toDate && new Date(fromDate).getTime() > new Date(toDate).getTime()) {
      return { dateRange: true };
    }
    return null;
  }

  private loadProjectList(): void {
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.travelReimbursementService.getProjectSelectionList(headers).subscribe({
      next: (resp) => {
        this.projectList = resp ?? [];
        this.resolveProjectSelectionIfNeeded();
      },
      error: (error) => {
        const errStr = error?.error?.errorDetail?.[0] ?? 'Unable to load project list.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }

  private populateEmployeeFromProfile(): void {
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.myprofileService.getProfile(null, headers).subscribe({
      next: (resp: UserProfileSummary) => {
        const employeeName = `${resp.firstName ?? ''} ${resp.lastName ?? ''}`.trim();
        this.travelReimbursementForm.patchValue({
          employeeId: resp.entityId ?? null,
          employeeName,
          preparedBy: employeeName
        });
      },
      error: (error) => {
        const errStr = error?.error?.errorDetail?.[0] ?? 'Unable to load user profile.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }

  private loadTravelReimbursement(entityId: number, disableOnLoad = false): void {
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;
    this.travelReimbursementService.getTravelReimbursementById(entityId, headers).subscribe({
      next: (resp: TravelReimbursement) => {
        this.showLoading = false;
        this.patchFormFromResponse(resp);
        if (disableOnLoad) {
          this.disableAllFields();
        }
      },
      error: (error) => {
        this.showLoading = false;
        this.handleApiError(error);
      }
    });
  }

  private patchFormFromResponse(resp: TravelReimbursement): void {
    while (this.itemsFormArray.length) {
      this.itemsFormArray.removeAt(0);
    }
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

    this.preparedSignatureFiles = resp.preparedSignatureReference
      ? this.fileuploadService.getSingleFileArray(resp.preparedSignatureReference)
      : [];
    this.verifiedSignatureFiles = resp.verifiedSignatureReference
      ? this.fileuploadService.getSingleFileArray(resp.verifiedSignatureReference)
      : [];
    this.approvedSignatureFiles = resp.approvedSignatureReference
      ? this.fileuploadService.getSingleFileArray(resp.approvedSignatureReference)
      : [];

    const items = resp.items ?? [];
    if (items.length) {
      items.forEach(item => this.addExpenseItem(item));
    } else {
      this.addExpenseItem();
    }

    this.resolveProjectSelectionIfNeeded();
  }

  private resolveProjectSelectionIfNeeded(): void {
    const projectName = this.travelReimbursementForm.get('projectName')?.value as string | null;
    const projectPin = this.travelReimbursementForm.get('projectPin')?.value as string | null;
    if (!projectName || !projectPin || !this.projectList.length) {
      return;
    }

    const matchedProject = this.projectList.find(project => {
      const pin = this.extractProjectPin(project.selectionvalue);
      return pin && projectPin && pin.toLowerCase() === projectPin.toLowerCase();
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

    if (!this.fileuploadService.hasfile(this.preparedSignatureFiles)) {
      this.dialogService.openConfirmDialog('Please upload prepared signature.');
      return false;
    }

    if (!this.fileuploadService.allFilesUploaded(this.preparedSignatureFiles)) {
      this.dialogService.openConfirmDialog('Prepared signature is still uploading.');
      return false;
    }

    if (this.verifiedSignatureFiles.length
      && !this.fileuploadService.allFilesUploaded(this.verifiedSignatureFiles)) {
      this.dialogService.openConfirmDialog('Verified signature is still uploading.');
      return false;
    }

    if (this.approvedSignatureFiles.length
      && !this.fileuploadService.allFilesUploaded(this.approvedSignatureFiles)) {
      this.dialogService.openConfirmDialog('Approved signature is still uploading.');
      return false;
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
      const billFiles = this.itemBillFiles[rowIndex] ?? [];
      if (billFiles.length && !this.fileuploadService.allFilesUploaded(billFiles)) {
        this.dialogService.openConfirmDialog(`Bill file for item ${index + 1} is still uploading.`);
        return false;
      }
    }

    return true;
  }

  private buildPayload(entityId?: number): TravelReimbursementSaveRequest {
    const formValue = this.travelReimbursementForm.getRawValue();
    const fromDate = this.toEpoch(formValue.fromDate);
    const toDate = this.toEpoch(formValue.toDate);

    const items: TravelReimbursementItemRequest[] = this.itemsFormArray.controls.map((control, index) => {
      const itemValue = (control as FormGroup).getRawValue();
      const billFiles = this.itemBillFiles[index] ?? [];
      const billFileReference = billFiles.length
        ? this.fileuploadService.getFirstFilePath(billFiles)
        : itemValue.billFileReference;

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
      preparedSignatureReference: this.fileuploadService.getFirstFilePath(this.preparedSignatureFiles),
      verifiedBy: formValue.verifiedBy ?? null,
      verifiedSignatureReference: this.verifiedSignatureFiles.length
        ? this.fileuploadService.getFirstFilePath(this.verifiedSignatureFiles)
        : null,
      approvedBy: formValue.approvedBy ?? null,
      approvedSignatureReference: this.approvedSignatureFiles.length
        ? this.fileuploadService.getFirstFilePath(this.approvedSignatureFiles)
        : null,
      items
    };
  }

  private getActiveItemControls(): FormGroup[] {
    return this.itemsFormArray.controls
      .filter(control => !control.get('isDeleted')?.value)
      .map(control => control as FormGroup);
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

  private handleApiError(error: { error?: { errorDetail?: string[] }; message?: string }): void {
    this.showLoading = false;
    const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? 'Request failed.';
    this.dialogService.openConfirmDialog(errStr);
  }
}
