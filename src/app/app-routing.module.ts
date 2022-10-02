import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationComponent} from "./Shared_Components/Authentication/Authentication.component";
import {Sign_InComponent} from "./Shared_Components/Authentication/Sign-In/Sign_In.component";
import {Sign_UpComponent} from "./Shared_Components/Authentication/Sign-Up/Sign-Up.component";
import {RecoverAccountComponent} from "./Shared_Components/Authentication/RecoverAccount/RecoverAccount.component";

const routes: Routes = [
  {path : 'Authentication' , component : AuthenticationComponent , children : [
      {path : '' , redirectTo: 'SignIn' , pathMatch : 'full'} ,
      {path : 'SignIn' , component : Sign_InComponent} ,
      {path : 'SignUp' , component : Sign_UpComponent} ,
      {path : 'RecoverAccount' , component : RecoverAccountComponent} ,
    ]} ,
] ;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
