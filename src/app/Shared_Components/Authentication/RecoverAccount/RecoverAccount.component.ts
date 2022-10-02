import {Component} from "@angular/core";
import {AuthenticationFieldsModel, Input_Names, UI_Type} from "../../../Models/AuthenticationFields.model";
import {FormControl, NgForm} from "@angular/forms";
import {Process_State} from "../../../Models/Data_Sharing.model";
import {AuthenticationService} from "../Authentication.service";
import {Router} from "@angular/router";
import {SendResult} from "../Verify/Verify.component";

@Component({
  templateUrl : './RecoverAccount.component.html' ,
  styleUrls : ['../Authentication.component.css'] ,
})
export class RecoverAccountComponent extends AuthenticationFieldsModel {

  UI_View : UI_Type ;

  DataSave !: {
    Code : number ,
    Token : string
  } ;

  constructor(private AuthenticationProcesses : AuthenticationService ,
              private RouterPage : Router) {
    super();
    this.UI_View = UI_Type.WriteEmail ;
  }

  SendEmail(Data_Form : NgForm) {
    this.Loading_Process = true ;
    this.RestError();
    if(Data_Form.form.invalid) {
      this.ErrorHandle(Data_Form);
      this.Loading_Process = false ;
      return ;
    }
    let Email = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.PersonEmail])).value ;
    this.AuthenticationProcesses.Send_Email(Email).subscribe(Value => {
      switch (Value.Result) {
        case Process_State.Succeed :
          this.Email = Email ;
          this.ViewVerify = true ;
          break ;
        case Process_State.Failed :
          if(Value.Data_Fail)
            this.ViewError(Value.Data_Fail.Fail_Type , Value.Data_Fail.Fail_Reason);
          break ;
        case Process_State.UnKnown :
          /* Error Network */
          break ;
      }
      this.Loading_Process = false ;
    });
  }

  public VerifyResult(DataResult : SendResult) {
    switch(DataResult.State) {
      case Process_State.Waited :
        if(DataResult.Data == undefined)
          return ;
        this.DataSave = {
          Code : DataResult.Data.Code ,
          Token : DataResult.Data.token
        } ;
        this.UI_View = UI_Type.WritePassword ;
        break ;
    }
    this.ViewVerify = false ;
  }

  ChangePassword(Data_Form : NgForm) {
    this.Loading_Process = true ;
    this.RestError();
    if(Data_Form.form.invalid) {
      this.ErrorHandle(Data_Form);
      this.Loading_Process = false ;
      return ;
    }
    let Password = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.PersonPassword])).value ;
    let PasswordObserve = this.AuthenticationProcesses.ChangePassword(this.DataSave.Code , this.DataSave.Token , Password) ;
    PasswordObserve.subscribe(Value => {
      if(Value == Process_State.Succeed) {
        /* Route To Another Page*/
      }
    });
  }
}


