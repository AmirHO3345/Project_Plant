import { Component } from '@angular/core';
import {AuthenticationService} from "./Shared_Components/Authentication/Authentication.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private AuthenticationProcesses : AuthenticationService) {
    let ObserveAccount = this.AuthenticationProcesses.Auto_SignIn() ;
    if(ObserveAccount instanceof Observable)
      ObserveAccount.subscribe(Value => {});
  }


}
