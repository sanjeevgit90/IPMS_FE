import { Component, OnInit, ViewChild } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../global/app.global';
import { DialogService } from '../service/dialog.service';
import { DashboardService } from './dashboard.service';
import { RateContractService } from '../OrderMgmt/rate-contract/rate-contract.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
//import * as HighCharts from 'highcharts';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    providers: [DashboardService, DialogService, AppGlobals, RateContractService],
    standalone: false
})
export class DashboardComponent implements OnInit {
  constructor(private dashboardService: DashboardService, private dialogService: DialogService,
    private _global: AppGlobals,
    private router: Router,
    private rateContractService: RateContractService) { }
  showLoading: boolean = false;
  showRcLoading: boolean = false;
  dashboardData: any = [];
  errorMessage: string = "";
  rcListData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  rcMasterList: any[] = [];
  rcStatusFilter: 'Active' | 'Expired' | null = null;
  rcDisplayedColumns: string[] = ['rateContractNo', 'contractDate', 'validTill', 'maxLimit', 'rcStatus'];
  rcFilterData = { rateContractNo: null, organisationId: null, supplierName: null, department: null };
  totalRcRecords: number = 0;
  rcActiveCount: number = 0;
  rcExpiredCount: number = 0;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  @ViewChild('rcPaginator', { static: true }) rcPaginator: MatPaginator;

  dashboardCount = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dashboardService.getCount(headers).subscribe(resp => {
      this.dashboardData = resp[0];
      this.columnChartBrowser();
      console.log(this.dashboardData);
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      if (error.statusText == "Unknown Error") {
        this.dialogService.openConfirmDialog("Your session has been expired");
        this.router.navigate(['/']);
      }
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }

  navigateToPage(pageName: string) {
    switch (pageName) {
      case "PO_PENDING":
              this.router.navigate(['/searchTask']);
        break;
      case "PRS_PENDING":
              this.router.navigate(['/searchPrsTask']);
        break;  
    }
  }

  loadRcList = function () {
    const headers = { Authorization: sessionStorage.getItem('token') };
    this.showRcLoading = true;
    this.rateContractService.getAllRcFromView(this.rcFilterData, headers).subscribe(resp => {
      const sortedContent = this.sortRcListByStatus(resp.content || []);
      this.rcMasterList = sortedContent;
      this.rcStatusFilter = null;
      this.applyRcTableFilter();
      this.updateRcPieChartCounts(sortedContent);
      this.pieChartBrowser();
      this.showRcLoading = false;
    }, (error: any) => {
      this.showRcLoading = false;
      if (error.statusText == 'Unknown Error') {
        this.dialogService.openConfirmDialog('Your session has been expired');
        this.router.navigate(['/']);
        return;
      }
      const errStr = error.error?.errorDetail?.[0] || error.message;
      this.dialogService.openConfirmDialog(errStr);
    });
  }

  getRcStatus(validTill: any): string {
    if (validTill == null || validTill === '') {
      return 'Active';
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const validDate = new Date(validTill);
    if (isNaN(validDate.getTime())) {
      return 'Active';
    }
    validDate.setHours(0, 0, 0, 0);
    return validDate < today ? 'Expired' : 'Active';
  }

  sortRcListByStatus(content: any[]): any[] {
    return [...content].sort((a, b) => {
      const aOrder = this.getRcStatus(a.validTill) === 'Expired' ? 1 : 0;
      const bOrder = this.getRcStatus(b.validTill) === 'Expired' ? 1 : 0;
      return aOrder - bOrder;
    });
  }

  updateRcPieChartCounts(content: any[]): void {
    this.rcActiveCount = 0;
    this.rcExpiredCount = 0;
    content.forEach(rc => {
      if (this.getRcStatus(rc.validTill) === 'Expired') {
        this.rcExpiredCount++;
      } else {
        this.rcActiveCount++;
      }
    });
  }

  applyRcTableFilter(): void {
    const filtered = this.rcStatusFilter
      ? this.rcMasterList.filter(rc => this.getRcStatus(rc.validTill) === this.rcStatusFilter)
      : this.rcMasterList;
    this.rcListData = new MatTableDataSource(filtered);
    this.rcListData.paginator = this.rcPaginator;
    this.totalRcRecords = filtered.length;
  }

  onPieSliceClick(status: 'Active' | 'Expired'): void {
    this.rcStatusFilter = this.rcStatusFilter === status ? null : status;
    this.applyRcTableFilter();
    this.pieChartBrowser();
  }

  clearRcStatusFilter(): void {
    if (!this.rcStatusFilter) {
      return;
    }
    this.rcStatusFilter = null;
    this.applyRcTableFilter();
    this.pieChartBrowser();
  }

  ngOnInit(): void {
    this.dashboardCount();
    this.loadRcList();
  }

  columnChartBrowser() {
    Highcharts.chart('columnChart', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Summary'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Total'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          }
        }
      },
      series: [
        {
          name: '',
          colorByPoint: true,
          type: undefined,
          data: [{
            name: 'RC Approved',
            y: this.dashboardData.approvedrc
          }, {
            name: 'RC Pending',
            y: this.dashboardData.pendingrc
          }, {
            name: 'PO Approved',
            y: this.dashboardData.approvedpo,
          }, {
            name: 'PO Pending',
            y: this.dashboardData.pendingpo
          }, {
            name: 'Vendor Invoice Approved',
            y: this.dashboardData.approvedprs
          }, {
            name: 'Vendor Invoice Pending',
            y: this.dashboardData.pendingprs
          }]
        }
      ]
    });
  }
  pieChartBrowser() {
    const self = this;
    Highcharts.chart('pieChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        events: {
          click: function (event: Highcharts.PointerEventObject) {
            const target = event.target;
            if (target instanceof Element && !target.closest('.highcharts-point')) {
              self.clearRcStatusFilter();
            }
          }
        }
      },
      title: {
        text: 'Rate Contract'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      accessibility: {
        point: {
          valueSuffix: ''
        }
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                const status = this.name === 'Active RC' ? 'Active' : 'Expired';
                self.onPieSliceClick(status);
              }
            }
          }
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          },
          showInLegend: true
        }
      },
      series: [
        {
          name: '',
          type: undefined,
          data: [
            {
              name: 'Active RC',
              y: this.rcActiveCount,
              color: '#55ce63',
              sliced: this.rcStatusFilter === 'Active',
              selected: this.rcStatusFilter === 'Active'
            },
            {
              name: 'Expired RC',
              y: this.rcExpiredCount,
              color: '#f62d51',
              sliced: this.rcStatusFilter === 'Expired',
              selected: this.rcStatusFilter === 'Expired'
            }]
        }
      ]
    });
  }
}
