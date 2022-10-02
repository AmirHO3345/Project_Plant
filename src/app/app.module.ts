import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HeaderComponent} from "./User/Header/Header.component";
import {Sign_InComponent} from "./Shared_Components/Authentication/Sign-In/Sign_In.component";
import {Sign_UpComponent} from "./Shared_Components/Authentication/Sign-Up/Sign-Up.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {VerifyComponent} from "./Shared_Components/Authentication/Verify/Verify.component";
import {RecoverAccountComponent} from "./Shared_Components/Authentication/RecoverAccount/RecoverAccount.component";
import {AuthenticationComponent} from "./Shared_Components/Authentication/Authentication.component";


@NgModule({
  declarations: [
    AppComponent ,
    HeaderComponent ,
    AuthenticationComponent ,
    Sign_InComponent ,
    Sign_UpComponent ,
    VerifyComponent ,
    RecoverAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule ,
    FormsModule ,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
