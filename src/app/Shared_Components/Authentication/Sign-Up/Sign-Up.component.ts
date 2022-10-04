import {Component} from "@angular/core";
import {AuthenticationService} from "../Authentication.service";
import {FormControl, NgForm} from "@angular/forms";
import {Person} from "../../../Models/Person.model";
import {Process_State} from "../../../Models/Data_Sharing.model";
import {AuthenticationFieldsModel, Input_Names} from "../../../Models/AuthenticationFields.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SendResult} from "../Verify/Verify.component";

@Component({
  templateUrl : './Sign-Up.component.html' ,
  styleUrls : ['../Authentication.component.css'] ,
})
export class Sign_UpComponent extends AuthenticationFieldsModel {

  constructor(private AuthenticationProcesses : AuthenticationService ,
              private RouterPage : Router) {
    super();
  }

  public Register(Data_Form : NgForm) {
    this.Loading_Process = true ;
    this.RestError();
    if(Data_Form.form.invalid) {
      this.ErrorHandle(Data_Form);
      this.Loading_Process = false ;
      return ;
    }
    let First_Name = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.PersonFirstName])).value ;
    let Last_Name = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.PersonLastName])).value ;
    let Email = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.PersonEmail])).value ;
    let Password = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.PersonPassword])).value ;
    this.AuthenticationProcesses.SignUp(Email , Password , First_Name , Last_Name , Person.User).subscribe(Value => {
      switch (Value.Result) {
        case Process_State.Waited :
          this.Email = Email ;
          this.ViewVerify = true ;
          break ;
        case Process_State.Failed :
          if(Value.Data_Fail) {
            this.ViewError(Value.Data_Fail.Fail_Type, Value.Data_Fail.Fail_Reason);
          }
          break ;
        case Process_State.UnKnown :

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
        break ;
    }
  }

}
