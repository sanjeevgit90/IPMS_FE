
import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';

import { SharedService } from '../../service/shared.service';
import { AppGlobals } from '../../global/app.global';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css'],
  providers: [SharedService, AppGlobals],
  standalone: false
})

export class LeftmenuComponent implements OnInit {

  username: any;
  showLoading: any;
  errorHandle: any;

  // Sidebar properties
  public isOpen = false;
  public isMobile = false;

  // Submenu properties
  openIndex: number | null = null;

  isShowDiv = false;

  menuList: any = [];

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private _global: AppGlobals
  ) { }

  // =====================================
  // SCREEN SIZE DETECTION
  // =====================================

  @HostListener('window:resize')
  onResize(): void {

    const mobile = window.innerWidth < 768;

    if (mobile !== this.isMobile) {

      this.isMobile = mobile;

      // Desktop: Sidebar open
      // Mobile: Sidebar closed
      this.isOpen = !mobile;

    }

  }

  // =====================================
  // HAMBURGER MENU
  // =====================================

  public isMenuOpen(): void {

    if (this.isMobile) {
      this.isOpen = !this.isOpen;
    }

  }

  // =====================================
  // SUBMENU ACCORDION
  // =====================================

  toggleSubMenu(i: number): void {

    this.openIndex = this.openIndex === i ? null : i;

  }

  // =====================================
  // TOGGLE DIV
  // =====================================

  toggleDisplayDiv(): void {

    this.isShowDiv = !this.isShowDiv;

  }

  // =====================================
  // MENU LIST API
  // =====================================

  MyMenuList = (): void => {

    const headers = {
      "Authorization": sessionStorage.getItem("token")
    };

    this.showLoading = true;

    this.sharedService.getMyMenuList(headers).subscribe({

      next: (resp: any) => {

        this.menuList = resp;

        sessionStorage.setItem(
          'menudata',
          JSON.stringify(this.menuList)
        );

        this.showLoading = false;

        // Automatically open active submenu
        this.setActiveSubMenu();

      },

      error: (error: any) => {

        this.showLoading = false;
        this.errorHandle = true;

        console.error(error);

      }

    });

  };

  // =====================================
  // ACTIVE SUBMENU DETECTION
  // =====================================

  setActiveSubMenu(): void {

    if (!this.menuList || !this.menuList.length) {
      return;
    }

    this.menuList.forEach((m: any, i: number) => {

      if (m.childmenu?.some((c: any) =>
        this.router.url.includes(c.urlpath)
      )) {

        this.openIndex = i;

      }

    });

  }

  // =====================================
  // COMPONENT INITIALIZATION
  // =====================================

  ngOnInit(): void {

    // Initial screen detection
    this.isMobile = window.innerWidth < 768;

    // Desktop open / Mobile closed
    this.isOpen = !this.isMobile;

    // Get menu from session storage
    const menuObj = JSON.parse(
      sessionStorage.getItem('menudata') || 'null'
    );

    if (menuObj == null || menuObj.length === 0) {

      this.MyMenuList();

    } else {

      this.menuList = menuObj;

      this.setActiveSubMenu();

    }

  }

  // =====================================
  // LOGOUT
  // =====================================

  logout(): void {

    throw new Error('Method not implemented.');

  }

}
