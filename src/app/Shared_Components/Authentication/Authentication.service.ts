import {Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable, take} from "rxjs";
import {Person, PersonModel} from "../../Models/Person.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Data_SharingModel, Process_State} from "../../Models/Data_Sharing.model";
import {DataType, ErrorType, VerifyType} from "../../Models/AuthenticationFields.model";


interface PersonData_Response {
  first_name : string ;
  last_name : string ;
  email : string ;
  path_photo : string ;
  role : string ;
  phone : string | null ;
  updated_at : string ;
  created_at : string ;
  id : number ;
  token : string ;
}

interface ErrorValidate_Response {
  first_name ?: string[] ;
  last_name ?: string[] ;
  email ?: string[] ;
  password ?: string[] ;
  password_c ?: string[] ;
  role ?: string[] ;
  phone ?: string[] ;
}

interface BackEnd_Response {
  data ?: {
    user ?: PersonData_Response ,
    message ?: string ,
    token ?: string
  } ;
  errors ?: {
    validate ?: ErrorValidate_Response ,
    "email.active" ?: string ,
    code ?: string ,
    token ?: string
  }
}

interface ResultProcess {
  Result : Process_State ;
  Data_Pass ?: {
    Data_Type : DataType ,
    Get_Data ?: any
  } ;
  Data_Fail ?: {
    Fail_Type : ErrorType ,
    Fail_Reason : string
  } ;
}

export interface VerifyData {
  Process : VerifyType ;
  Verify_Email : string ;
  /* Keep Account */
  Verify_Code ?: number ;
  Token_Code ?: string ;
}

@Injectable({providedIn : "root"})
export class AuthenticationService {

  private readonly Account : BehaviorSubject<PersonModel | null> ;

  private readonly ReferenceStorage : string ;

  constructor(private Http : HttpClient) {
    this.Account = new BehaviorSubject<PersonModel | null>(null);
    this.ReferenceStorage = "PersonAccount" ;
  }

  public SignIn(Email : string , Password : string , KeepAccount : boolean ) {
    return this.Http.post<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}api/auth/singe-in`
      , {
      email : Email ,
      password : Password
    }).pipe(take(1) , map(Response => {
      let Result_Process : ResultProcess = {
        Result : Process_State.UnKnown
      } ;
      if(Response.data) {
        if(Response.data.user) {
          let Result = AuthenticationService.DataProcess(Response.data.user) ;
          this.SendAccount(Result , KeepAccount) ;
          Result_Process.Data_Pass = {
            Data_Type : DataType.DataUser
          } ;
        }
        Result_Process.Result = Process_State.Succeed ;
      } else if(Response.errors) {
        if(Response.errors.validate) {
          let Result = AuthenticationService.ErrorValidateProcess(Response.errors.validate) ;
          Result_Process.Result = Process_State.Failed ;
          Result_Process.Data_Fail = {
            Fail_Type : Result.Type ,
            Fail_Reason : Result.Reason
          } ;
        } else if(Response.errors["email.active"]) {
          Result_Process.Result = Process_State.Waited ;
        }
      }
      return Result_Process ;
    }));
  }

  public SignUp(Email : string , Password : string , First_Name : string , Last_Name : string ,
                Client_Type : Person ) {
    return this.Http.post<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}api/auth/singe-up`
      , {
        first_name : First_Name ,
        last_name : Last_Name ,
        email : Email ,
        password : Password ,
        password_c : Password ,
        role : PersonModel.Convert2BackEnd(Person.User)
      }).pipe(take(1) , map(Response => {
        let Result_Process : ResultProcess = {
        Result : Process_State.UnKnown
      } ;
        if(Response.data) {
          if(Response.data.message) {
            Result_Process.Data_Pass = {
              Data_Type : DataType.message ,
              Get_Data : Response.data.message
            } ;
            Result_Process.Result = Process_State.Waited ;
          }
        } else if(Response.errors) {
          if(Response.errors.validate) {
            let Result = AuthenticationService.ErrorValidateProcess(Response.errors.validate) ;
            Result_Process.Result = Process_State.Failed ;
            Result_Process.Data_Fail = {
              Fail_Type : Result.Type ,
              Fail_Reason : Result.Reason
            }
          }
        }
        return Result_Process ;
    }));
  }

  public SignOut() {
    localStorage.removeItem(this.ReferenceStorage) ;
    this.Account.next(null) ;
    /* Connect With SignOut Back-End */
  }

  public Auto_SignIn() {
    let Save = this.IsSaveToken();
    if(Save.IsSave)
      return this.GetInformation(Save.Token as string).pipe(take(1)) ;
    return ;
  }

  public Send_Email(Email : string) {
    return this.Http.post<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}api/forgot/password/code` , {
      email : Email
    }).pipe(take(1) , map(Response => {
      let Result_Process : ResultProcess = {
        Result : Process_State.UnKnown
      } ;
      if(Response.data) {
        if(Response.data.message) {
          Result_Process.Data_Pass = {
            Data_Type : DataType.message ,
            Get_Data : Response.data.message
          } ;
          Result_Process.Result = Process_State.Succeed ;
        }
      } else if(Response.errors) {
        if(Response.errors.validate) {
          let Result = AuthenticationService.ErrorValidateProcess(Response.errors.validate) ;
          Result_Process.Result = Process_State.Failed ;
          Result_Process.Data_Fail = {
            Fail_Type : Result.Type ,
            Fail_Reason : Result.Reason
          }
        }
      }
      return Result_Process ;
    }));
  }

  public ReSend_Code(Type : VerifyType , Email : string) {
    let Final_URL : string ;
    switch (Type) {
      case VerifyType.Complete_Process :
        Final_URL = "api/send-code/email/active" ;
        break ;
      case VerifyType.Forget_Password :
        Final_URL = "api/forgot/password/code" ;
        break ;
    }
    return this.Http.post<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}${Final_URL}`, {
      email : Email
    }).pipe(take(1) , map(Response => {
      let Result_Process : ResultProcess = {
        Result : Process_State.UnKnown
      } ;
      if(Response.data) {
        if(Response.data.message) {
          Result_Process.Data_Pass = {
            Data_Type : DataType.message ,
            Get_Data : Response.data.message
          } ;
          Result_Process.Result = Process_State.Succeed ;
        }
      } else if(Response.errors) {
        if(Response.errors.validate) {
          let Result = AuthenticationService.ErrorValidateProcess(Response.errors.validate) ;
          Result_Process.Data_Fail = {
            Fail_Type : Result.Type ,
            Fail_Reason : Result.Reason
          } ;
          Result_Process.Result = Process_State.Failed ;
        }
      }
      return Result_Process ;
    }));
  }

  public Verify_Code(Type : VerifyType , Email : string , Verify_Code : number , Lang : string) {
    let Final_URL : string ;
    switch (Type) {
      case VerifyType.Complete_Process :
        Final_URL = "api/email/active" ;
        break ;
      case VerifyType.Forget_Password :
        Final_URL = "api/forgot/password/check" ;
        break ;
    }
    return this.Http.post<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}${Final_URL}`, {
        email : Email ,
        code : Verify_Code ,
        lang : Lang
      }).pipe(take(1) , map(Response => {
      let Result_Process : ResultProcess = {
        Result : Process_State.UnKnown
      } ;
      if(Response.data) {
        if(Response.data.user) {
          let Result = AuthenticationService.DataProcess(Response.data.user) ;
          this.SendAccount(Result) ;
          Result_Process.Data_Pass = {
            Data_Type : DataType.DataUser
          }
          Result_Process.Result = Process_State.Succeed ;
        }
        else if(Response.data.token) {
          Result_Process.Data_Pass = {
            Data_Type : DataType.Token ,
            Get_Data : Response.data.token
          } ;
          Result_Process.Result = Process_State.Waited ;
        }
      } else if(Response.errors) {
        if(Response.errors.validate) {
          let Result = AuthenticationService.ErrorValidateProcess(Response.errors.validate) ;
          Result_Process.Data_Fail = {
            Fail_Type : Result.Type ,
            Fail_Reason : Result.Reason
          } ;
          Result_Process.Result = Process_State.Failed ;
        } else if(Response.errors.code) {
          Result_Process.Data_Fail = {
            Fail_Type : ErrorType.Code ,
            Fail_Reason : Response.errors.code
          } ;
          Result_Process.Result = Process_State.Failed ;
        }
      }
      return Result_Process ;
    }));
  }

  public ChangePassword(Code : number , Token : string , NewPassword : string) {
    let Options = {
      headers : new HttpHeaders({"Authorization" : `Bearer ${Token}`})
    } ;
    return this.Http.put<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}api/forgot/password/new` , {
       newpassword : NewPassword ,
       code : Code
    } , Options).pipe(take(1) , map(Response => {
      return Process_State.Succeed ;
      /* Process_State.Unknown */
    }));
  }

  public GetObservableAccount() {
    return this.Account.asObservable().pipe(map(Value => {
      if(Value != null)
        return Value.Clone() ;
      return null ;
    }));
  }

  public GetSnapShotAccount() {
    let Copy_Account = this.Account.getValue() ;
    if(Copy_Account != null)
      Copy_Account = Copy_Account.Clone() ;
    return Copy_Account ;
  }

  private GetInformation(Token : string) {
    let Options = {
      headers : new HttpHeaders({"Authorization" : `Bearer ${Token}`})
    } ;
    return this.Http.get<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}api/profile/show` ,
      Options).pipe(take(1) , map(Response => {
        let Result_Process : ResultProcess = {
        Result : Process_State.UnKnown
      } ;
        if(Response.data) {
          if(Response.data.user) {
            Response.data.user.token = Token ;
            let Result = AuthenticationService.DataProcess(Response.data.user) ;
            this.SendAccount(Result) ;
            Result_Process.Data_Pass = {
              Data_Type : DataType.DataUser
            } ;
            Result_Process.Result = Process_State.Succeed ;
          }
        } else if(Response.errors) {
          if(Response.errors.token) {
            Result_Process.Result = Process_State.Failed ;
            Result_Process.Data_Fail = {
              Fail_Type : ErrorType.Token ,
              Fail_Reason : Response.errors.token
            }
          }
        }
        return Result_Process ;
      }));
  }

  private static DataProcess(Data : PersonData_Response) : PersonModel {
    let Person_Image = Data_SharingModel.BackEnd_URL.concat(Data.path_photo) ;
    let Person_Type = PersonModel.Convert2Person(Data.role) ;
    let Person_Phone = (Data.phone != null) ? +Data.phone : undefined ;
    return new PersonModel(Data.id , Data.token , Data.first_name ,
      Data.last_name , Person_Image , Person_Type , Data.email , Person_Phone );
  }

  private static ErrorValidateProcess(ErrorHandle : ErrorValidate_Response) {
    let Error_Description !: {
      Type : ErrorType ,
      Reason : string
    } ;
    for (const ErrorKey in ErrorHandle) {
      let Key = <keyof typeof ErrorHandle> ErrorKey ;
      let Type !: ErrorType ;
      switch(Key) {
        case "email":
          Type = ErrorType.Email ;
          break ;
        case "first_name":
          Type = ErrorType.First_Name ;
          break ;
        case "last_name":
          Type = ErrorType.Last_Name ;
          break ;
        case "password":
          Type = ErrorType.Password ;
          break ;
        case "phone":
          Type = ErrorType.Phone ;
          break ;
      }
      Error_Description = {
        Type : Type ,
        Reason : (<string[]>ErrorHandle[Key])[0]
      } ;
      break ;
    }
    return Error_Description ;
  }

  private SendAccount(Data_Person : PersonModel , KeepAccount : boolean = false) {
    if(KeepAccount)
      this.SaveToken(Data_Person.GetClearToken());
    this.Account.next(Data_Person);
  }

  private SaveToken(Token : string) {
    localStorage.setItem(this.ReferenceStorage , Token);
  }

  private IsSaveToken() {
    let Result : {
      IsSave : boolean ,
      Token ?: string
    } ;
    const DataJson : string | null = localStorage.getItem(this.ReferenceStorage);
    Result = {
      IsSave : (DataJson != null)
    } ;
    if(Result.IsSave)
      Result.Token = DataJson as string ;
    return Result ;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  public UpdateAccount( Info : {
                          Name ?: {
                            first_name: string,
                            last_name: string
                          } ,
                          Password ?: {
                            Old : string ,
                            New : string
                          } ,
                          Email ?: string ,
                          Phone ?: string
                        }) {
    if(this.Account == null)
      return null ;
    let Options = {
      headers : new HttpHeaders({"Authorization" : `${this.Account.getValue()?.GetToken()}`})
    } ;
    let ProcessObservable !: Observable<BackEnd_Response> ;
    let SaveCurrenToken = true ;
    if(Info.Name) {
      ProcessObservable = this.Http.put<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}api/profile/edit`
        , Info.Name , Options) ;
    }
    else if(Info.Password) {
      ProcessObservable = this.Http.put<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}api/profile/edit/password` , {
        newpassword : Info.Password.New ,
        password : Info.Password.Old
      } , Options);
      SaveCurrenToken = false ;
    }
    else if(Info.Email) {
      ProcessObservable = this.Http.put(`${Data_SharingModel.BackEnd_URL}api/profile/edit/email` , {
        email : Info.Email
      } , Options);
      SaveCurrenToken = false ;
    }
    else if(Info.Phone) {
      ProcessObservable = this.Http.put(`${Data_SharingModel.BackEnd_URL}api/profile/edit` , {
        phone : Info.Phone
      } , Options);
    }
    if(ProcessObservable == undefined)
      return null ;
    return ProcessObservable.pipe(take(1) , map(Response => {
      let Result_Process : ResultProcess = {
        Result : Process_State.UnKnown
      } ;
      if(Response.data) {
        if(Response.data.user) {
          if(SaveCurrenToken)
            Response.data.user.token = (<PersonModel>this.Account.getValue()).GetClearToken() ;
          else if(this.IsSaveToken().IsSave)
            this.SaveToken(Response.data.user.token);
          let Result = AuthenticationService.DataProcess(Response.data.user) ;
          this.SendAccount(Result) ;
          Result_Process.Data_Pass = {
            Data_Type : DataType.DataUser
          } ;
          Result_Process.Result = Process_State.Succeed ;
        }
        if(Response.data.message) {
          Result_Process.Data_Pass = {
            Data_Type : DataType.message ,
            Get_Data : Response.data.message
          } ;
          Result_Process.Result = Process_State.Succeed ;
        }
      }
      else if(Response.errors) {
        if(Response.errors.validate) {
          let Result = AuthenticationService.ErrorValidateProcess(Response.errors.validate) ;
          Result_Process.Result = Process_State.Failed ;
          Result_Process.Data_Fail = {
            Fail_Type : Result.Type ,
            Fail_Reason : Result.Reason
          } ;
        }
      }
      return Result_Process ;
    }));
  }

  public RemoveAccount() {
    let Options = {
      headers : new HttpHeaders({"Authorization" : `${this.Account.getValue()?.GetToken()}`})
    } ;
    return this.Http.delete<BackEnd_Response>(`${Data_SharingModel.BackEnd_URL}api/profile/destroy` , Options)
      .pipe(take(1) , map(Response => {
        let Result_Process : ResultProcess = {
          Result : Process_State.UnKnown
        } ;
        if(Response.data) {
          if(Response.data.message) {
            Result_Process.Data_Pass = {
              Data_Type : DataType.message ,
              Get_Data : Response.data.message
            } ;
            Result_Process.Result = Process_State.Succeed ;
            this.Account.next(null)
          }
        }
        return Result_Process ;
      }));
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
}


