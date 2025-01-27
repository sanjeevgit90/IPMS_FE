import { Component, OnInit } from '@angular/core';
import { AppGlobals } from '../../global/app.global';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [AppGlobals]
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private _global: AppGlobals) { }

  UserRights: string 
  username: string
  roleTL: boolean = false;
  tldistict:any = [];
  district:string = "";
  state:string = "";
  
  logout() {
    sessionStorage.clear();
    window.location.href='';

  }

  selectDistrict(obj) {
    sessionStorage.setItem('selectedDistrict', obj);
   this.router.navigate(['/profile']);
  }
 
  
  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.tldistict = JSON.parse(sessionStorage.getItem('UserDistricts'));
    this.roleTL = this._global.UserRights.includes("ROLE_TEAM_LEADER");
    
    if (sessionStorage.getItem('selectedDistrict') != null)
    {
      this.district = sessionStorage.getItem('selectedDistrict');
      this.state = sessionStorage.getItem('selectedState');
    }
    else
    {
      if (this.tldistict.length>0)
      {
        this.district = this.tldistict[0].id.geographyname;
        this.state = this.tldistict[0].id.parentgeography;
        sessionStorage.setItem('selectedDistrict', this.district);
        sessionStorage.setItem('selectedState', this.state);
        
      }
     
    }
    

     }

}
