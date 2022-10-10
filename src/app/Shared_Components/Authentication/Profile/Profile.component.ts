import {Component, ViewChild} from "@angular/core";
import {PersonModel} from "../../../Models/Person.model";
import {FormControl} from "@angular/forms";
import {AuthenticationService} from "../Authentication.service";
import {Observable} from "rxjs";
import {Data_SharingModel, Pattern_Type, Process_State} from "../../../Models/Data_Sharing.model";
import {PupUpComponent} from "../../PopUp/PopUp.component";


@Component({
  templateUrl : './Profile.component.html' ,
  styleUrls : ['./Profile.component.css']
})
export class ProfileComponent {

  @ViewChild('PopUp') InfoForm !: PupUpComponent ;

  MyAccount !: PersonModel ;

  constructor(private AuthenticationProcesses : AuthenticationService) {
    this.AuthenticationProcesses.GetObservableAccount().subscribe(Value => {
      if(Value != null){
        this.MyAccount = Value  ;
        console.log(Value.Get_Information().Image.IsDefault);
      }
    });
  }

  FormattingName() {
    let InputFirst = "First Name" ;
    let InputLast = "Last Name" ;
    this.InfoForm.OpenForm('Change Name' , {
      Input : [
        {
          Name : InputFirst ,
          PlaceHolder : 'Enter First Name' ,
          Require : true ,
          Pattern : Data_SharingModel.ReturnPattern(Pattern_Type.First_Name) ,
          Type : 'text' ,
          InitialValue : this.MyAccount.Get_Information().First_Name ,
        } ,
        {
          Name : InputLast ,
          PlaceHolder : 'Enter Last Name' ,
          Require : true ,
          Pattern : Data_SharingModel.ReturnPattern(Pattern_Type.Last_Name) ,
          Type : 'text' ,
          InitialValue : this.MyAccount.Get_Information().Last_Name ,
        } ,
      ] ,
      ProcessName : "Change"
    });
    let Observe = this.InfoForm.ConnectWithForm().subscribe(ValueForm => {
      let First_Name = (<FormControl>ValueForm.form.get(InputFirst)) ;
      let Last_Name = (<FormControl>ValueForm.form.get(InputLast)) ;
      if(ValueForm.form.invalid) {
        if(First_Name.invalid)
          this.InfoForm.ErrorOccur("The First Name Is Wrong Please Try Again");
        else if(Last_Name.invalid)
          this.InfoForm.ErrorOccur("The Last Name Is Wrong Please Try Again");
        return;
      }
      let IsChange = false ;
      if(First_Name.value != this.MyAccount.Get_Information().First_Name)
        IsChange = true ;
      if(Last_Name.value != this.MyAccount.Get_Information().Last_Name)
        IsChange = true ;
      if(IsChange) {
        let ObserveBack = this.AuthenticationProcesses.UpdateAccount({
          Name : {
            first_name : First_Name.value ,
            last_name : Last_Name.value
          }
        }) ;
        if(ObserveBack instanceof Observable)
          ObserveBack.subscribe(Value => {
            switch (Value.Result) {
              case Process_State.Succeed:
                Observe.unsubscribe();
                this.InfoForm.ClosePopUp();
                break ;
              case Process_State.Failed :
                this.InfoForm.ErrorOccur(Value.Data_Fail?.Fail_Reason || '');
                break ;
            }
          });
      } else {
        this.InfoForm.ClosePopUp();
      }
    }) ;
  }

  FormattingEmail() {
    let InputEmail = "Email" ;
    this.InfoForm.OpenForm('Change Email' , {
      Input : [
        {
          Name : InputEmail ,
          PlaceHolder : 'Enter Email' ,
          Require : true ,
          Pattern : Data_SharingModel.ReturnPattern(Pattern_Type.Email) ,
          Type : 'email' ,
          InitialValue : this.MyAccount.Get_Information().email ,
        } ,
      ] ,
      ProcessName : "Change"
    });
    let Observe = this.InfoForm.ConnectWithForm().subscribe(ValueForm => {
      let Email = (<FormControl>ValueForm.form.get(InputEmail)) ;
      if(ValueForm.form.invalid) {
        this.InfoForm.ErrorOccur("The Email Is Wrong Please Try Again");
        return;
      }
      let IsChange = false ;
      if(Email.value != this.MyAccount.Get_Information().email)
        IsChange = true ;
      if(IsChange) {
        let ObserveBack = this.AuthenticationProcesses.UpdateAccount({
          Email : Email.value
        }) ;
        if(ObserveBack instanceof Observable)
          ObserveBack.subscribe(Value => {
            switch (Value.Result) {
              case Process_State.Succeed:
                Observe.unsubscribe();
                this.InfoForm.ClosePopUp();
                console.log("sss");
                /* Verify */
                break ;
              case Process_State.Failed :
                this.InfoForm.ErrorOccur(Value.Data_Fail?.Fail_Reason || '');
                break ;
            }
          });
      } else {
        this.InfoForm.ClosePopUp();
      }
    }) ;
  }

  FormattingPassword() {
    let InputOld = "Old Password" ;
    let InputNew = "New Password" ;
    this.InfoForm.OpenForm('Change Password' , {
      Input : [
        {
          Name : InputOld ,
          PlaceHolder : 'Enter Old Password' ,
          Require : true ,
          Pattern : Data_SharingModel.ReturnPattern(Pattern_Type.Password) ,
          Type : 'password' ,
          InitialValue : '' ,
        } ,
        {
          Name : InputNew ,
          PlaceHolder : 'Enter New Password' ,
          Require : true ,
          Pattern : Data_SharingModel.ReturnPattern(Pattern_Type.Password) ,
          Type : 'password' ,
          InitialValue : '' ,
        }
      ] ,
      ProcessName : "Change"
    });
    let Observe = this.InfoForm.ConnectWithForm().subscribe(ValueForm => {
      let Old = (<FormControl>ValueForm.form.get(InputOld)) ;
      let New = (<FormControl>ValueForm.form.get(InputNew)) ;
      if(ValueForm.form.invalid) {
        if(Old.invalid)
          this.InfoForm.ErrorOccur("The Old Password Field Is Wrong Please Try Again");
        else if(New.invalid)
          this.InfoForm.ErrorOccur("The New Password Field Is Wrong Please Try Again");
        return;
      }
      let ObserveBack = this.AuthenticationProcesses.UpdateAccount({
        Password : {
          Old : Old.value ,
          New : New.value
        }
      }) ;
      if(ObserveBack instanceof Observable)
        ObserveBack.subscribe(Value => {
          switch (Value.Result) {
            case Process_State.Succeed :
              Observe.unsubscribe();
              this.InfoForm.ClosePopUp();
              break ;
            case Process_State.Failed :
              this.InfoForm.ErrorOccur(Value.Data_Fail?.Fail_Reason || '');
              break ;
          }
        });
    }) ;
  }

  FormattingPhone() {
    let InputPhone = "Phone" ;
    this.InfoForm.OpenForm('Change Password' , {
      Input : [
        {
          Name : InputPhone ,
          PlaceHolder : 'Enter Phone' ,
          Require : true ,
          Pattern : Data_SharingModel.ReturnPattern(Pattern_Type.Phone) ,
          Type : 'number' ,
          InitialValue : this.MyAccount.Get_Information().phone+"" || ''  ,
        }
      ] ,
      ProcessName : "Change"
    });
    let Observe = this.InfoForm.ConnectWithForm().subscribe(ValueForm => {
      if(ValueForm.form.invalid) {
        this.InfoForm.ErrorOccur("This Phone Must Be 10 Number");
        return;
      }
      let Phone = (<FormControl>ValueForm.form.get(InputPhone)).value ;
      let ObserveBack = this.AuthenticationProcesses.UpdateAccount({
        Phone : Phone
      }) ;
      if(ObserveBack instanceof Observable)
        ObserveBack.subscribe(Value => {
          switch (Value.Result) {
            case Process_State.Succeed:
              Observe.unsubscribe();
              this.InfoForm.ClosePopUp();
              break ;
            case Process_State.Failed :
              this.InfoForm.ErrorOccur(Value.Data_Fail?.Fail_Reason || '');
              break ;
          }
        });
    }) ;
  }

  CheckImageDetails(ImageElement : Event) {
    let PathImage = ImageElement.target ;
    if(PathImage instanceof HTMLInputElement)
      if(PathImage.files != null) {
        let MaxImageSize = 2097152 ;
        let ImageDimension = {
          MinWidth : 300 ,
          MinHeight : 300
        } ;
        let ImageFile = PathImage.files[0] ;
        if(ImageFile.size > MaxImageSize) {
          this.FormattingErrorPhoto("The Size Photo Is Very Large , it must at most 2MB ") ;
          return ;
        }
        const Reader = new FileReader() ;
        Reader.onload = (AfterLoad )=> {
          const image = new Image();
          image.src = (AfterLoad.target as FileReader).result as string;
          image.onload = (rs) => {
            if(rs.currentTarget instanceof Image) {
              if(rs.currentTarget.height < ImageDimension.MinHeight ||
                  rs.currentTarget.width < ImageDimension.MinWidth) {
                this.FormattingErrorPhoto("The Dimension Photo Is Very Large , it must at lest 300 x 300 ") ;
                return ;
              }
              this.SendImage(ImageFile) ;
            }
          }
        };
        Reader.readAsDataURL(ImageFile);
      }
  }

  FormattingRemove(Type : {
    Phone ?: boolean ,
    Image ?: boolean
  }) {
    this.InfoForm.OpenNotification(`Remove ${(Type.Phone) ? 'Phone' : 'Image'}` ,
      `Are You Sure You Want To Remove This ${(Type.Phone) ? 'Phone' : 'Image'}`
      , [
        {
          Content : "Sure" ,
          Method : ()=>{
            let Observe = this.AuthenticationProcesses.RemoveInfo({
              ...Type
            }) ;
            if(Observe instanceof Observable)
              Observe.subscribe(Value => {
                switch(Value.Result) {
                  case Process_State.Succeed :
                    this.InfoForm.ClosePopUp();
                    break ;
                  case Process_State.Failed :
                    this.InfoForm.ErrorOccur(Value.Data_Fail?.Fail_Reason || '');
                    break ;
                }
              });
          }
        }
      ]);
  }

  FormattingDestroy() {
    this.InfoForm.OpenNotification('Remove Account' ,
      "Are You Sure You Want To Remove This Account"
      , [
      {
          Content : "Sure" ,
          Method : ()=>{
            this.InfoForm.ForceLoading(true);
            this.AuthenticationProcesses.RemoveAccount().subscribe(Value => {
              switch (Value.Result) {
                case Process_State.Succeed:
                  console.log("Refresh") ;
                  /* Route To Logout */
                  break ;
                case Process_State.Failed :
                  this.InfoForm.ErrorOccur(Value.Data_Fail?.Fail_Reason || '');
                  break ;
              }
            });
          }
        }
    ]);
  }

  private SendImage(ImageFile : File) {
    let ImageForm = new FormData() ;
    ImageForm.append('path_photo' , ImageFile , ImageFile.name);
    let ObserveBack = this.AuthenticationProcesses.UpdateAccount({
      Image : ImageForm
    }) ;
    if(ObserveBack instanceof Observable)
      ObserveBack.subscribe(Value => {
        switch (Value.Result) {
          case Process_State.Succeed:
            console.log("True");
            break ;
          case Process_State.Failed :
            this.FormattingErrorPhoto(Value.Data_Fail?.Fail_Reason || '') ;
            break ;
        }
      });
  }

  private FormattingErrorPhoto(ErrorText : string) {
    this.InfoForm.OpenNotification('Wrong Photo' ,
      ErrorText
      );
  }

}
