import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { LoaderComponent } from './layout/loader/loader.component';
import { HeaderComponent } from './layout/header/header.component';
import { LeftmenuComponent } from './layout/leftmenu/leftmenu.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { OnlynumberDirective } from './directive/onlynumber.directive';
import { HsnMasterComponent } from './AssetMgmt/HsnMaster/hsn-master.component';
import { DepartmentComponent } from './ConfigurationMgmt/department/department.component';
import { OrganizationComponent } from './ConfigurationMgmt/organization/organization.component';
import { GeographyComponent } from './UniqueSiteId/geography/geography.component';
import { CityComponent } from './UniqueSiteId/city/city.component';
import { PoliceStationComponent } from './UniqueSiteId/police-station/police-station.component';
import { FamilyComponent } from './ConfigurationMgmt/family/family.component';
import { UserProfileComponent } from './ConfigurationMgmt/user-profile/user-profile.component';
import { AddUserComponent } from './ConfigurationMgmt/user-profile/add-user/add-user.component';
import { MenuComponent } from './ConfigurationMgmt/menu/menu.component';
import { ModelMasterComponent } from './AssetMgmt/ModelMaster/modelmaster.component';
import { ManufacturerComponent } from './AssetMgmt/Manufacturer/manufacturer.component';
import { CategoryMasterComponent } from './AssetMgmt/CategoryMaster/categorymaster.component';
import { AssetConstantMasterComponent } from './AssetMgmt/AssetConstantMaster/assetconstantmaster.component';
import { ProductMasterComponent } from './AssetMgmt/ProductMaster/productmaster.component';
import { AddProductComponent } from './AssetMgmt/ProductMaster/addproduct/addproduct.component';
import { AssetMasterComponent } from './AssetMgmt/AssetMaster/assetmaster.component';
import { AddAssetComponent } from './AssetMgmt/AssetMaster/addasset/addasset.component';
import { AssetAuditComponent } from './AssetMgmt/AssetMaster/assetaudit/assetaudit.component';
import { MatDialogModule } from "@angular/material/dialog";
import { DeliveryChallanComponent } from './AssetMgmt/DeliveryChallan/dc.component';
import { AddDeliveryChallanComponent } from './AssetMgmt/DeliveryChallan/adddc/adddc.component';
import { SearchAssetComponent } from './AssetMgmt/DeliveryChallan/searchAsset/searchasset.component';
import { UpdateDCAssetComponent } from './AssetMgmt/DeliveryChallan/addasset/updateasset.component';

import { AddInterDCComponent } from './AssetMgmt/InterDistrictDeliveryChallan/adddc/interDCAddcomponent';
import { InterDistrictDCComponent } from './AssetMgmt/InterDistrictDeliveryChallan/interDC.component';
import { OEMDCComponent } from './AssetMgmt/OEMDeliveryChallan/oemdc.component';
import { AddOEMDCComponent } from './AssetMgmt/OEMDeliveryChallan/adddc/addoemdc.component';
import { CityWiseAssetReportComponent } from './AssetMgmt/CityWiseAssetReport/citywiseasset.component';
import { OEMActionComponent } from './AssetMgmt/OEMDeliveryChallan/assetaction/assetaction.component';
import { ActionComponent } from './AssetMgmt/InterDistrictDeliveryChallan/action/action.component';
import { ViewInterDistrictDCComponent } from './AssetMgmt/InterDistrictDeliveryChallan/viewDC/viewInterDistrictDC.component';
import { ViewOEMDCComponent } from './AssetMgmt/OEMDeliveryChallan/viewDC/viewOEMDC.component';
import { ViewDeliveryChallanComponent } from './AssetMgmt/DeliveryChallan/viewDC/viewDC.component';
import { AddCityInstallationComponent } from './AssetMgmt/CityAssetInstallationReport/generateReport/addcityassetinstallation.component';
import { CityInstallationComponent } from './AssetMgmt/CityAssetInstallationReport/cityassetinstallation.component';
import { AssetCountReportComponent } from './AssetMgmt/AssetCountReport/assetcountreport.component';

import { TicketCategoryComponent } from './HelpdeskMgmt/ticket-category/ticket-category.component';
import { TicketProblemReportComponent } from './HelpdeskMgmt/ticket-problem-report/ticket-problem-report.component';
import { TicketClassificationComponent } from './HelpdeskMgmt/ticket-classification/ticket-classification.component';
import { TicketMasterComponent } from './HelpdeskMgmt/ticket-master/ticket-master.component';
import { AddTicketComponent } from './HelpdeskMgmt/ticket-master/add-ticket/add-ticket.component';
import { VehicleMasterComponent } from './HelpdeskMgmt/vehicle-master/vehicle-master.component';
import { AddVehicleComponent } from './HelpdeskMgmt/vehicle-master/add-vehicle/add-vehicle.component';
import { LicenseMasterComponent } from './HelpdeskMgmt/license-master/license-master.component';
import { AddLicenseComponent } from './HelpdeskMgmt/license-master/add-license/add-license.component';
import { VehicleServiceMasterComponent } from './HelpdeskMgmt/vehicle-service-master/vehicle-service-master.component';
import { AddVehicleServiceComponent } from './HelpdeskMgmt/vehicle-service-master/add-vehicle-service/add-vehicle-service.component';
import { TicketTaskComponent } from './HelpdeskMgmt/ticket-master/ticket-task/ticket-task.component';
import { AddTaskComponent } from './HelpdeskMgmt/ticket-master/ticket-task/add-task/add-task.component';
import { AddTripComponent } from './HelpdeskMgmt/ticket-master/ticket-task/add-trip/add-trip.component';
import { PartyMasterComponent } from './VendorMgmt/party-master/party-master.component';
import { AddPartyComponent } from './VendorMgmt/party-master/add-party/add-party.component';
import { AddressMasterComponent } from './VendorMgmt/address-master/address-master.component';
import { AddAddressComponent } from './VendorMgmt/address-master/add-address/add-address.component';
import { PartyGstComponent } from './VendorMgmt/party-gst/party-gst.component';
import { PoPaymentComponent } from './OrderMgmt/po-payment/po-payment.component';
import { AddPaymentComponent } from './OrderMgmt/po-payment/add-payment/add-payment.component';
import { RoleComponent } from './ConfigurationMgmt/role/role.component';
import { AddRoleComponent } from './ConfigurationMgmt/role/add-role/add-role.component';
import { MyprofileComponent } from './ConfigurationMgmt/myprofile/myprofile.component';
import { TripaddressDirective } from './directive/tripaddress.directive';
import { ConstantMasterComponent } from './OrderMgmt/constant-master/constant-master.component';
import { BoqMasterComponent } from './OrderMgmt/boq-master/boq-master.component';
import { AddBoqComponent } from './OrderMgmt/boq-master/add-boq/add-boq.component';
import { PurchaseOrderComponent } from './OrderMgmt/purchase-order/purchase-order.component';
import { AddPoComponent } from './OrderMgmt/purchase-order/add-po/add-po.component';
import { PotabComponent } from './layout/potab/potab.component';
import { ProductDetailsComponent } from './OrderMgmt/product-details/product-details.component';
import { AddProductDetailsComponent } from './OrderMgmt/product-details/add-product-details/add-product-details.component';
import { VendortabComponent } from './layout/vendortab/vendortab.component';
import { ViewPoComponent } from './OrderMgmt/purchase-order/view-po/view-po.component';
import { USIDInstallationComponent } from './AssetMgmt/USIDAssetInstallationReport/USIDassetinstallation.component';
import { AddUSIDInstallationComponent } from './AssetMgmt/USIDAssetInstallationReport/generateReport/generateassetinstallation.component';

import { ProjectApprovalTaskComponent } from './ProjectMgmt/ProjectApproval/projectapproval.component';
import { ProjectMasterComponent } from './ProjectMgmt/ProjectMaster/projectmaster.component';
import { ViewProjectComponent } from './ProjectMgmt/ProjectMaster/viewproject/viewproject.component';
import { AddProjectComponent } from './ProjectMgmt/ProjectMaster/addproject/addproject.component';

import { BillingScheduleComponent } from './BillingMgmt/BillingSchedule/billingschedule.component';
import { AddScheduleComponent } from './BillingMgmt/BillingSchedule/addbillingschedule/addschedule.component';
import { AddInvoiceComponent } from './BillingMgmt/Invoice/addinvoice/addinvoice.component';
import { InvoiceTaskComponent } from './BillingMgmt/Invoice/invoicetask/invoicetask.component';
import { ViewInvoiceComponent } from './BillingMgmt/Invoice/viewinvoice/viewinvoice.component';
import { InvoiceComponent } from './BillingMgmt/Invoice/invoice.component';
import { CollectionTaggingComponent } from './BillingMgmt/CollectionTagging/collectiontagging.component';
import { AddCollectionComponent } from './BillingMgmt/CollectionTagging/addcollection/addcollection.component';
import { CollectionTaskComponent } from './BillingMgmt/CollectionTagging/collectiontask/collectiontask.component';
import { CollectionActionComponent } from './BillingMgmt/CollectionTagging/collectiontask/action/action.component';
import { InvoiceAgeingReportComponent } from './BillingMgmt/BillingReport/ageingreport/invoicereport.component';
import { BillingComparsionomponent } from './BillingMgmt/BillingReport/billingcomparison/billingcomparsion.component';
import { MonthlyBillingComponent } from './BillingMgmt/BillingReport/monthlybilling/monthlybilling.component';
import { MonthlyCollectionComponent } from './BillingMgmt/BillingReport/monthlycollection/monthlycollection.component';

import { PRSComponent } from './OrderMgmt/prs-master/prs.component';
import { AddPrsComponent } from './OrderMgmt/prs-master/add-prs/add-prs.component';
import { ViewPRSComponent } from './OrderMgmt/prs-master/view-prs/view-prs.component';
import { PrsTaskComponent } from './OrderMgmt/prs-master/prstask/prstask.component';
import { PrsActionComponent } from './OrderMgmt/prs-master/prstask/action/prsaction.component';
import { AddVendorPaymentComponent } from './OrderMgmt/vendor-payment-collection/add-payments/add-payments.component';
import { VendorPaymentsComponent } from './OrderMgmt/vendor-payment-collection/payments.component';

import { UpdatePoTaskComponent } from './OrderMgmt/purchase-order-task/update-po-task/update-po-task.component';
import { PurchaseOrderTaskComponent } from './OrderMgmt/purchase-order-task/purchase-order-task.component';
import { RateContractComponent } from './OrderMgmt/rate-contract/rate-contract.component';
import { AddRcComponent } from './OrderMgmt/rate-contract/add-rc/add-rc.component';
import { ViewRcComponent } from './OrderMgmt/rate-contract/view-rc/view-rc.component';
import { RcProductDetailsComponent } from './OrderMgmt/rc-product-details/rc-product-details.component';
import { AddRcProductDetailsComponent } from './OrderMgmt/rc-product-details/add-rc-product-details/add-rc-product-details.component';
import { PoFulfilmentComponent } from './OrderMgmt/po-fulfilment/po-fulfilment.component';
import { AddPoFulfilmentComponent } from './OrderMgmt/po-fulfilment/add-po-fulfilment/add-po-fulfilment.component';
import { VendorComparisonComponent } from './OrderMgmt/vendor-comparison/vendor-comparison.component';
import { AddVendorComparisonComponent } from './OrderMgmt/vendor-comparison/add-vendor-comparison/add-vendor-comparison.component';
import { AdditionalTermsComponent } from './OrderMgmt/purchase-order/additional-terms/additional-terms.component';
import { RcAdditionalTermsComponent } from './OrderMgmt/rate-contract/rc-additional-terms/rc-additional-terms.component';
import { LocationComponent } from './UniqueSiteId/location/location.component';
import { AddLocationComponent } from './UniqueSiteId/location/add-location/add-location.component';
import { FileuploadComponent } from './global/fileupload/fileupload.component';
import { ViewUSIDInstallationReport } from './AssetMgmt/USIDAssetInstallationReport/viewReport/viewInstallationReport.component';
import { ViewCityInstallationReport } from './AssetMgmt/CityAssetInstallationReport/viewReport/viewCityInstallationReport.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { TicketAgeingReportComponent } from './HelpdeskMgmt/ticket-report/ageing-report/ageing-report.component';
import { TicketEscalationReportComponent } from './HelpdeskMgmt/ticket-report/escalated-report/escalated-report.component';
import { TicketIncidentReportComponent } from './HelpdeskMgmt/ticket-report/incident-report/incident-report.component';
import { OrphanTripsComponent } from './HelpdeskMgmt/ticket-report/orphan-trips-report/orphan-trips.component';
import { TicketMISComponent } from './HelpdeskMgmt/ticket-report/ticket-mis-report/ticket-mis-report.component';
import { TicketSLAReportComponent } from './HelpdeskMgmt/ticket-report/sla-report/sla-report.component';
import { ViewWorkflowComponent } from './OrderMgmt/purchase-order-task/view-workflow/view-workflow.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SupportTeamComponent } from 'src/app/HelpdeskMgmt/support-team/support-team.component';
import { AddSupportTeamComponent } from './HelpdeskMgmt/support-team/add-support-team/add-support-team.component';
import { CancelPoTaskComponent } from './OrderMgmt/purchase-order-task/cancel-po-task/cancel-po-task.component';
import { MonthlyPaymentComponent } from './OrderMgmt/Reports/monthly-payment/monthly-payment.component';
import { PendingPaymentComponent } from './OrderMgmt/Reports/pending-payment/pending-payment.component';
import { PrsReportComponent } from './OrderMgmt/Reports/prs-report/prs-report.component';
import { PoCriteriaReportComponent } from './OrderMgmt/Reports/po-criteria-report/po-criteria-report.component';
import { PoWiseProductReportComponent } from './OrderMgmt/Reports/po-wise-product-report/po-wise-product-report.component';
import { StatusWisePoReportComponent } from './OrderMgmt/Reports/status-wise-po-report/status-wise-po-report.component';
import { ProjectVendorWisePoReportComponent } from './OrderMgmt/Reports/project-vendor-wise-po-report/project-vendor-wise-po-report.component';
import { ChangePasswordComponent } from './ConfigurationMgmt/change-password/change-password.component';
import { ForgotPasswordComponent } from './ConfigurationMgmt/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './ConfigurationMgmt/reset-password/reset-password.component';
import { AssetTPAComponent } from './AssetMgmt/AssetTPA/assetTPA.component';
import { GrnMasterComponent } from './OrderMgmt/grn-master/grn-master.component';
import { AddGrnComponent } from './OrderMgmt/grn-master/add-grn/add-grn.component';
import { GrnTaskComponent } from './OrderMgmt/grn-task/grn-task.component';
import { UpdateGrnTaskComponent } from './OrderMgmt/grn-task/update-grn-task/update-grn-task.component';
import { HistoryTaskComponent } from './OrderMgmt/purchase-order-task/history-task/history-task.component';
import { CurrencyMasterComponent } from './HelpdeskMgmt/currency-master/currency-master.component';
import { GrnReportComponent } from './OrderMgmt/Reports/grn-report/grn-report.component';
import { ProjectdetailsComponent } from './ProjectMgmt/ProjectMaster/projectdetails/projectdetails.component';
import { ProjectconfigurationComponent } from './ProjectMgmt/ProjectMaster/projectconfiguration/projectconfiguration.component';
import { ProjectattachmentComponent } from './ProjectMgmt/ProjectMaster/projectattachment/projectattachment.component';
import { ProjecttabComponent } from './layout/projecttab/projecttab.component';
import { ExceptionhandlerService } from './service/exceptionhandler.service';
import { AppGlobals } from './global/app.global';
import { PoFullfillmentReportComponent } from './OrderMgmt/Reports/po-fullfillment-report/po-fullfillment-report.component';
import { ProjectMappingComponent } from './ProjectMgmt/ProjectMapping/project-mapping.component';
import { AddProjectMappingComponent } from './ProjectMgmt/ProjectMapping/addprojectMapping/addprojectMapping.component';
import { CourierDetailsComponent } from './AssetMgmt/DeliveryChallan/courierDetails/courierDetails.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoaderComponent,
    HeaderComponent,
    LeftmenuComponent,
    MatConfirmDialogComponent,
    OnlynumberDirective,
    HsnMasterComponent,
    DepartmentComponent,
    OrganizationComponent,
    GeographyComponent,
    CityComponent,
    PoliceStationComponent,
    FamilyComponent,
    UserProfileComponent,
    AddUserComponent,
    MenuComponent,
    ModelMasterComponent,
    ManufacturerComponent,
    CategoryMasterComponent,
    AssetConstantMasterComponent,
    ProductMasterComponent,
    AddProductComponent,
    AssetMasterComponent,
    AddAssetComponent,
    AssetAuditComponent,
    DeliveryChallanComponent,
    AddDeliveryChallanComponent,
    SearchAssetComponent,
    UpdateDCAssetComponent,
    AddInterDCComponent,
    InterDistrictDCComponent, ViewInterDistrictDCComponent,
    OEMDCComponent,
    AddOEMDCComponent,
    CityWiseAssetReportComponent,
    ActionComponent,
    OEMActionComponent,
    ViewDeliveryChallanComponent, ViewOEMDCComponent,
    AddCityInstallationComponent, CityInstallationComponent,
    AssetCountReportComponent,

    TicketCategoryComponent,
    TicketProblemReportComponent,
    TicketClassificationComponent,
    TicketMasterComponent,
    AddTicketComponent,
    VehicleMasterComponent,
    AddVehicleComponent,
    LicenseMasterComponent,
    AddLicenseComponent,
    VehicleServiceMasterComponent,
    AddVehicleServiceComponent,
    TicketTaskComponent,
    AddTaskComponent,
    AddTripComponent,
    PartyMasterComponent,
    AddPartyComponent,
    AddressMasterComponent,
    AddAddressComponent,
    PartyGstComponent,
    PoPaymentComponent,
    AddPaymentComponent,
    RoleComponent,
    AddRoleComponent,
    MyprofileComponent,
    TripaddressDirective,
    ConstantMasterComponent,
    BoqMasterComponent,
    AddBoqComponent,
    PurchaseOrderComponent,
    AddPoComponent,
    PotabComponent,
    ProductDetailsComponent,
    AddProductDetailsComponent,
    VendortabComponent,
    ViewPoComponent,
    USIDInstallationComponent, AddUSIDInstallationComponent,
    ProjectApprovalTaskComponent, ProjectMasterComponent, AddProjectComponent, ViewProjectComponent,
    AddScheduleComponent, BillingScheduleComponent,
    InvoiceTaskComponent, InvoiceComponent, ViewInvoiceComponent, AddInvoiceComponent,
    CollectionTaggingComponent, AddCollectionComponent,
    CollectionTaskComponent, CollectionActionComponent,
    InvoiceAgeingReportComponent, BillingComparsionomponent, MonthlyBillingComponent,
    MonthlyCollectionComponent, PRSComponent,
    AddPrsComponent, ViewPRSComponent, PrsTaskComponent, PrsActionComponent,
    AddVendorPaymentComponent, VendorPaymentsComponent,
    LocationComponent, AddLocationComponent, FileuploadComponent,
    UpdatePoTaskComponent,
    PurchaseOrderTaskComponent,
    RateContractComponent,
    AddRcComponent,
    ViewRcComponent,
    RcProductDetailsComponent,
    AddRcProductDetailsComponent,
    PoFulfilmentComponent,
    AddPoFulfilmentComponent,
    VendorComparisonComponent,
    AddVendorComparisonComponent,
    AdditionalTermsComponent,
    TicketAgeingReportComponent,
    TicketEscalationReportComponent,
    TicketIncidentReportComponent,
    OrphanTripsComponent,
    TicketMISComponent, TicketSLAReportComponent,
    RcAdditionalTermsComponent, ViewUSIDInstallationReport, ViewCityInstallationReport,
    ViewWorkflowComponent,
    DashboardComponent, SupportTeamComponent, AddSupportTeamComponent,
    CancelPoTaskComponent,
    MonthlyPaymentComponent,
    PendingPaymentComponent,
    PrsReportComponent,
    PoCriteriaReportComponent,
    PoWiseProductReportComponent,
    StatusWisePoReportComponent,
    ProjectVendorWisePoReportComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AssetTPAComponent,
    GrnMasterComponent,
    AddGrnComponent,
    GrnTaskComponent,
    UpdateGrnTaskComponent,
    HistoryTaskComponent,
    CurrencyMasterComponent,
    GrnReportComponent,
    ProjectdetailsComponent,
    ProjectconfigurationComponent,
    ProjectattachmentComponent,

    ProjecttabComponent, PoFullfillmentReportComponent,
    ProjectMappingComponent, AddProjectMappingComponent,
    CourierDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    MatDialogModule,
    MatTableExporterModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ExceptionhandlerService, AppGlobals],
  bootstrap: [AppComponent],
  entryComponents: [AssetAuditComponent, SearchAssetComponent, UpdateDCAssetComponent, ActionComponent,
    OEMActionComponent, AddScheduleComponent,
    ViewInvoiceComponent, AddInvoiceComponent, AddCollectionComponent, CollectionActionComponent,
    PrsActionComponent, CourierDetailsComponent]
})
export class AppModule { }
