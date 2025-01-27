import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppGlobals } from '../../../global/app.global';
import { DialogService } from '../../../service/dialog.service';
import { RoleService } from '../role.service';
import { SharedService } from '../../../service/shared.service';
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  providers: [RoleService, AppGlobals, DialogService, SharedService]
})
export class AddRoleComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private roleService: RoleService,
    private _global: AppGlobals, private dialogService: DialogService, private sharedService: SharedService) { }

  showLoading: boolean = false;
  PageTitle = "Add Role";
  add = true;
  edit = false;
  list = true;

  RoleData = {
    "rolename": "", "menuRights": []
  };
  AddRoleData = {
    "rolename": "", "menuRights": []
  };

  panelOpenState = false;
  addRoleForm: FormGroup;
  isSubmitted = false;

  back = function () {
    this.router.navigate(['/userRoleRights']);
  }



  // roleFormatData = [];
  // SelectRoleRight = function (items) {
  //   this.menuRole = {};
  //   debugger;
  //   this.menuRole.enableView = items;
  //   this.menuRole.enableEdit = items;
  //   this.menuRole.enableAdd = items;
  //   this.menuRole.enableDelete = items;
  //   this.menuRole.menuName = this.MenuMasterData[0].displayname;
  //   this.roleFormatData = [];
  //   this.roleFormatData.push(this.menuRole);

  // }


  menuRole = { "enableView": false, "enableEdit": false, "enableAdd": false, "enableDelete": false, "menuName": "", "displayname": "", "childMenu": [] };
  childmenuRole = { "enableView": false, "enableEdit": false, "enableAdd": false, "enableDelete": false, "displayname": "", "menuName": "" };


  // GenerateAddRoleRight = function (menuList) {
  //   this.menuRole = {};
  //   this.AddRoleData.menuRights=[];
  //   debugger;
  //   for (let i = 0; i < menuList.length; i++) {
  //     this.menuRole = {};
  //     this.menuRole.childmenu=[];
  //     this.menuRole.menuName = menuList[i].menuname;
  //     this.menuRole.displayname = menuList[i].displayname;
  //     this.menuRole.enableAdd=false;
  //     this.menuRole.enableEdit=false;
  //     this.menuRole.enableView=false;
  //     this.menuRole.enableDelete=false;

  //     for (let j = 0; j < menuList[i].childmenu.length; j++) {
  //         this.childmenuRole = {};
  //         this.childmenuRole.menuName = menuList[i].childmenu[j].menuname; 
  //         this.childmenuRole.displayname = menuList[i].childmenu[j].displayname;
  //         this.menuRole.enableAdd=false;
  //         this.menuRole.enableEdit=false;
  //         this.menuRole.enableView=false;
  //         this.menuRole.enableDelete=false;

  //         this.menuRole.childmenu.push(this.childmenuRole)
  //     }

  //     this.AddRoleData.menuRights.push(this.menuRole);
  //   }

  // }

  ConvertAddtoSaveRoleRight = function (menuList) {
    //RoleData
    this.menuRole = {};
    this.RoleData.menuRights = [];
    this.RoleData.rolename = menuList.rolename;
    debugger;
    for (let i = 0; i < menuList.menuRights.length; i++) {
      this.menuRole = {};
      this.menuRole.childMenu = [];
      this.menuRole.menuName = menuList.menuRights[i].menuName;
      this.menuRole.enableAdd = menuList.menuRights[i].enableAdd;
      this.menuRole.enableEdit = menuList.menuRights[i].enableEdit;
      this.menuRole.enableView = menuList.menuRights[i].enableView;
      this.menuRole.enableDelete = menuList.menuRights[i].enableDelete;

      if (this.menuRole.enableAdd || this.menuRole.enableEdit || this.menuRole.enableView || this.menuRole.enableDelete) {
        this.RoleData.menuRights.push(this.menuRole);
      }

      for (let j = 0; j < menuList.menuRights[i].childMenu.length; j++) {
        this.childmenuRole = {};
        this.childmenuRole.menuName = menuList.menuRights[i].childMenu[j].menuName;
        // this.childmenuRole.displayname = menuList[i].childmenu[j].displayname;
        this.childmenuRole.enableAdd = menuList.menuRights[i].childMenu[j].enableAdd;
        this.childmenuRole.enableEdit = menuList.menuRights[i].childMenu[j].enableEdit;
        this.childmenuRole.enableView = menuList.menuRights[i].childMenu[j].enableView;
        this.childmenuRole.enableDelete = menuList.menuRights[i].childMenu[j].enableDelete;

        if (this.childmenuRole.enableAdd || this.childmenuRole.enableEdit || this.childmenuRole.enableView || this.childmenuRole.enableDelete) {
          this.RoleData.menuRights.push(this.childmenuRole);
        }
      }


    }

  }



  addRole = function (flag) {

    this.isSubmitted = true;

    const headers = { "Authorization": sessionStorage.getItem("token") };

    //this.RoleData.menuRights = this.roleFormatData;
    this.ConvertAddtoSaveRoleRight(this.AddRoleData);
    debugger;

    if (this.addRoleForm.invalid) {
      return;
    }
    if (this.RoleData.menuRights.length == 0) {
      this.dialogService.openConfirmDialog("Please select menu rights")
      return;
    }
    this.showLoading = true;
    this.roleService.saveRole(this.RoleData, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.successMessage = "Role " + flag + " successfully.";
      this.dialogService.openConfirmDialog(this.successMessage)
        .afterClosed().subscribe(res => {
          this.addRoleForm.reset();
          if (flag == "update") {
            this.router.navigate(['/userRoleRights']);

          }

        })

    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // Edit
  editon = function (name, flag) {
    debugger;
    this.add = false;
    if (flag == "edit") {
      this.edit = true;
    }
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.roleService.findRoleById(name, headers, flag).subscribe(resp => {
      debugger;
      this.showLoading = false;
      this.AddRoleData = resp;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  // Menu List function
  FilterData = {};
  MenuMasterData = {};
  AllMenuList = function () {
    debugger;
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.roleService.getMenuList(headers).subscribe(resp => {
      debugger;
      this.AddRoleData = resp;
      console.log(this.AddRoleData);
      // this.GenerateAddRoleRight(resp);
      this.showLoading = false;
    }, (error: any) => {
      debugger;
      this.showLoading = false;
      const errStr = error.error.errorDetail[0];
      this.dialogService.openConfirmDialog(errStr)
    });
  }


  ngOnInit(): void {


    this.addRoleForm = this.formBuilder.group({
      rolename: ['', Validators.required]
    });



    if (this.route.snapshot.params.page == 'edit') {
      debugger;
      this.PageTitle = "Update Role";
      this.editon(this.route.snapshot.params.id, 'edit');
    }
    if (this.route.snapshot.params.page == 'view') {
      debugger;
      this.PageTitle = "View Role";
      this.editon(this.route.snapshot.params.id, 'view');
    }
    if (this.route.snapshot.params.page == 'add') {
      debugger;
      this.AllMenuList();
    }

  }
  get formControls() {
    return this.addRoleForm.controls;
  }

}

