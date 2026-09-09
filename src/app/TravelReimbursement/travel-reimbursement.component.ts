import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AppGlobals } from '../global/app.global';
import { DialogService } from '../service/dialog.service';
import { TravelReimbursementService } from './travel-reimbursement.service';
import { TravelReimbursement } from './models/travel-reimbursement.model';

@Component({
  selector: 'app-travel-reimbursement',
  templateUrl: './travel-reimbursement.component.html',
  providers: [TravelReimbursementService, AppGlobals, DialogService],
  standalone: false
})
export class TravelReimbursementComponent implements OnInit {

  displayedColumns: string[] = [
    'employeeName',
    'projectName',
    'cityVisited',
    'fromDate',
    'toDate',
    'totalAmount',
    'action'
  ];

  travelReimbursementList: MatTableDataSource<TravelReimbursement> =
    new MatTableDataSource<TravelReimbursement>([]);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  showLoading = false;
  totalRecords = 0;
  itemPerPage = this.global.pageNumer;
  pageSizedisplay = this.global.pageSize;
  PageTitle = 'Travel Reimbursement';

  travelReimbursementAdd = false;
  travelReimbursementEdit = false;
  travelReimbursementView = false;

  constructor(
    private router: Router,
    private travelReimbursementService: TravelReimbursementService,
    private global: AppGlobals,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.travelReimbursementAdd = this.global.UserRights?.includes('TRAVEL_REIMBURSEMENT_ADD') ?? true;
    this.travelReimbursementEdit = this.global.UserRights?.includes('TRAVEL_REIMBURSEMENT_EDIT') ?? true;
    this.travelReimbursementView = this.global.UserRights?.includes('TRAVEL_REIMBURSEMENT_VIEW') ?? true;
    this.loadList();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.travelReimbursementList.filter = filterValue.trim().toLowerCase();
    this.totalRecords = this.travelReimbursementList.filteredData.length;
  }

  addTravelReimbursement(): void {
    this.router.navigate(['/addTravelReimbursement']);
  }

  loadList(): void {
    const headers = { Authorization: sessionStorage.getItem('token') ?? '' };
    this.showLoading = true;
    this.travelReimbursementService.getMyTravelReimbursements(headers).subscribe({
      next: (resp) => {
        this.travelReimbursementList = new MatTableDataSource(resp ?? []);
        this.travelReimbursementList.sort = this.sort;
        this.travelReimbursementList.paginator = this.paginator;
        this.totalRecords = this.travelReimbursementList.data.length;
        this.showLoading = false;
      },
      error: (error) => {
        this.showLoading = false;
        const errStr = error?.error?.errorDetail?.[0] ?? error?.message ?? 'Unable to load travel reimbursements.';
        this.dialogService.openConfirmDialog(errStr);
      }
    });
  }
}
