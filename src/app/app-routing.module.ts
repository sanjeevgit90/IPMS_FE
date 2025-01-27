import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
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
import { DeliveryChallanComponent } from './AssetMgmt/DeliveryChallan/dc.component';
import { AddDeliveryChallanComponent } from './AssetMgmt/DeliveryChallan/adddc/adddc.component';
import { AddInterDCComponent } from './AssetMgmt/InterDistrictDeliveryChallan/adddc/interDCAddcomponent';
import { InterDistrictDCComponent } from './AssetMgmt/InterDistrictDeliveryChallan/interDC.component';
import { OEMDCComponent } from './AssetMgmt/OEMDeliveryChallan/oemdc.component';
import { AddOEMDCComponent } from './AssetMgmt/OEMDeliveryChallan/adddc/addoemdc.component';
import { CityWiseAssetReportComponent } from './AssetMgmt/CityWiseAssetReport/citywiseasset.component';
import { AddCityInstallationComponent } from './AssetMgmt/CityAssetInstallationReport/generateReport/addcityassetinstallation.component';
import { CityInstallationComponent } from './AssetMgmt/CityAssetInstallationReport/cityassetinstallation.component';
import { AssetCountReportComponent } from './AssetMgmt/AssetCountReport/assetcountreport.component';
import { AssetTPAComponent } from './AssetMgmt/AssetTPA/assetTPA.component';

import { TicketCategoryComponent } from './HelpdeskMgmt/ticket-category/ticket-category.component';
import { TicketProblemReportComponent } from './HelpdeskMgmt/ticket-problem-report/ticket-problem-report.component';
import { TicketClassificationComponent } from './HelpdeskMgmt/ticket-classification/ticket-classification.component';
import { AddTicketComponent } from './HelpdeskMgmt/ticket-master/add-ticket/add-ticket.component';
import { TicketMasterComponent } from './HelpdeskMgmt/ticket-master/ticket-master.component';
import { AddVehicleComponent } from './HelpdeskMgmt/vehicle-master/add-vehicle/add-vehicle.component';
import { VehicleMasterComponent } from './HelpdeskMgmt/vehicle-master/vehicle-master.component';
import { SupportTeamComponent } from './HelpdeskMgmt/support-team/support-team.component';
import { AddSupportTeamComponent } from './HelpdeskMgmt/support-team/add-support-team/add-support-team.component';



import { AddLicenseComponent } from './HelpdeskMgmt/license-master/add-license/add-license.component';
import { LicenseMasterComponent } from './HelpdeskMgmt/license-master/license-master.component';
import { AddVehicleServiceComponent } from './HelpdeskMgmt/vehicle-service-master/add-vehicle-service/add-vehicle-service.component';
import { VehicleServiceMasterComponent } from './HelpdeskMgmt/vehicle-service-master/vehicle-service-master.component';
import { TicketTaskComponent } from './HelpdeskMgmt/ticket-master/ticket-task/ticket-task.component';
import { AddTaskComponent } from './HelpdeskMgmt/ticket-master/ticket-task/add-task/add-task.component';
//import { AddTripComponent } from './HelpdeskMgmt/ticket-master/ticket-task/add-trip/add-trip.component';
import { AddressMasterComponent } from './VendorMgmt/address-master/address-master.component';
import { AddAddressComponent } from './VendorMgmt/address-master/add-address/add-address.component';
import { PartyGstComponent } from './VendorMgmt/party-gst/party-gst.component';
import { PoPaymentComponent } from './OrderMgmt/po-payment/po-payment.component';
import { AddPaymentComponent } from './OrderMgmt/po-payment/add-payment/add-payment.component';

import { RoleComponent } from './ConfigurationMgmt/role/role.component';
import { AddRoleComponent } from './ConfigurationMgmt/role/add-role/add-role.component';
import { MyprofileComponent } from './ConfigurationMgmt/myprofile/myprofile.component';
import { ConstantMasterComponent } from './OrderMgmt/constant-master/constant-master.component';
import { BoqMasterComponent } from './OrderMgmt/boq-master/boq-master.component';
import { AddBoqComponent } from './OrderMgmt/boq-master/add-boq/add-boq.component';
import { PurchaseOrderComponent } from './OrderMgmt/purchase-order/purchase-order.component';
import { AddPoComponent } from './OrderMgmt/purchase-order/add-po/add-po.component';
import { ProductDetailsComponent } from './OrderMgmt/product-details/product-details.component';
import { AddProductDetailsComponent } from './OrderMgmt/product-details/add-product-details/add-product-details.component';
import { PartyMasterComponent } from './VendorMgmt/party-master/party-master.component';
import { AddPartyComponent } from './VendorMgmt/party-master/add-party/add-party.component';
import { ViewPoComponent } from './OrderMgmt/purchase-order/view-po/view-po.component';
import { USIDInstallationComponent } from './AssetMgmt/USIDAssetInstallationReport/USIDassetinstallation.component';
import { AddUSIDInstallationComponent } from './AssetMgmt/USIDAssetInstallationReport/generateReport/generateassetinstallation.component';
import { ProjectApprovalTaskComponent } from './ProjectMgmt/ProjectApproval/projectapproval.component';
import { ProjectMasterComponent } from './ProjectMgmt/ProjectMaster/projectmaster.component';
import { ViewProjectComponent } from './ProjectMgmt/ProjectMaster/viewproject/viewproject.component';
import { AddProjectComponent } from './ProjectMgmt/ProjectMaster/addproject/addproject.component';

import { InvoiceTaskComponent } from './BillingMgmt/Invoice/invoicetask/invoicetask.component';
import { InvoiceComponent } from './BillingMgmt/Invoice/invoice.component';
import { BillingScheduleComponent } from './BillingMgmt/BillingSchedule/billingschedule.component';
import { CollectionTaggingComponent } from './BillingMgmt/CollectionTagging/collectiontagging.component';
import { CollectionTaskComponent } from './BillingMgmt/CollectionTagging/collectiontask/collectiontask.component';
import { LocationComponent } from './UniqueSiteId/location/location.component';
import { AddLocationComponent } from './UniqueSiteId/location/add-location/add-location.component';
import { InvoiceAgeingReportComponent } from './BillingMgmt/BillingReport/ageingreport/invoicereport.component';
import { BillingComparsionomponent } from './BillingMgmt/BillingReport/billingcomparison/billingcomparsion.component';
import { MonthlyBillingComponent } from './BillingMgmt/BillingReport/monthlybilling/monthlybilling.component';
import { MonthlyCollectionComponent } from './BillingMgmt/BillingReport/monthlycollection/monthlycollection.component';
import { PRSComponent } from './OrderMgmt/prs-master/prs.component';
import { AddPrsComponent } from './OrderMgmt/prs-master/add-prs/add-prs.component';
import { ViewPRSComponent } from './OrderMgmt/prs-master/view-prs/view-prs.component';
import { PrsTaskComponent } from './OrderMgmt/prs-master/prstask/prstask.component';
import { AddVendorPaymentComponent } from './OrderMgmt/vendor-payment-collection/add-payments/add-payments.component';
import { VendorPaymentsComponent } from './OrderMgmt/vendor-payment-collection/payments.component';
import { PurchaseOrderTaskComponent } from './OrderMgmt/purchase-order-task/purchase-order-task.component';
import { UpdatePoTaskComponent } from './OrderMgmt/purchase-order-task/update-po-task/update-po-task.component';
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
import { AuthGuard } from './auth.guard';
import { ViewDeliveryChallanComponent } from './AssetMgmt/DeliveryChallan/viewDC/viewDC.component';
import { ViewInterDistrictDCComponent } from './AssetMgmt/InterDistrictDeliveryChallan/viewDC/viewInterDistrictDC.component';
import { ViewOEMDCComponent } from './AssetMgmt/OEMDeliveryChallan/viewDC/viewOEMDC.component';
import { ViewUSIDInstallationReport } from './AssetMgmt/USIDAssetInstallationReport/viewReport/viewInstallationReport.component';
import { ViewCityInstallationReport } from './AssetMgmt/CityAssetInstallationReport/viewReport/viewCityInstallationReport.component';
import { TicketAgeingReportComponent } from './HelpdeskMgmt/ticket-report/ageing-report/ageing-report.component';
import { TicketEscalationReportComponent } from './HelpdeskMgmt/ticket-report/escalated-report/escalated-report.component';
import { TicketIncidentReportComponent } from './HelpdeskMgmt/ticket-report/incident-report/incident-report.component';
import { OrphanTripsComponent } from './HelpdeskMgmt/ticket-report/orphan-trips-report/orphan-trips.component';
import { TicketMISComponent } from './HelpdeskMgmt/ticket-report/ticket-mis-report/ticket-mis-report.component';
import { TicketSLAReportComponent } from './HelpdeskMgmt/ticket-report/sla-report/sla-report.component';
import { ViewWorkflowComponent } from './OrderMgmt/purchase-order-task/view-workflow/view-workflow.component';
import { CancelPoTaskComponent } from './OrderMgmt/purchase-order-task/cancel-po-task/cancel-po-task.component';
import { from } from 'rxjs';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { GrnMasterComponent } from './OrderMgmt/grn-master/grn-master.component';
import { AddGrnComponent } from './OrderMgmt/grn-master/add-grn/add-grn.component';
import { GrnTaskComponent } from './OrderMgmt/grn-task/grn-task.component';
import { UpdateGrnTaskComponent } from './OrderMgmt/grn-task/update-grn-task/update-grn-task.component';
import { HistoryTaskComponent } from './OrderMgmt/purchase-order-task/history-task/history-task.component';
import { CurrencyMasterComponent } from './HelpdeskMgmt/currency-master/currency-master.component';
import { GrnReportComponent } from './OrderMgmt/Reports/grn-report/grn-report.component';
import { ProjectdetailsComponent } from './ProjectMgmt/ProjectMaster/projectdetails/projectdetails.component';
import { ProjectconfigurationComponent } from './ProjectMgmt/ProjectMaster/projectconfiguration/projectconfiguration.component';
import { AddProjectMappingComponent } from './ProjectMgmt/ProjectMapping/addprojectMapping/addprojectMapping.component';

import { PoFullfillmentReportComponent} from './OrderMgmt/Reports/po-fullfillment-report/po-fullfillment-report.component';
import { ProjectMappingComponent } from './ProjectMgmt/ProjectMapping/project-mapping.component';


const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login/:id/:status/:flag", component: LoginComponent },  
  { path: "login/:username/:token", component: LoginComponent },
  { path: "searchHsn", canActivate: [AuthGuard], component: HsnMasterComponent },
  { path: "searchDept", canActivate: [AuthGuard], component: DepartmentComponent },
  { path: "Organization", canActivate: [AuthGuard], component: OrganizationComponent },
  { path: "searchGeography", canActivate: [AuthGuard], component: GeographyComponent },
  { path: "searchCity", canActivate: [AuthGuard], component: CityComponent },
  { path: "searchPoliceStation", canActivate: [AuthGuard], component: PoliceStationComponent },
  { path: "FamilyMaster", canActivate: [AuthGuard], component: FamilyComponent },
  { path: "registerEmployee", canActivate: [AuthGuard], component: AddUserComponent },
  { path: "updateUser/:id/:page", canActivate: [AuthGuard], component: AddUserComponent },
  { path: "searchUsers", canActivate: [AuthGuard], component: UserProfileComponent },
  { path: "searchMenu", canActivate: [AuthGuard], component: MenuComponent },
  { path: "ModelMaster", canActivate: [AuthGuard], component: ModelMasterComponent },
  { path: "Manufacturer", canActivate: [AuthGuard], component: ManufacturerComponent },
  { path: "CategoryMaster", canActivate: [AuthGuard], component: CategoryMasterComponent },
  { path: "AssetConstantMaster", canActivate: [AuthGuard], component: AssetConstantMasterComponent },
  { path: "searchProduct", canActivate: [AuthGuard], component: ProductMasterComponent },
  { path: "addProduct", canActivate: [AuthGuard], component: AddProductComponent },
  { path: "updateProduct/:id/:page", canActivate: [AuthGuard], component: AddProductComponent },
  { path: "viewProduct/:id/:page", canActivate: [AuthGuard], component: AddProductComponent },
  { path: "searchAsset", canActivate: [AuthGuard], component: AssetMasterComponent },
  { path: "addAsset", canActivate: [AuthGuard], component: AddAssetComponent },
  { path: "updateAsset/:id/:page", canActivate: [AuthGuard], component: AddAssetComponent },
  { path: "viewAsset/:id/:page", canActivate: [AuthGuard], component: AddAssetComponent },
  { path: "assetMisReport", canActivate: [AuthGuard], component: AssetTPAComponent },

  { path: "searchDC", canActivate: [AuthGuard], component: DeliveryChallanComponent },
  { path: "addDC", canActivate: [AuthGuard], component: AddDeliveryChallanComponent },
  { path: "updateDC/:id/:page", canActivate: [AuthGuard], component: AddDeliveryChallanComponent },
  { path: "updateDCAsset/:id/:page", canActivate: [AuthGuard], component: AddDeliveryChallanComponent },
  { path: "viewDC/:id/:page", canActivate: [AuthGuard], component: ViewDeliveryChallanComponent },

  { path: "searchInterDC", canActivate: [AuthGuard], component: InterDistrictDCComponent },
  { path: "addInterDC", canActivate: [AuthGuard], component: AddInterDCComponent },
  { path: "updateInterDC/:id/:page", canActivate: [AuthGuard], component: AddInterDCComponent },
  { path: "viewInterDC/:id/:page", canActivate: [AuthGuard], component: ViewInterDistrictDCComponent },

  { path: "searchOEMDC", canActivate: [AuthGuard], component: OEMDCComponent },
  { path: "addOEMDC", canActivate: [AuthGuard], component: AddOEMDCComponent },
  { path: "updateOEMDC/:id/:page", canActivate: [AuthGuard], component: AddOEMDCComponent },
  { path: "updateOEMDCAsset/:id/:page", canActivate: [AuthGuard], component: AddOEMDCComponent },
  { path: "viewOEMDC/:id/:page", canActivate: [AuthGuard], component: ViewOEMDCComponent },

  { path: "cityWiseAssetReport", canActivate: [AuthGuard], component: CityWiseAssetReportComponent },
  { path: "searchPoPayment", canActivate: [AuthGuard], component: PoPaymentComponent },
  { path: "AddPoPayment", canActivate: [AuthGuard], component: AddPaymentComponent },
  { path: "searchCityInstallationReport", canActivate: [AuthGuard], component: CityInstallationComponent },
  { path: "addCityInstallationReport", canActivate: [AuthGuard], component: AddCityInstallationComponent },
  { path: "updateCityReport/:id/:page", canActivate: [AuthGuard], component: AddCityInstallationComponent },
  { path: "viewCityReport/:id/:page", canActivate: [AuthGuard], component: ViewCityInstallationReport },

  { path: "AssetsReport", canActivate: [AuthGuard], component: AssetCountReportComponent },

  { path: "searchTicketCategory", canActivate: [AuthGuard], component: TicketCategoryComponent },
  { path: "searchProblemReport", canActivate: [AuthGuard], component: TicketProblemReportComponent },
  { path: "searchClassification", canActivate: [AuthGuard], component: TicketClassificationComponent },
  { path: "TicketMaster", canActivate: [AuthGuard], component: AddTicketComponent },
  { path: "searchTicket", canActivate: [AuthGuard], component: TicketMasterComponent },

  { path: "VehicleMaster", canActivate: [AuthGuard], component: AddVehicleComponent },
  { path: "searchVehicle", canActivate: [AuthGuard], component: VehicleMasterComponent },
  { path: "searchDriver", canActivate: [AuthGuard], component: SupportTeamComponent },
  { path: "addSupportTeam", canActivate: [AuthGuard], component: AddSupportTeamComponent },
  { path: "updateSupportTeam/:id/:page", canActivate: [AuthGuard], component: AddSupportTeamComponent },


  { path: "updateVehicle/:id/:page", canActivate: [AuthGuard], component: AddVehicleComponent },

  { path: "updateLicense/:id/:page", canActivate: [AuthGuard], component: AddLicenseComponent },
  { path: "LicenseMaster", canActivate: [AuthGuard], component: AddLicenseComponent },
  { path: "searchLicense", canActivate: [AuthGuard], component: LicenseMasterComponent },

  { path: "updateVehicleService/:id/:page", canActivate: [AuthGuard], component: AddVehicleServiceComponent },
  { path: "VehicleServiceMaster", canActivate: [AuthGuard], component: AddVehicleServiceComponent },
  { path: "searchService", canActivate: [AuthGuard], component: VehicleServiceMasterComponent },
  { path: "searchTicketAction", canActivate: [AuthGuard], component: TicketTaskComponent },
  { path: "updateTicketTask/:id/:page", canActivate: [AuthGuard], component: AddTaskComponent },
  { path: "updateTicket/:id/:page", canActivate: [AuthGuard], component: AddTicketComponent },
  { path: "viewTicket/:id/:page", canActivate: [AuthGuard], component: AddTicketComponent },
  // { path: "SearchTicket", canActivate: [AuthGuard], component: TicketMasterComponent },
  { path: "SearchPartyAddress", canActivate: [AuthGuard], component: AddressMasterComponent },
  { path: "AddPartyAddress", canActivate: [AuthGuard], component: AddAddressComponent },
  { path: "searchGst", canActivate: [AuthGuard], component: PartyGstComponent },
  { path: "userRoleRights", canActivate: [AuthGuard], component: RoleComponent },
  { path: "AddRoleRights/:page", canActivate: [AuthGuard], component: AddRoleComponent },
  { path: "updateRole/:id/:page", canActivate: [AuthGuard], component: AddRoleComponent },
  { path: "profile", canActivate: [AuthGuard], component: MyprofileComponent },
  { path: "profile/:id", canActivate: [AuthGuard], component: MyprofileComponent },
  { path: "searchConstant", canActivate: [AuthGuard], component: ConstantMasterComponent },
  { path: "AddBoq", canActivate: [AuthGuard], component: AddBoqComponent },
  { path: "UpdateBoq/:id/:page", canActivate: [AuthGuard], component: AddBoqComponent },
  { path: "SearchBoq", canActivate: [AuthGuard], component: BoqMasterComponent },
  { path: "searchPurchaseOrder", canActivate: [AuthGuard], component: PurchaseOrderComponent },
  { path: "AddPO", canActivate: [AuthGuard], component: AddPoComponent },
  { path: "searchParty", canActivate: [AuthGuard], component: PartyMasterComponent },
  { path: "AddParty", canActivate: [AuthGuard], component: AddPartyComponent },
  { path: "ViewPoById/:id/:flag", canActivate: [AuthGuard], component: ViewPoComponent },

  { path: "searchTask", canActivate: [AuthGuard], component: PurchaseOrderTaskComponent },
  { path: "UpdatePoTask/:id/:page/:poRcFlag", canActivate: [AuthGuard], component: UpdatePoTaskComponent },
  { path: "CancelPoTask/:id/:page/:poRcFlag", canActivate: [AuthGuard], component: CancelPoTaskComponent },
  { path: "ViewWorkflow/:id/:flag", canActivate: [AuthGuard], component: ViewWorkflowComponent },
  { path: "historyTask", canActivate: [AuthGuard], component: HistoryTaskComponent },
  {
    path: "searchPurchaseOrder",
    children: [
      { path: "UpdatePO/:id/:page", canActivate: [AuthGuard], component: AddPoComponent },
      { path: "SearchProductDetails/:id/:page", canActivate: [AuthGuard], component: ProductDetailsComponent },
      { path: "AddProductDetails/:id/:page", canActivate: [AuthGuard], component: AddProductDetailsComponent },
      { path: "UpdateProductDetails/:id/:page", canActivate: [AuthGuard], component: AddProductDetailsComponent },
      { path: "searchPoTerms/:id/:page", canActivate: [AuthGuard], component: AdditionalTermsComponent },
      { path: "searchPoPayment/:id/:page", canActivate: [AuthGuard], component: PoPaymentComponent },
      { path: "AddPoPayment/:id/:page", canActivate: [AuthGuard], component: AddPaymentComponent },
      { path: "EditPoPayment/:id/:page", canActivate: [AuthGuard], component: AddPaymentComponent },
      { path: "searchPoFulfilment/:id/:page", canActivate: [AuthGuard], component: PoFulfilmentComponent },
      { path: "AddPoFulfilment/:id/:page", canActivate: [AuthGuard], component: AddPoFulfilmentComponent },
      { path: "EditPoFulfilment/:id/:page", canActivate: [AuthGuard], component: AddPoFulfilmentComponent },
      { path: "searchVendorComparison/:id/:page", canActivate: [AuthGuard], component: VendorComparisonComponent },
      { path: "AddVendorComparison/:id/:page", canActivate: [AuthGuard], component: AddVendorComparisonComponent },
      { path: "EditVendorComparison/:id/:page", canActivate: [AuthGuard], component: AddVendorComparisonComponent },
      { path: "uploadSignCopy/:id/:page", canActivate: [AuthGuard], component: AddPoComponent },
    ]
  },
  { path: "searchRateContract", canActivate: [AuthGuard], component: RateContractComponent },
  { path: "registerRateContract", canActivate: [AuthGuard], component: AddRcComponent },
  { path: "ViewRcById/:id/:flag", canActivate: [AuthGuard], component: ViewRcComponent },
  {
    path: "searchRateContract",
    children: [
      { path: "editRateContract/:id/:page", canActivate: [AuthGuard], component: AddRcComponent },
      { path: "searchRcProductDetails/:id/:page", canActivate: [AuthGuard], component: RcProductDetailsComponent },
      { path: "addRcProductDetails/:id/:page", canActivate: [AuthGuard], component: AddRcProductDetailsComponent },
      { path: "editRcProductDetails/:id/:page", canActivate: [AuthGuard], component: AddRcProductDetailsComponent },
      { path: "searchRcTerms/:id/:page", canActivate: [AuthGuard], component: RcAdditionalTermsComponent },
      { path: "uploadSignCopy/:id/:page", canActivate: [AuthGuard], component: AddRcComponent },
    ]
  },
  {
    path: "searchTask",
    children: [
      { path: "UpdatePO/:id/:page/:task", canActivate: [AuthGuard], component: AddPoComponent },
      { path: "SearchProductDetails/:id/:page/:task", canActivate: [AuthGuard], component: ProductDetailsComponent },
      { path: "AddProductDetails/:id/:page/:task", canActivate: [AuthGuard], component: AddProductDetailsComponent },
      { path: "UpdateProductDetails/:id/:page/:task", canActivate: [AuthGuard], component: AddProductDetailsComponent },
      { path: "searchPoTerms/:id/:page/:task", canActivate: [AuthGuard], component: AdditionalTermsComponent },
      { path: "editRateContract/:id/:page/:task", canActivate: [AuthGuard], component: AddRcComponent },
      { path: "searchRcProductDetails/:id/:page/:task", canActivate: [AuthGuard], component: RcProductDetailsComponent },
      { path: "addRcProductDetails/:id/:page/:task", canActivate: [AuthGuard], component: AddRcProductDetailsComponent },
      { path: "editRcProductDetails/:id/:page/:task", canActivate: [AuthGuard], component: AddRcProductDetailsComponent },
      { path: "searchRcTerms/:id/:page/:task", canActivate: [AuthGuard], component: RcAdditionalTermsComponent },
    ]
  },
  {
    path: "searchParty",
    children: [
      { path: "UpdateParty/:id/:page", canActivate: [AuthGuard], component: AddPartyComponent },
      { path: "SearchPartyAddress/:id/:page", canActivate: [AuthGuard], component: AddressMasterComponent },
      { path: "AddPartyAddress/:id/:page", canActivate: [AuthGuard], component: AddAddressComponent },
      { path: "UpdatePartyAddress/:id/:page", canActivate: [AuthGuard], component: AddAddressComponent },
      { path: "searchGst/:id/:page", canActivate: [AuthGuard], component: PartyGstComponent },

    ]
  },
  { path: "searchUSIDInstallationReport", canActivate: [AuthGuard], component: USIDInstallationComponent },
  { path: "addUSIDInstallationReport", canActivate: [AuthGuard], component: AddUSIDInstallationComponent },
  { path: "updateUSIDReport/:id/:page", canActivate: [AuthGuard], component: AddUSIDInstallationComponent },
  { path: "viewUSIDReport/:id/:page", canActivate: [AuthGuard], component: ViewUSIDInstallationReport },
 
  { path: "billingSchedule", canActivate: [AuthGuard], component: BillingScheduleComponent },

  { path: "searchInvoice", canActivate: [AuthGuard], component: InvoiceComponent },
  { path: "searchInvoiceTask", canActivate: [AuthGuard], component: InvoiceTaskComponent },

  { path: "collectionTagging", canActivate: [AuthGuard], component: CollectionTaggingComponent },
  { path: "searchCollectionTask", canActivate: [AuthGuard], component: CollectionTaskComponent },
  { path: "searchLocation", canActivate: [AuthGuard], component: LocationComponent },
  { path: "addLocation", canActivate: [AuthGuard], component: AddLocationComponent },
  { path: "updateLocation/:id/:page", canActivate: [AuthGuard], component: AddLocationComponent },

  { path: "invoiceAgeingReport", canActivate: [AuthGuard], component: InvoiceAgeingReportComponent },

  { path: "billingcomparison", canActivate: [AuthGuard], component: BillingComparsionomponent },
  { path: "monthlybilling", canActivate: [AuthGuard], component: MonthlyBillingComponent },
  { path: "monthlyCollection", canActivate: [AuthGuard], component: MonthlyCollectionComponent },

  { path: "searchPrs", canActivate: [AuthGuard], component: PRSComponent },
  { path: "addPrs", canActivate: [AuthGuard], component: AddPrsComponent },
  { path: "updatePrs/:id/:page", canActivate: [AuthGuard], component: AddPrsComponent },
  { path: "ViewPrsById/:id", canActivate: [AuthGuard], component: ViewPRSComponent },
  { path: "searchPrsTask", canActivate: [AuthGuard], component: PrsTaskComponent },

  { path: "searchPayments/:prsid", canActivate: [AuthGuard], component: VendorPaymentsComponent },
  { path: "addPayment/:prsid", canActivate: [AuthGuard], component: AddVendorPaymentComponent },
  { path: "updatePayment/:id/:page/:prsid", canActivate: [AuthGuard], component: AddVendorPaymentComponent },
  { path: "Dashboard", canActivate: [AuthGuard], component: DashboardComponent },
  { path: "poMonthlyPaymentReport", canActivate: [AuthGuard], component: MonthlyPaymentComponent },
  { path: "poPendingPaymentReport", canActivate: [AuthGuard], component: PendingPaymentComponent },
  { path: "prsReport", canActivate: [AuthGuard], component: PrsReportComponent },
  { path: "poCriteriaReport", canActivate: [AuthGuard], component: PoCriteriaReportComponent },
  { path: "poWiseProductReport", canActivate: [AuthGuard], component: PoWiseProductReportComponent },
  { path: "poStatusWiseReport", canActivate: [AuthGuard], component: StatusWisePoReportComponent },
  { path: "poProjectVendorWiseReport", canActivate: [AuthGuard], component: ProjectVendorWisePoReportComponent },

  { path: "TicketSLAReport", canActivate: [AuthGuard], component: TicketSLAReportComponent },
  { path: "AllTicketReport", canActivate: [AuthGuard], component: TicketMISComponent },
  { path: "AgingReport", canActivate: [AuthGuard], component: TicketAgeingReportComponent },
  { path: "TicketEscalationReport", canActivate: [AuthGuard], component: TicketEscalationReportComponent },
  { path: "TicketIncidentReport", canActivate: [AuthGuard], component: TicketIncidentReportComponent },
  { path: "OrphanTicket", canActivate: [AuthGuard], component: OrphanTripsComponent },
  { path: "changepassword", canActivate: [AuthGuard], component: ChangePasswordComponent },
  { path: "forgotpassword", component: ForgotPasswordComponent },
  { path: "resetpassword", component: ResetPasswordComponent },
  { path: "grnMasterSearch", canActivate: [AuthGuard], component: GrnMasterComponent },
  { path: "grnMasterAdd", canActivate: [AuthGuard], component: AddGrnComponent },
  { path: "grnMasterEdit/:id/:page", canActivate: [AuthGuard], component: AddGrnComponent },
  { path: "grnTaskSearch", canActivate: [AuthGuard], component: GrnTaskComponent },
  { path: "updateGrnTask/:id/:page", canActivate: [AuthGuard], component: UpdateGrnTaskComponent },
  { path: "grnMasterEdit/:id/:page/:task", canActivate: [AuthGuard], component: AddGrnComponent },
  { path: "searchCurrency", canActivate: [AuthGuard], component: CurrencyMasterComponent },
  { path: "searchGrnreport", canActivate: [AuthGuard], component: GrnReportComponent },
  
//{ path: "projectDetails", canActivate: [AuthGuard], component: ProjectdetailsComponent },
  { path: "searchProject", canActivate: [AuthGuard], component: ProjectMasterComponent },

  { path: "addProject", canActivate: [AuthGuard], component: ProjectdetailsComponent },
  { path: "viewProject/:id/:page", canActivate: [AuthGuard], component: ViewProjectComponent },
  { path: "searchProjectTask", canActivate: [AuthGuard], component: ProjectApprovalTaskComponent },
  {
    path: "searchProjectTask",
    children: [
      { path: "updateProjectDetails/:id/:page/:taskid", canActivate: [AuthGuard], component: ProjectdetailsComponent },
      { path: "projectConfiguration/:id/:page/:taskid", canActivate: [AuthGuard], component: ProjectconfigurationComponent },
    ]
  },
 
  {
    path: "searchProject",
    children: [
      { path: "updateProjectDetails/:id/:page", canActivate: [AuthGuard], component: ProjectdetailsComponent },
      { path: "projectConfiguration/:id/:page", canActivate: [AuthGuard], component: ProjectconfigurationComponent },
     ]
  },
  { path: "poFullfillmentReport", canActivate: [AuthGuard], component: PoFullfillmentReportComponent },
  { path: "projectMapping/:id", canActivate: [AuthGuard], component: ProjectMappingComponent },
  
  { path: "addProjectMapping/:id", canActivate: [AuthGuard], component: AddProjectMappingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
