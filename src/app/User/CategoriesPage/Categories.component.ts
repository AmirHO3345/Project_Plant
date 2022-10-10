import {AfterViewInit, Component} from "@angular/core";
import {CategoryModel} from "../../Models/Category.model";
import {ActivatedRoute, Router} from "@angular/router";
import {PaginationConnectFormat} from "../../Shared_Components/Pagination/Pagination.component";
import {CategoriesService} from "./Categories.service";
import {Command_Type} from "./Category_Item/Category.component";
import {Subject} from "rxjs";


export interface DataUpdate {
  ID ?: number | null ;
  SearchName ?: string | null ;
  Page ?: number | null ;
  SortBy ?: string ;
  Ordering ?: string ;
  ShowPage ?: number ;
}

@Component({
  templateUrl : './Categories.component.html' ,
  styleUrls : ['./Categories.component.css'] ,
  providers : [CategoriesService]
})
export class CategoriesComponent implements AfterViewInit {

  private readonly Selectors : {
    Name : string ,
    Reference : string
  }[] ;

  private readonly RouterNames : string[] ;

  private TimerFormEdit : number | null ;

  private readonly Pagination : Subject<PaginationConnectFormat> ;

  private SearchName : string ;

  Categories : CategoryModel[] ;

  IsLoading : boolean ;

  constructor(private CurrentRouterPage : ActivatedRoute , private RouterPage : Router ,
              private CategoriesProcess : CategoriesService) {
    this.SearchName = '' ;
    this.Categories = [] ;
    this.TimerFormEdit = null ;
    this.IsLoading = false ;
    this.Pagination = new Subject<PaginationConnectFormat>() ;
    this.Selectors = [
      {
        Name : 'SortBy' ,
        Reference : ''
      } ,
      {
        Name : 'Ordering' ,
        Reference : ''
      } ,
      {
        Name : 'Show' ,
        Reference : ''
      } ,
    ] ;
    this.RouterNames = ['id' , 'name' , 'page' , 'show' , 'sort' , 'ordering' ] ;
  }

  ngAfterViewInit() {
    this.CurrentRouterPage.queryParams.subscribe(ParamsRoute => {
      let NextInfo : DataUpdate = {
        ID : +ParamsRoute[this.RouterNames[0]] || undefined ,
        SearchName : ParamsRoute[this.RouterNames[1]] || undefined ,
        Page : +ParamsRoute[this.RouterNames[2]] || undefined ,
        ShowPage : +ParamsRoute[this.RouterNames[3]] || undefined ,
        SortBy : ParamsRoute[this.RouterNames[4]] || undefined ,
        Ordering : ParamsRoute[this.RouterNames[5]] || undefined
      } ;
      this.FetchCategories(NextInfo) ;
    }) ;
    this.Pagination.subscribe(Value => {
      if(Value.FromPagination_Channel) {
        this.RouterPage.navigate(['.'] , {
          relativeTo : this.CurrentRouterPage ,
          queryParamsHandling : "merge" ,
          queryParams : {
            [this.RouterNames[2]] : Value.FromPagination_Channel.Sending
          }
        })
      }
    }) ;
  }

  public InitializeSelector(SelectorName : string) {
    switch (SelectorName) {
      case this.Selectors[1].Name :
        return {
          Options : [
            {NameOption : 'Descending'} ,
            {NameOption : 'Progressive'} ,
          ] ,
          PlaceHolder : 'Ordering' ,
          AutoChangeValue : false ,
        } ;
      case this.Selectors[2].Name :
        return {
          Options : [
            {NameOption : '10'} ,
            {NameOption : '25'} ,
            {NameOption : '50'}
          ] ,
          PlaceHolder : 'Show Page' ,
          AutoChangeValue : false ,
        } ;
    }
    return {
      Options : [
        {NameOption : 'Name'} ,
        {NameOption : 'Date'} ,
      ] ,
      PlaceHolder : 'Sort By' ,
      AutoChangeValue : false ,
    } ;
  }

  public AdjustmentSelector(SelectorName : string , Value : string) {
    let QueryObject = {} ;
    switch (SelectorName) {
      case this.Selectors[0].Name :
        QueryObject = {
          [this.RouterNames[4]] : Value
        } ;
        break ;
      case this.Selectors[1].Name :
        QueryObject = {
          [this.RouterNames[5]] : Value
        } ;
        break ;
      case this.Selectors[2].Name :
        QueryObject = {
          [this.RouterNames[3]] : Value ,
          [this.RouterNames[2]] : 1 ,
        } ;
        break ;
    }
    this.RouterPage.navigate(['.'] , {
      relativeTo : this.CurrentRouterPage ,
      queryParamsHandling : 'merge' ,
      queryParams : {...QueryObject}
    }) ;
  }

  public AdjustmentName(SearchName : string) {
    this.RouterPage.navigate(['.'] , {
      relativeTo : this.CurrentRouterPage ,
      queryParamsHandling : "merge" ,
      queryParams : {
        [this.RouterNames[1]] : (SearchName != '') ? SearchName : null ,
        [this.RouterNames[2]] : 1 ,
      }
    });
  }

  public Adjustment_ID(CommandType : Command_Type , Category : CategoryModel) {
    switch (CommandType) {
      case Command_Type.Show_Category :
        this.RouterPage.navigate(['.'] , {
          relativeTo : this.CurrentRouterPage ,
          queryParamsHandling : '' ,
          queryParams : {
            [this.RouterNames[0]] : Category.Get_Information().Category_ID ,
          }
        });
        break ;
      case Command_Type.Show_Articles:
        /* Move To Route Article */
        break ;
      case Command_Type.Remove_Category:
        /* Command */
        break ;
    }

  }

  public GetSelector() {
    return this.Selectors ;
  }

  public GetConnectPagination() {
    return this.Pagination ;
  }

  public GetSearchText() {
    return this.SearchName ;
  }

  private FetchCategories(InfoUpdate : DataUpdate) {
    if(this.IsLoading)
      return ;
    this.IsLoading = true ;
    this.CategoriesProcess.ResetData() ;
    this.CategoriesProcess.GetInfoCategory(InfoUpdate).subscribe(Value => {
      this.Categories = Value.Categories ;
      this.Pagination.next({
        ToPagination_Channel : {
          CurrentPage : Value.PageInfo.Page ,
          TotalPage : Value.PageInfo.TotalPage
        }
      });
      for (let Info in InfoUpdate) {
        let KeyInfo = <keyof DataUpdate> Info ;
        switch (KeyInfo) {
          case "SearchName" :
            this.SearchName = (InfoUpdate.SearchName != null ) ? InfoUpdate.SearchName : '' ;
            break ;
          case "ShowPage":
              this.Selectors[2].Reference = (InfoUpdate.ShowPage != undefined) ?
                InfoUpdate.ShowPage+'' : '' ;
            break ;
          case "SortBy":
              this.Selectors[0].Reference = (InfoUpdate.SortBy != undefined) ?
                InfoUpdate.SortBy : '' ;
            break ;
          case "Ordering":
              this.Selectors[1].Reference = (InfoUpdate.Ordering != undefined) ?
                InfoUpdate.Ordering : '' ;
            break;
        }
      }
      this.IsLoading = false ;
      /* Scrolling */
    } , (Value) => {
      console.log(Value);
    });
  }
}
