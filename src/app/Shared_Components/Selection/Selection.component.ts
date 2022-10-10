import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Subject} from "rxjs";


export interface ConnectSelectorFormat {
  Selector ?: {
    OptionRequest : string ,
    CurrentValue : string ,
  } ; //Channel_1
  Other ?: {
    RealValue ?: string ,
    SetName ?: string ,
    Options ?: {
      NameOption : string ,
      IconFontAwesome ?: string
    }[]
  } ; //Channel_2
}

@Component({
  selector : 'Selection' ,
  templateUrl : './Selection.component.html' ,
  styleUrls : ['./Selection.component.css']
})
export class SelectionComponent {

  @Input('Initialization') set Initialize (Data : {
    Options : {
      NameOption : string ,
      IconFontAwesome ?: string ,
    }[] ,
    PlaceHolder : string ,
    AutoChangeValue ?: boolean
  }) {
    if(this.IsComplete)
      return ;
    this.Options = Data.Options ;
    this.PlaceHolder = Data.PlaceHolder ;
    if(Data.AutoChangeValue != undefined)
      this.CanChangeValue = Data.AutoChangeValue ;
    this.IsComplete = true ;
  } ;

  @Input('ForceValue') set SetValue(Value : string) {
    if(this.CanChangeValue)
      return ;
    if(Value != undefined)
      this.SelectText = Value ;
  }

  @Output('Result') OutputData !: EventEmitter<string> ;

  Options : {
    NameOption : string ,
    IconFontAwesome ?: string ,
  }[] ;

  SelectText : string ;

  PlaceHolder : string ;

  ShowOptions : boolean ;

  private IsComplete : boolean ;

  private CanChangeValue : boolean ;

  constructor() {
    this.Options = [] ;
    this.SelectText = '' ;
    this.PlaceHolder = '' ;
    this.ShowOptions = false ;
    this.IsComplete = false ;
    this.CanChangeValue = true ;
    this.OutputData = new EventEmitter<string>() ;
  }

  public SendValue(OptionChoice : string) {
    if(this.CanChangeValue)
      this.SelectText = OptionChoice ;
    if(this.OutputData)
      this.OutputData.emit(OptionChoice);
    this.ChangeState() ;
  }

  public ChangeState() {
    this.ShowOptions = !this.ShowOptions ;
  }
}
