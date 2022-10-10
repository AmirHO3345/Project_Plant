import {Component, Input, OnInit} from "@angular/core";
import {Subject} from "rxjs";



export interface PaginationConnectFormat {
  FromPagination_Channel ?: {
    Sending : number
  } ,
  ToPagination_Channel ?: {
    TotalPage ?: number ,
    PageOfPart ?: number ,
    CurrentPage : number
  }
}

@Component({
  selector : 'Pagination' ,
  templateUrl : 'Pagination.component.html' ,
  styleUrls : ['Pagination.component.css']
})
export class PaginationComponent implements OnInit{

  @Input('Connection') set ConnectWithAnother(Connector : Subject<PaginationConnectFormat>) {
    if(this.IsComplete)
      return ;
    this.Connect = Connector ;
    this.IsComplete = true ;
  }

  private IsComplete : boolean ;

  Connect !: Subject<PaginationConnectFormat> ;

  PageOfPart : number ;

  TotalPage : number ;

  PageCoefficient : number ;

  PaginationItems : boolean[] ;

  constructor() {
    this.PageCoefficient = 0 ;
    this.PageOfPart = 4 ;
    this.TotalPage = 1 ;
    this.PaginationItems = [] ;
    this.IsComplete = false ;
  }

  ngOnInit() {
    if(this.Connect == undefined)
      return ;
    this.Connect.subscribe(Value => {
      if(Value.ToPagination_Channel) {
        let ValueGetter = Value.ToPagination_Channel ;
        if(ValueGetter.PageOfPart == this.PageOfPart && ValueGetter.TotalPage == this.TotalPage
          && ValueGetter.CurrentPage == this.CurrentPage() )
          return ;
        if(ValueGetter.PageOfPart) {
          this.PageOfPart = ValueGetter.PageOfPart ;
        }
        if(ValueGetter.TotalPage) {
          this.TotalPage = ValueGetter.TotalPage ;
        }
        let NewCoefficient : number ;
        if((ValueGetter.CurrentPage/this.PageOfPart) % 1 == 0)
          NewCoefficient =  (ValueGetter.CurrentPage/this.PageOfPart) - 1 ;
        else
          NewCoefficient =  Math.floor(ValueGetter.CurrentPage/this.PageOfPart) ;
        let PageStartNewCoefficient = (NewCoefficient * this.PageOfPart) + 1 ;
        if(this.TotalPage - PageStartNewCoefficient + 1 < this.PageOfPart)
          this.PaginationItems = Array(this.TotalPage - PageStartNewCoefficient + 1).fill(false) ;
        else
          this.PaginationItems = Array(this.PageOfPart).fill(false) ;
        let ModCalc = ValueGetter.CurrentPage % this.PageOfPart ;
        if(ModCalc != 0)
          this.PaginationItems[ModCalc - 1] = true ;
        else
          this.PaginationItems[this.PageOfPart - 1] = true ;
        this.PageCoefficient = NewCoefficient ;
      }
    });
  }

  public SendingPage(Page : number) {
    this.Connect.next({
      FromPagination_Channel : { Sending : Page }
    })
  }

  public SpeedMove(IsNext :boolean) {
    let Temp = this.PageCoefficient ;
    if(IsNext)
      Temp++ ;
    else
      Temp-- ;
    this.SendingPage((Temp * this.PageOfPart) + 1 );
  }

  public CurrentPage() : number {
    let Count = 0 ;
    for(Count ; Count < this.PaginationItems.length ; Count++)
      if(this.PaginationItems[Count])
        break ;
    return (this.PageOfPart * this.PageCoefficient) + Count + 1 ;
  }
}
