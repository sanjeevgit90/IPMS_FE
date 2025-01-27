import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  tokenTimeExpiryDate: number;
  constructor(private router: Router) { }

  canActivate(

    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    this.tokenTimeExpiryDate = Number(sessionStorage.getItem('tokenTime'));
    let expiryDate = this.tokenTimeExpiryDate + 6900000;
    let chkLoginTime = new Date().getTime(); 
    if (chkLoginTime >= expiryDate) {
      alert("Your session has expired. you will now be redirected to login page.")
      this.router.navigate(['/']);
    }
    if (sessionStorage.getItem("token") != null) {
      return true;
    }
    else {
      alert("Token has been not generated yet. \n Please login.")
      this.router.navigate(['/']);
      return false
    }
  }



}
