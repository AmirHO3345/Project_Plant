import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationComponent} from "./Shared_Components/Authentication/Authentication.component";
import {Sign_InComponent} from "./Shared_Components/Authentication/Sign-In/Sign_In.component";
import {Sign_UpComponent} from "./Shared_Components/Authentication/Sign-Up/Sign-Up.component";
import {RecoverAccountComponent} from "./Shared_Components/Authentication/RecoverAccount/RecoverAccount.component";
import {ProfileComponent} from "./Shared_Components/Authentication/Profile/Profile.component";
import {CategoriesComponent} from "./User/CategoriesPage/Categories.component";

const routes: Routes = [
  {path : '' , redirectTo : 'Profile' , pathMatch : "full" } ,
  {path : 'Authentication' , component : AuthenticationComponent , children : [
      {path : '' , redirectTo: 'SignIn' , pathMatch : 'full'} ,
      {path : 'SignIn' , component : Sign_InComponent} ,
      {path : 'SignUp' , component : Sign_UpComponent} ,
      {path : 'RecoverAccount' , component : RecoverAccountComponent} ,
    ]} ,
  {path : 'Profile' , component : ProfileComponent} ,
  {path : 'Categories' , component : CategoriesComponent} ,
] ;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
