import {Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Subject} from "rxjs";

interface InputPopUp {
  Name : string ,
  PlaceHolder : string ,
  Require : boolean ,
  Pattern : string ,
  Type : string ,
  InitialValue : string ,
}

interface ButtonPopUp {
  Content : string ,
  Method : Function
}

@Component({
  selector : 'PopUp' ,
  templateUrl : './PopUp.component.html' ,
  styleUrls : ['./PopUp.component.css'] ,
  exportAs : 'PopUp'
})
export class PupUpComponent implements OnDestroy{

  @ViewChild('InfoForm') private  InformationForm !: NgForm ;

  public View : boolean ;

  public Title : string ;

  public ErrorText : string | undefined ;

  public Form : {   Input : InputPopUp[] ,
                      ProcessName : string ,

  } | undefined ;

  public Paragraph : string | undefined ;

  public Button : ButtonPopUp[] | undefined ;

  private PopUp_Out !: Subject<NgForm> ;

  private Loading_Process : boolean ;

  constructor() {
    this.View = false ;
    this.Title = "" ;
    this.Loading_Process = false ;
  }

  OpenNotification(title : string , text : string , buttons ?: ButtonPopUp[]) {
    this.ResetPopUp();
    this.Title = title ;
    this.Paragraph = text ;
    this.Button = buttons ;
    this.View = true ;
  }

  OpenForm(title : string , form : {Input : InputPopUp[] , ProcessName : string }
           , buttons ?: ButtonPopUp[]) {
    this.ResetPopUp();
    this.Title = title ;
    this.Form = form ;
    this.Button = buttons ;
    this.PopUp_Out = new Subject<NgForm>();
    this.View = true ;
  }

  ConnectWithForm() {
    return this.PopUp_Out.asObservable();
  }

  SendInfo() {
    this.Loading_Process = true ;
    this.ErrorText = undefined ;
    this.PopUp_Out.next(this.InformationForm) ;
  }

  ErrorOccur(TextError : string) {
    this.ErrorText = TextError ;
    this.Loading_Process = false ;
  }

  ForceLoading(Load : boolean) {
    this.Loading_Process = Load ;
  }

  GetState() {
    return this.Loading_Process ;
  }

  ClosePopUp() {
    this.View = false ;
    if(this.PopUp_Out && !this.PopUp_Out.closed)
      this.PopUp_Out.unsubscribe();
  }

  ngOnDestroy(): void {
    if(this.PopUp_Out)
      this.PopUp_Out.unsubscribe();
  }

  private ResetPopUp(){
    this.Title = "" ;
    this.Form = undefined ;
    this.Paragraph = undefined ;
    this.Button = undefined ;
    this.ErrorText = undefined ;
    this.Loading_Process = false ;
  }

}
