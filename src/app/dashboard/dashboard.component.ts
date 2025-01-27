import { Component, OnInit } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
//import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../global/app.global';
import { DialogService } from '../service/dialog.service';
import { DashboardService } from './dashboard.service';
//import * as HighCharts from 'highcharts';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [DashboardService, DialogService, AppGlobals]
})
export class DashboardComponent implements OnInit {
  constructor(private dashboardService: DashboardService, private dialogService: DialogService,
    private _global: AppGlobals,) { }
  showLoading: boolean = false;
  dashboardData: any = [];
  errorMessage: string = "";

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


  ngOnInit(): void {
    this.dashboardCount();

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
