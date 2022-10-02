import {Component, EventEmitter, Input, Output} from "@angular/core";
import {AuthenticationService} from "../Authentication.service";
import {FormControl, NgForm} from "@angular/forms";
import {Process_State} from "../../../Models/Data_Sharing.model";
import {AuthenticationFieldsModel, DataType, Input_Names, VerifyType} from "../../../Models/AuthenticationFields.model";

export interface SendResult {
  State : Process_State ,
  Data ?: {
    Code : number ,
    token : string
  }
}

@Component({
  selector : 'Verify' ,
  templateUrl : './Verify.component.html' ,
  styleUrls : ['../Authentication.component.css'] ,
})
export class VerifyComponent extends AuthenticationFieldsModel{

  @Input('DataReceive') SendInfo !: {
    Type : VerifyType ,
    Email : string
  } ;

  @Output('SendResult') ResultProcess : EventEmitter<SendResult> ;

  constructor(private AuthenticationProcesses : AuthenticationService) {
    super();
    this.ResultProcess = new EventEmitter<SendResult>();
  }

  public VerifyCode(Data_Form : NgForm) {
    this.Loading_Process = true ;
    if(this.SendInfo == undefined)
      return ;
    this.RestError();
    if(Data_Form.form.invalid) {
      this.ErrorHandle(Data_Form);
      this.Loading_Process = false ;
      return ;
    }
    let Code = (<FormControl>Data_Form.form.get(Input_Names[Input_Names.CodeVerify])).value ;
    let VerifyObserve = this.AuthenticationProcesses.Verify_Code(this.SendInfo.Type , this.SendInfo.Email
      , Code , "en") ;
    VerifyObserve.subscribe(Value => {
      switch(Value.Result) {
        case Process_State.Succeed :
          this.ResultProcess.emit({
            State : Process_State.Succeed ,
          });
          break ;
        case Process_State.Waited :
          if(Value.Data_Pass == undefined)
            return ;
          this.ResultProcess.emit({
            State : Process_State.Waited ,
            Data : {
              Code : Code ,
              token : Value.Data_Pass.Get_Data
            }
          });
          break ;
        case Process_State.Failed :
          if(Value.Data_Fail) {
            this.ViewError(Value.Data_Fail.Fail_Type, Value.Data_Fail.Fail_Reason);
          }
          break ;
      }
      this.Loading_Process = false ;
    });
  }

  public BackPage() {
    this.ResultProcess.emit({
      State : Process_State.Failed ,
    });
  }

  public ReSendCode() {
    if(this.Loading_Process)
      return ;
    this.Loading_Process = true ;
    this.AuthenticationProcesses.ReSend_Code(this.SendInfo.Type , this.SendInfo.Email)
      .subscribe(Value => {
        switch(Value.Result) {
          case Process_State.Succeed :
            if(Value.Data_Pass && Value.Data_Pass.Data_Type == DataType.message) {
              console.log(Value.Data_Pass.Get_Data);
            }
            break ;
        }
        this.Loading_Process = false ;
    });
  }

}
