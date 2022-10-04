import {FormControl, NgForm} from "@angular/forms";

export class AuthenticationFieldsModel {

  Error_Occur : {
    Error_Name ?: ErrorType ,
    Error_Content : string ,
    Error_View : boolean
  }

  Information_Occur : {
    Information_Name ?: InformationType ,
    Information_Content : string ,
    Information_View : boolean
  }

  Email : string

  ViewVerify : boolean

  Loading_Process : boolean ;

  constructor() {
    this.Loading_Process = false ;
    this.Error_Occur = {
      Error_Content : "" ,
      Error_View : false
    } ;
    this.Information_Occur = {
      Information_Content : '' ,
      Information_View : false
    } ;
    this.ViewVerify = false ;
    this.Email = "";
  }

  public Error_Type() {
    return ErrorType ;
  }

  public Input_Type() {
    return Input_Names ;
  }

  public Information_Type() {
    return InformationType ;
  }

  public GetUIType() {
    return UI_Type ;
  }

  public TypeVerify() {
    return VerifyType
  }

  protected RestError() {
    this.Error_Occur.Error_Name = undefined ;
    this.Error_Occur.Error_Content = "" ;
  }

  protected ViewError(NameError : ErrorType , ContentError : string) {
    this.Error_Occur.Error_Name = NameError ;
    this.Error_Occur.Error_Content = ContentError ;
    this.Error_Occur.Error_View = true ;
  }

  protected ErrorHandle(Data_Form : NgForm) {
    for (const DataFormKey in Data_Form.form.controls)
      if((<FormControl>Data_Form.form.get(DataFormKey)).invalid) {
        switch(DataFormKey) {
          case Input_Names[Input_Names.PersonFirstName] :
            this.Error_Occur.Error_Name = ErrorType.First_Name ;
            this.Error_Occur.Error_Content = "First Name Is Error";
            break ;
          case Input_Names[Input_Names.PersonLastName] :
            this.Error_Occur.Error_Name = ErrorType.Last_Name ;
            this.Error_Occur.Error_Content = "Last Name Is Error ";
            break ;
          case Input_Names[Input_Names.PersonEmail] :
            this.Error_Occur.Error_Name = ErrorType.Email ;
            this.Error_Occur.Error_Content = "Email Is Error ";
            break ;
          case Input_Names[Input_Names.PersonPassword] :
            this.Error_Occur.Error_Name = ErrorType.Password ;
            this.Error_Occur.Error_Content = "Password Is Error ";
            break ;
          case Input_Names[Input_Names.CodeVerify] :
            this.Error_Occur.Error_Name = ErrorType.Code ;
            this.Error_Occur.Error_Content = "Code Is Error ";
            break ;
        }
        this.Error_Occur.Error_View = true ;
        break ;
      }
  }

  protected InformationHandle(Type : InformationType) {
    switch(Type) {
      case InformationType.ReSendCode :
        this.Information_Occur.Information_Content = "We Send The Code Again To Your Email Please Checkout That" ;
        this.Information_Occur.Information_Name = InformationType.ReSendCode ;
        break;
    }
    this.Error_Occur.Error_View = true ;
  }

}

export enum InformationType {
  ReSendCode
} // For User PopUp

export enum Input_Names {
  PersonEmail ,
  PersonPassword ,
  KeepSignIn ,
  PersonFirstName ,
  PersonLastName ,
  CodeVerify ,
}

export enum ErrorType {
  First_Name ,
  Last_Name ,
  Email ,
  Password ,
  Code ,
  Phone ,
  Token
}

export enum DataType {
  message ,
  DataUser ,
  Token ,
} //From Back

export enum VerifyType {
  Forget_Password ,
  Complete_Process
}

export enum UI_Type {
  WriteEmail ,
  WritePassword
}
