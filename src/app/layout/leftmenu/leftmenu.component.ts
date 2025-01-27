import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { AppGlobals } from '../../global/app.global';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  providers: [SharedService, AppGlobals]
})
export class LeftmenuComponent implements OnInit {
  constructor(private sharedService: SharedService, private router: Router, private route: ActivatedRoute, private _global: AppGlobals) { }
  public isOpen = false;
  public isMenuOpen() {
    this.isOpen = !this.isOpen;
  }
  isShowDiv = false;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  menuList: any = [];
  //Menu List
  MyMenuList = function () {
    const headers = { "Authorization": sessionStorage.getItem("token") };
    this.showLoading = true;
    this.sharedService.getMyMenuList(headers).subscribe(resp => {
      this.menuList = resp;
      console.log(this.menuList);
      var menudata = this.menuList;
      sessionStorage.setItem('menudata', JSON.stringify(menudata));
      this.showLoading = false;
    }, (error: any) => {
      this.showLoading = false;
      this.errorHandle = true;
      const errStr = error._body;
    });
  }
  ngOnInit(): void {
    var menuObj = JSON.parse(sessionStorage.getItem('menudata'));
    if (menuObj == null || menuObj.length == 0) {
      this.MyMenuList();
    }
    else {
      this.menuList = menuObj;
      console.log(this.menuList);
    }
  }
}