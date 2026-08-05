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
  rcDisplayedColumns: string[] = ['rateContractNo', 'contractDate', 'validTill', 'maxLimit', 'rcStatus'];
  rcFilterData = { rateContractNo: null, organisationId: null, supplierName: null, department: null };
  totalRcRecords: number = 0;
  itemPerPage = this._global.pageNumer;
  pageSizedisplay = this._global.pageSize;
  @ViewChild('rcPaginator', { static: true }) rcPaginator: MatPaginator;

  dashboardCount = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.dashboardService.getCount(headers).subscribe(resp => {
      this.dashboardData = resp[0];
      this.pieChartBrowser();
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
      this.rcListData = new MatTableDataSource(resp.content || []);
      this.rcListData.paginator = this.rcPaginator;
      this.totalRcRecords = this.rcListData.data.length;
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
    Highcharts.chart('pieChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Summary'
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
          colorByPoint: true,
          type: undefined,
          data: [
            {
              name: 'Total Assets',
              y: this.dashboardData.assets,
              sliced: true,
              selected: true
            },
            {
              name: 'Tickets Raised',
              y: this.dashboardData.tickets
            }]
        }
      ]
    });
  }
}
