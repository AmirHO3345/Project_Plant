import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {CommonModule} from "@angular/common";

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
import {ProfileComponent} from "./Shared_Components/Authentication/Profile/Profile.component";
import {PupUpComponent} from "./Shared_Components/PopUp/PopUp.component";
import {CategoriesComponent} from "./User/CategoriesPage/Categories.component";
import {PaginationComponent} from "./Shared_Components/Pagination/Pagination.component";
import {SelectionComponent} from "./Shared_Components/Selection/Selection.component";
import {CategoryComponent} from "./User/CategoriesPage/Category_Item/Category.component";
import {SearchFieldComponent} from "./Shared_Components/SearchField/SearchField.component";
import {LoaderComponent} from "./Shared_Components/Loader/Loader.component";



@NgModule({
  declarations: [
    AppComponent ,
    HeaderComponent ,
    AuthenticationComponent ,
    Sign_InComponent ,
    Sign_UpComponent ,
    VerifyComponent ,
    RecoverAccountComponent ,
    ProfileComponent ,
    PupUpComponent ,
    CategoriesComponent ,
    PaginationComponent ,
    SelectionComponent ,
    CategoryComponent ,
    SearchFieldComponent ,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule ,
    AppRoutingModule ,
    FormsModule ,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
