import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobals } from '../global/app.global';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(private _http: HttpClient, private _global: AppGlobals) { }

  hasfile(fileUpload) {

    if (fileUpload.length > 0) {
      if (fileUpload[0].uploadStatus == "SUCCESS") { return true; }
      else { return false; }
    }
    else {
      return false;
    }
  }

  getFirstFilePath(fileUpload) {

    if (fileUpload.length > 0) {
      if (fileUpload[0].uploadStatus == "SUCCESS") { return fileUpload[0].uploadedFilePath; }
      else { return ""; }
    }
    else {
      return "";
    }
  }

  getSingleFileArray(filepath) {
    let uploadfiles: any = [];
    let str = filepath;
    let lastSlash = str.lastIndexOf("/");
    let name = str.substring(lastSlash + 1);
    let displayName = null;
    if(name.length >= 37){
      displayName = str.substring(lastSlash + 38);
    } else {
      displayName = str.substring(lastSlash + 1);
    }

    //let displayName = str.substring(lastSlash + 38);
    uploadfiles.push({
      data: { name: displayName, size: 0 }, inProgress: false, progress: 100, uploadedFileName: displayName,
      uploadedFilePath: filepath, uploadStatus: "SUCCESS"
    });
    return uploadfiles;
  }

  getMultipleFileArray(filearray) {
    let uploadfiles: any = [];
    
    debugger;
    for (let i = 0; i < filearray.length; i++) {
      let str = filearray[i];
      let lastSlash = str.lastIndexOf("/");
      //let displayName = str.substring(lastSlash + 38);
      let name = str.substring(lastSlash + 1);
      let displayName = null;
      if(name.length >= 37){
        displayName = str.substring(lastSlash + 38);
      } else {
        displayName = str.substring(lastSlash + 1);
      }
      uploadfiles.push({
        data: { name: displayName, size: 0 }, inProgress: false, progress: 100, uploadedFileName: "",
        uploadedFilePath: filearray[i], uploadStatus: "SUCCESS"
      });
    }
    return uploadfiles;
  }

  allFilesUploaded(fileUpload) {
    debugger;
    let retValue = false;
    for (let index = 0; index < fileUpload.length; index++) {
      const file = fileUpload[index];
      if (file.uploadStatus == "SUCCESS" && file.progress == 100) {
        retValue = true;
      }
      else {
        retValue = false;
        return retValue;
      }
    }
    return retValue;
  }

  allUploadedFiles(filepath) {
    debugger;
    let retValue: any = [];
    if (filepath.length > 0) {
      for (let index = 0; index < filepath.length; index++) {
        const file = filepath[index];
        if (filepath[index].uploadStatus == "SUCCESS") {
          retValue.push(file.uploadedFilePath);
        }
      }
      return retValue;
    }
  }

  public deleteFile(filePath, header) {
    debugger;
    let apiname: string = "fileupload/deletefile";
    return this._http.post<any>(this._global.baseAPIUrl + apiname, filePath.uploadedFilePath, {
      headers: header,
      reportProgress: true,
      observe: 'events'
    });
  }


  public upload(formData, header, entity, entitydata) {
    debugger;
    let apiname: string = "fileupload";
    switch (entity) {
      case 'userprofile':
        apiname = "ipms/userprofile/uploadProfileImage";
        break;
      case 'ticket':
        apiname = "ipms/ticket/ticketAttachment";
        break;

      case 'default':
        apiname = "fileupload";
        break;
      case 'poAttachment':
        apiname = "ipms/project/uploadPoAttachment/" + entitydata;
        break;
      case 'planAttachment':
        apiname = "ipms/project/uploadPlanAttachment/" + entitydata;
        break;
      case 'dc':
        apiname = "ipms/dc/uploadDCAttachment/" + entitydata;
        break;
      case 'interdc':
        apiname = "ipms/interdistrictdc/uploadDCAttachment/" + entitydata;
        break;
      case 'oemdc':
        apiname = "ipms/oemdc/uploadDCAttachment/" + entitydata;
        break;
      case 'locationAssets':
        apiname = "ipms/locationinstallationreport/uploadInstallation/" + entitydata;
        break;
      case 'cityAssets':
        apiname = "ipms/ciyinstallationreport/uploadInstallation/" + entitydata;
        break;
      case 'invoiceExcel':
        apiname = "ipms/invoice/uploadInvoiceexcel";
        break;
      case 'invoiceSupportDoc':
        apiname = "ipms/invoice/uploadInvoicesupportingdoc";
        break;
      case 'accountExcel':
        apiname = "ipms/invoice/uploadAccountexcel";
        break;
      case 'billAttachment':
        apiname = "ipms/prs/uploadAttachedBill";
        break;
      case 'invoiceFileUpload':
        apiname = "ipms/prs/uploadInvoiceFile";
        break;
      case 'prsAttachments':
        apiname = "ipms/prs/uploadAttachments";
        break;
      case 'collection':
        apiname = "ipms/collection/uploadPaymentAdvice";
        break;
      case 'tickettask':
        apiname = "ipms/ticket/captureImg";
        break;
      case 'vehicleReg':
        apiname = "ipms/vehiclemaster/vehicleRegAttachment";
        break;

      case 'vehicleIns':
        apiname = "ipms/vehiclemaster/insuranceCertificateAttachment";
        break;

      case 'vehiclePoll':
        apiname = "ipms/vehiclemaster/pollutionCertificateAttachment";
        break;

      case 'vehicleOthDoc':
        apiname = "ipms/vehiclemaster/otherDocumentsAttachment";
        break;

      case 'vehicleLetter':
        apiname = "ipms/vehiclemaster/letterOfIntentAttachment";
        break;

      case 'vehicleInvoice':
        apiname = "ipms/vehiclemaster/invoiceAttachment";
        break;

      case 'vehicleRelease':
        apiname = "ipms/vehiclemaster/releaseDocumentAttachment";
        break;

      case 'vehicleService':
        apiname = "ipms/vehicleservice/vehicleServieAttachment";
        break;

      case 'partyincorporationcertificate':
        apiname = "ipms/party/uploadIncorporationCertificate";
        break;
      case 'partypan':
        apiname = "ipms/party/uploadPartyPan";
        break;
      case 'partytan':
        apiname = "ipms/party/uploadPartyTan";
        break;
      case 'partyarn':
        apiname = "ipms/party/uploadPartyArn";
        break;
      case 'partycancelledcheque':
        apiname = "ipms/party/uploadPartyCancelledCheque";
        break;
      case 'posignedcopy':
        apiname = "ipms/purchaseorder/uploadsignedcopy/" + entitydata;
        break;
      case 'poattachments':
        apiname = "ipms/purchaseorder/uploadpoattachments/" + entitydata;
        break;
      case 'rcsignedcopy':
        apiname = "ipms/ratecontract/uploadsignedcopy/" + entitydata;
        break;
      case 'rcattachments':
        apiname = "ipms/ratecontract/uploadrcattachments/" + entitydata;
        break;
      case 'poannexure':
        apiname = "ipms/purchaseorder/uploadannexure/" + entitydata;
        break;
      case 'rcannexure':
        apiname = "ipms/ratecontract/uploadannexure/" + entitydata;
        break;

      case 'idProof':
        apiname = "ipms/supportteam/idProofAttachment";
        break;

      case 'addressProof':
        apiname = "ipms/supportteam/addressProofAttachment";
        break;
      case 'gstattach':
        apiname = "ipms/gst/uploadGstCertificate";
        break;
      case 'grndccopy':
        apiname = "ipms/grn/uploaddccopy";
        break;
      case 'grnlrcopy':
        apiname = "ipms/grn/uploadlrcopy";
        break;
    }
    return this._http.post<any>(this._global.baseAPIUrl + apiname, formData, {
      headers: header,
      reportProgress: true,
      observe: 'events'
    });
  }
}
