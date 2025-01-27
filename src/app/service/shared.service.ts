import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AppGlobals } from '../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private _http:HttpClient, private _global: AppGlobals) { }

  getStateList(header) {
  
    var url = this._global.baseAPIUrl + 'ipms/geograpghy/getActiveState';
    return this._http.get(url , {headers: header});
}

getActiveDistrictList(header) {
  
    var url = this._global.baseAPIUrl + 'ipms/geograpghy/getActiveDistrict';
    return this._http.get(url , {headers: header});
}


getDistrictList(header, stateName) {
  var url = this._global.baseAPIUrl + 'ipms/geograpghy/getActiveDistrict/'+stateName;
  return this._http.get(url , {headers: header});
}

getCityList (header) {
  var url = this._global.baseAPIUrl + 'ipms/city/getActiveCity';
  return this._http.get(url , {headers: header});
}

getDepartmentList (header) {
  var url = this._global.baseAPIUrl + 'ipms/department/selectionlist';
  return this._http.get(url , {headers: header});
}


getOrganizationsList (header) {
  
  var url = this._global.baseAPIUrl + 'ipms/organization/selectionlist';
  return this._http.get(url , {headers: header});
}

getRoleList (header) {
 
  var url = this._global.baseAPIUrl + 'ipms/role/selectionlist';
  return this._http.get(url , {headers: header});
}

getParentMenuList (header) {
  
  var url = this._global.baseAPIUrl + 'ipms/menu/selectionlist';
  return this._http.get(url , {headers: header});
}

  getMyMenuList(header) {
    
    var url = this._global.baseAPIUrl + 'ipms/menu/mymenus' ;
    return this._http.get(url , {headers: header});
  }

 

  logout(header) {
    
    var url = this._global.baseAPIUrl + 'logout';
    return this._http.get(url , {headers: header});
  }

  getActiveCategory(header) {
   
    var url = this._global.baseAPIUrl + 'ipms/category/getActiveParentCategory';
    return this._http.get(url , {headers: header});
  }

  getActiveSubCategoryfromcategory(header, name) {
   
   
    var url = this._global.baseAPIUrl + 'ipms/category/getActiveSubCategoryfromParent?parent='+ name;
    return this._http.get(url , {headers: header});
  }

  getProjectList(header) {
    var url = this._global.baseAPIUrl + 'ipms/project/selectionlist' ;
    return this._http.get(url , {headers: header});
  }

  getAllProduct(header) {
  
    var url = this._global.baseAPIUrl + 'ipms/product/getProductList';
    return this._http.get(url , {headers: header});
  }

  getAllProductByOrg(orgId, header) {
    debugger;
    var url = this._global.baseAPIUrl + 'ipms/product/getProductListByOrg/'+orgId;
    return this._http.get(url , {headers: header});
  }

  getAllHsn(header) {
  
    var url = this._global.baseAPIUrl + 'ipms/hsn/getHsnCodeList';
    return this._http.get(url , {headers: header});
  }

  getAllConstant(body, header) {
   
    var url = this._global.baseAPIUrl + 'ipms/constant/getallconstants';
    return this._http.post(url, body, { headers: header });
  }

  compareStateOfAddress (header, addId1, addId2) {
   
    var url = this._global.baseAPIUrl + 'ipms/address/comparestatesofaddress/'+ addId1 + '/' + addId2;
    return this._http.get(url , {headers: header});
  }

  getAddressById (header, addId) {
    var url = this._global.baseAPIUrl + 'ipms/address/getaddressbyid/'+addId;
    return this._http.get(url , {headers: header});
   }

  getActiveManufacturer(header) {
   
  
    var url = this._global.baseAPIUrl + 'ipms/manufacture/getActiveManufacturerList';
    return this._http.get(url , {headers: header});
  }

  getActiveHsn(header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/hsn/getActiveHsnCodeList';
    return this._http.get(url , {headers: header});
  }

  getActiveModel(header) {
   
   
    var url = this._global.baseAPIUrl + 'ipms/model/getActiveModelList';
    return this._http.get(url , {headers: header});
  }

  getActiveModelfrommanufacturer(header,name) {
   
  
    var url = this._global.baseAPIUrl + 'ipms/model/getActiveModelListFromManufacturer/'+name;
    return this._http.get(url , {headers: header});
  }


  getActiveProductfromsubcategory(header, name) {
   
   
    var url = this._global.baseAPIUrl + 'ipms/product/getActiveProductListFromSubCategory?subcategory='+ name;
    return this._http.get(url , {headers: header});
  }

  getActiveProject(header) {
   
   
    var url = this._global.baseAPIUrl + 'ipms/project/selectionlist';
    return this._http.get(url , {headers: header});
  }

  getActiveParty(header) {
   
   
    var url = this._global.baseAPIUrl + 'ipms/party/getpartyselectionlist';
    return this._http.get(url , {headers: header});
  }

  getActivePartyByOrg(orgId, header) {
    
     var url = this._global.baseAPIUrl + 'ipms/party/getpartybyorgselectionlist/'+orgId;
     return this._http.get(url , {headers: header});
   }

  getActiveEol(header) {
   
  
    var url = this._global.baseAPIUrl + 'ipms/assetconstant/getActiveEolList';
    return this._http.get(url , {headers: header});
  }

  getActiveDepreciation(header) {
   
 
    var url = this._global.baseAPIUrl + 'ipms/assetconstant/getActiveDepreciationList';
    return this._http.get(url , {headers: header});
  }

  getActiveCityListFromDistrict (header, district) {
    
    var url = this._global.baseAPIUrl + 'ipms/city/getActiveCityFromDistrict/'+ district;
    return this._http.get(url , {headers: header});
  }

  getActivePoliceStationFromCity (header, city) {
    
    var url = this._global.baseAPIUrl + 'ipms/policestation/getActivePoliceStationFromCity/'+ city;
    return this._http.get(url , {headers: header});
  }

  getActiveLocationFromPoliceStation (header, policestation) {
    
    var url = this._global.baseAPIUrl + 'ipms/location/getActiveLocationFromPoliceStation/'+ policestation;
    return this._http.get(url , {headers: header});
  }

  getActiveLocationFromCity (header, city) {
    
    var url = this._global.baseAPIUrl + 'ipms/location/getActiveLocationFromCity/'+ city;
    return this._http.get(url , {headers: header});
  }

  getAllAddressOfParty (header, party) {
    
    var url = this._global.baseAPIUrl + 'ipms/address/getalladdressbypartyid/'+ party;
    return this._http.get(url , {headers: header});
  }

  getPartyDetails (header, party) {
    
    var url = this._global.baseAPIUrl + 'ipms/party/getpartybyid/'+ party ;
    return this._http.get(url , {headers: header});
  }

  getAddressDetails (header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/address/getaddressbyid/'+ id ;
    return this._http.get(url , {headers: header});
  }

  getGstFromAddress (header, party, address) {
    
    var url = this._global.baseAPIUrl + 'ipms/gst/getGstFromAddress/'+ party + '/' + address;
    return this._http.get(url , {headers: header});
  }

  getActiveLocations (header) {
    
    var url = this._global.baseAPIUrl + 'ipms/location/getActiveLocationList';
    return this._http.get(url , {headers: header});
  }
  getActiveLocationsFromDistrict (header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/location/getActiveLocationFromDisrict/'+id;
    return this._http.get(url , {headers: header});
  }
  getAssetByLocation (header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/asset/getAssetByLocation?locationid='+id;
    return this._http.get(url , {headers: header});
  }

  getActiveUserList(header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/userprofile/selectionUserlist';
    return this._http.get(url , {headers: header});
  }

  getEmailByUserProfielName (header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/userprofile/getEmailByUserProfielName/'+id;
    return this._http.get(url , {headers: header});
  }

  getMobileNoByUserProfile (header, name) {
    
    var url = this._global.baseAPIUrl + 'ipms/userprofile/getMobileNoByUserProfile/'+name;
    return this._http.get(url , {headers: header});
  }

  getActiveCategoryList(header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/ticketcategory/getActiveCategoryList';
    return this._http.get(url , {headers: header});
  }

  ActiveCategoryList(header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/category/getActiveCategoryListL';
    return this._http.get(url , {headers: header});
  }
  

  getAssetTagByAsset (header, entityId) {
    
    var url = this._global.baseAPIUrl + 'ipms/asset/getAssetTagByAsset/'+entityId;
    return this._http.get(url , {headers: header});
  }

  
  getAssetById (header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/asset/'+id;
    return this._http.get(url , {headers: header});
  }

  getActiveVehicleList(header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/vehiclemaster/getActiveVehicleList';
    return this._http.get(url , {headers: header});
  }
  
  getUserProfileById (header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/userprofile/'+id;
    return this._http.get(url , {headers: header});
  }

  getAssetTagByLocation (header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/asset/getAssetTagByLocation/'+id;
    return this._http.get(url , {headers: header});
  }

  getActiveSubCategory(header, name) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/category/getActiveSubCategory/';
    return this._http.get(url , {headers: header});
  }

  

  //getAssetTagByLocation
  
   getProgressStatus (header) {
    
    var url = this._global.baseAPIUrl + 'ipms/progressstatus/selectionlist';
    return this._http.get(url , {headers: header});
  }

  getProjectType (header) {
    
    var url = this._global.baseAPIUrl + 'ipms/projecttype/selectionlist';
    return this._http.get(url , {headers: header});
  }

  getMilestoneList(id, header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/billingschedule/getActiveBillingScheduleList/'+id;
    return this._http.get(url , {headers: header});
  }
  getInvoiceList(id, header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/invoice/getActiveInvoiceFromProject/'+id;
    return this._http.get(url , {headers: header});
  }
  
  getApprovedPoList(header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/poapprovedselectionlist';
    return this._http.get(url , {headers: header});
  }
  
  getApprovedRcList(header) {
    
    var url = this._global.baseAPIUrl + 'ipms/ratecontract/rcapprovedselectionlist/';
    return this._http.get(url , {headers: header});
  }

  getAllPoListFromGrn( header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/getallpolistfromgrn';
    return this._http.get(url , {headers: header});
  }

  getAllGrn( header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/grn/grnselectionlist';
    return this._http.get(url , {headers: header});
  }

  getAllGrnByPo(id, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/grn/grnselectionlistbypo/'+id;
    return this._http.get(url , {headers: header});
  }

  getOfficeList( header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/officelocation/selectionlist';
    return this._http.get(url , {headers: header});
  }

  getPoList( header) {
   
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/poselectionlist';
    return this._http.get(url , {headers: header});
  }

  getSubcategoryByCategory (header, name) {
    
    var url = this._global.baseAPIUrl + 'ipms/ticketcategory/getSubcategoryByCategory/'+name;
    return this._http.get(url , {headers: header});
  }

  getWarehouse (header) {
    
    var url = this._global.baseAPIUrl + 'ipms/location/getWarehouseList';
    return this._http.get(url , {headers: header});
  }
  getAssetTagById (header, id) {
    
    var url = this._global.baseAPIUrl + 'ipms/assetSerial/getAssetIp/'+id;
    return this._http.get(url , {headers: header});
  }
  
  getCurrencyList (header) {
    var url = this._global.baseAPIUrl + 'ipms/currencyMaster/getAllCurrencyList';
    return this._http.get(url , {headers: header});
  }

  getListOfProductsInRc(rcId, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/purchaseorder/getlistofproductsinrc/'+rcId;
    return this._http.get(url , {headers: header});
  }

  getAllWorkflowsByType(body, header) {
    
    var url = this._global.baseAPIUrl + 'ipms/workflow/getworkflowlist';
    return this._http.post(url, body, {headers: header});
  }
}
