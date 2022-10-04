import {Component} from "@angular/core";
import {FormControl, NgForm} from "@angular/forms";
import {AuthenticationService} from "../Authentication.service";
import {Process_State} from "../../../Models/Data_Sharing.model";
import {AuthenticationFieldsModel, Input_Names} from "../../../Models/AuthenticationFields.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SendResult} from "../Verify/Verify.component";

@Component({
  templateUrl : './Sign_In.component.html' ,
  styleUrls : ['../Authentication.component.css'] ,
})
export class Sign_InComponent extends AuthenticationFieldsModel {

  constructor(private AuthenticationProcesses : AuthenticationService ,
              private RouterPage : Router ) {
    super();
  }

  public Login(Data_Form : NgForm) {
    this.Loading_Process = true ;
   this.RestError();
    if(Data_Form.form.invalid) {
      this.ErrorHandle(Data_Form);
      this.Loading_Process = false ;
      return ;
    }
    let Email = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.PersonEmail])).value ;
    let Password = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.PersonPassword])).value ;
    let Keep_SignIn = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.KeepSignIn])).value as boolean;
    this.AuthenticationProcesses.SignIn(Email , Password , Keep_SignIn).subscribe(Value => {
      switch (Value.Result) {
        case Process_State.Succeed :
          this.RouterPage.navigate(['/Profile']);
          break ;
        case Process_State.Failed :
          if(Value.Data_Fail) {
            this.ViewError(Value.Data_Fail.Fail_Type, Value.Data_Fail.Fail_Reason);
          }
          break ;
        case Process_State.Waited :
          this.Email = Email ;
          this.ViewVerify = true ;
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
      case Process_State.Succeed :
        /* Route To New Page */
        break ;
      case Process_State.Failed :
        this.ViewVerify = false ;
        this.Loading_Process = false ;
        break ;
    }
  }

}
