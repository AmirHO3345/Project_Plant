import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthenticationService} from "./Authentication.service";
import {map, Observable} from "rxjs";
import {Person} from "../../Models/Person.model";

@Injectable({providedIn : 'root'})
export class AuthenticationGuard /* implements CanActivate */ {
  constructor(private AuthInfo : AuthenticationService ,private Router_Page : Router) {}

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  //   Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return this.AuthInfo.Account.pipe(map((PersonInfo) => {
  //     if(PersonInfo == null) {
  //       if(!route.data["Visitor"])
  //         return this.Router_Page.createUrlTree(['SomethingWrong']);
  //       else
  //         return true ;
  //     }
  //     switch (PersonInfo.GetType()) {
  //       case Person.User :
  //         if(!route.data["User"] || !route.data["Visitor"])
  //           return this.Router_Page.createUrlTree(['SomethingWrong']);
  //         break ;
  //       case Person.Writer :
  //         if(!route.data["Writer"])
  //           return this.Router_Page.createUrlTree(['SomethingWrong']);
  //         break ;
  //       case Person.Admin :
  //         if(!route.data["Admin"])
  //           return this.Router_Page.createUrlTree(['SomethingWrong']);
  //         break ;
  //     }
  //     return true ;
  //   }));
  // }
}
