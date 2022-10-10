import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CategoryModel} from "../../../Models/Category.model";
import {AuthenticationService} from "../../../Shared_Components/Authentication/Authentication.service";
import {Person} from "../../../Models/Person.model";

@Component({
  selector : 'Category' ,
  templateUrl : './Category.component.html' ,
  styleUrls : ['./Category.component.css']
})
export class CategoryComponent {

  @Input('Information') CategoryInfo !: CategoryModel ;

  @Output('Result') OutputEvent : EventEmitter<Command_Type> ;

  constructor(private AuthenticationProcesses : AuthenticationService) {
    this.OutputEvent = new EventEmitter<Command_Type>();
  }

  public SendShowArticleCommand() {
    this.OutputEvent.emit(Command_Type.Show_Articles) ;
  }

  public SendShowCategoryCommand() {
    this.OutputEvent.emit(Command_Type.Show_Category) ;
  }

  public SendRemoveCategoryCommand() {
    let Account = this.AuthenticationProcesses.GetSnapShotAccount() ;
    if(Account != null)
      if(Account.GetType() == Person.Admin)
        this.OutputEvent.emit(Command_Type.Remove_Category) ;
  }

  public CountUnit(AnyNumber : number) {
    let Result : {
      Count : number ,
      Symbol : string
    } = {
      Count : AnyNumber ,
      Symbol : ''
    }
    if(AnyNumber/1000 < 1)
      Result = {
        Count : AnyNumber ,
        Symbol : ''
      } ;
    if(AnyNumber/1000 >= 1)
      Result = {
        Count : AnyNumber - 1000 ,
        Symbol : 'K'
      } ;
    if(AnyNumber/1000000 >= 1)
      Result = {
        Count : AnyNumber - 1000000 ,
        Symbol : 'M'
      } ;
    if(AnyNumber/1000000000 >= 1)
      Result = {
        Count : AnyNumber - 1000000000 ,
        Symbol : 'B'
      } ;
    return Result ;
  }

}

export enum Command_Type {
  Show_Articles ,
  Show_Category ,
  Remove_Category
}
