import {Component, EventEmitter, Input, Output} from "@angular/core";

interface InitializeSearchField {
  PlaceHolder : string ,
  TimeWait : number ,
  ChangeManual : boolean
}

@Component({
  selector : 'SearchField' ,
  templateUrl : './SearchField.component.html' ,
  styleUrls : ['./SearchField.component.css']
})
export class SearchFieldComponent {

  @Input('Initialization') set Initialize (Data : InitializeSearchField) {
    if(this.IsComplete)
      return ;
    this.PlaceHolder = Data.PlaceHolder ;
    this.TimerWait = Data.TimeWait ;
    this.IsManual = Data.ChangeManual ;
    this.IsComplete = true ;
  }

  @Input('ForceValue') set SetValue(Data : string ) {
    if(!this.IsManual)
      return ;
    this.SearchText = Data ;
  }

  @Output('SearchOut') DataSend : EventEmitter<string> ;

  private TimerFormEdit : number | null ;

  private TimerWait : number ;

  private IsComplete : boolean ;

  private IsManual : boolean ;

  SearchText : string ;

  PlaceHolder : string ;

  constructor() {
    this.SearchText = '' ;
    this.PlaceHolder = 'Search ...' ;
    this.TimerWait = 500 ;
    this.IsComplete = false ;
    this.TimerFormEdit = null ;
    this.IsManual = false ;
    this.DataSend = new EventEmitter<string>() ;
  }

  public WriteSearch(SearchName : Event) {
    if(SearchName.target instanceof HTMLInputElement) {
      let TempWord = SearchName.target.value ;
      if(this.TimerFormEdit != null)
        clearTimeout(this.TimerFormEdit) ;
      this.TimerFormEdit = setTimeout(() => {
        if(TempWord != this.SearchText)
          this.ChangeText(TempWord);
      } , this.TimerWait);
    }
  }

  private ChangeText(Text : string) {
    if(this.TimerFormEdit != null) {
      clearTimeout(this.TimerFormEdit) ;
      this.TimerFormEdit = null ;
    }
    this.SearchText = Text ;
    this.DataSend.emit(Text);
  }
}
