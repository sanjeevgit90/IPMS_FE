import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileuploadService } from '../../service/fileupload.service';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { AppGlobals } from '../../global/app.global';
import { catchError, map } from 'rxjs/operators';
import { DialogService } from '../../service/dialog.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  providers: [FileuploadService, AppGlobals, DialogService]
})
export class FileuploadComponent implements OnInit {


  @Input() files: any = [];
  @Input() maxSize: number = 2048;
  @Input() labelname: string = "Select File to Upload";
  @Input() modulename: string = "default";
  @Input() entitydata: any = "";
  @Input() isSingle: boolean = true;

  errormsg: string = "";
  // uploadlabel:string = "";

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;



  constructor(private http: HttpClient,
    private _global: AppGlobals, private fileuploadService: FileuploadService, private dialogService: DialogService) { }

  uploadFile(file) {
    debugger;
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.fileuploadService.upload(formData, headers, this.modulename, this.entitydata).pipe(
      map(event => {
        switch (event.type) {

          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);

            break;
          case HttpEventType.Response:
            file.uploadedFileName = event.body.fileName;
            file.uploadedFilePath = event.body.filePath;
            file.uploadStatus = event.body.status;
            return event;
            debugger;

        }
      }

      ),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        file.uploadStatus = "FAILED";
        return of(`${file.data.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log(event.body);
        }
      });
  }


  private uploadFiles() {
    debugger;
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      if(file.progress<100){
      this.uploadFile(file);}
      else if(file.progress==null){
        this.uploadFile(file);}
    });
  }


  onClick() {
    if(this.isSingle)
      {
        if(this.files.length>=1)
        {
          this.dialogService.openConfirmDialog("Only Single file allowed");
          return;
        }
      }
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      this.errormsg = "";

      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        if ((file.size / 1024) > this.maxSize) {
          this.errormsg = "File size is greater than " + this.maxSize + " KB";
          return;
        }
      }

      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        debugger;
        if(file.progress==null)
        {
          this.files.push({ data: file, inProgress: false, progress: 0 });
        }
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  removeFile(filename) {
    debugger;
    // const formData = new FormData();
    const headers = { "Authorization": sessionStorage.getItem("token") };
    let index = this.files.indexOf(filename);
    this.files.splice(index, 1); 
    this.fileuploadService.deleteFile(filename, headers).subscribe(resp => {
      debugger;
    }, (error: any) => {
      debugger;
    });
  }

  ngOnInit(): void {
  }

}
