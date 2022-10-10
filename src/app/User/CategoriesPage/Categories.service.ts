import {Injectable} from "@angular/core";
import {CategoryModel} from "../../Models/Category.model";
import {Data_SharingModel, Process_State} from "../../Models/Data_Sharing.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, map, take} from "rxjs";
import {DataUpdate} from "./Categories.component";


interface CategoryResponse {
  id: number ;
  id_parent: number | null ;
  name: string ;
  description: string ;
  path_photo: string ;
  children: number ;
  articles: number ;
  created_at: string ;
  updated_at: string ;
}

interface CategoriesResponse {
  data : {
    paginate : {
        categories : CategoryResponse[] ;
        current_page: number ,
        url_next_page: string ,
        url_first_page: string ,
        url_last_page: string ,
        total_pages: number ,
        total_items: number,
    }
  } ;
}

@Injectable()
export class CategoriesService {

  Parent_ID : number | null ;

  SearchName : string ;

  Page : number ;

  SortBy : string ;

  Ordering : string ;

  ShowPage : number ;

  constructor(private Http : HttpClient) {
    this.Parent_ID = null ;
    this.SearchName = '' ;
    this.Page = 1 ;
    this.SortBy = 'Name' ;
    this.Ordering = 'Descending' ;
    this.ShowPage = 10 ;
  }

  public GetInfoCategory(PassInfo : DataUpdate) {
    let RequestPass = {
      ID : (PassInfo.ID != undefined) ? PassInfo.ID : this.Parent_ID ,
      Name : (PassInfo.SearchName != undefined) ? PassInfo.SearchName : this.SearchName ,
      Page : (PassInfo.Page != undefined) ? PassInfo.Page : this.Page ,
      Sort : (PassInfo.SortBy != undefined) ? PassInfo.SortBy : this.SortBy ,
      Ordering : (PassInfo.Ordering != undefined) ? PassInfo.Ordering : this.Ordering ,
      Show : (PassInfo.ShowPage != undefined) ? PassInfo.ShowPage : this.ShowPage ,
    } ;
    let QueryParams = new HttpParams() ;
    if(RequestPass.ID != null)
      QueryParams = QueryParams.append('id_category' , RequestPass.ID) ;
    QueryParams = QueryParams.append('name' , RequestPass.Name) ;
    QueryParams = QueryParams.append('num_items' , RequestPass.Show) ;
    QueryParams = QueryParams.append('page' , RequestPass.Page) ;
    let SortBy = this.SortedValue(RequestPass.Sort) ;
    if(SortBy != null)
      QueryParams = QueryParams.append('type_order' , SortBy) ;
    let Ordering = this.OrderingValue(RequestPass.Ordering) ;
    if(Ordering != null)
      QueryParams = QueryParams.append('latest' , Ordering) ;
    return this.Http.get<CategoriesResponse>(`${Data_SharingModel.BackEnd_URL}api/category/search`
      , {
        params : QueryParams
      }).pipe(take(1) , map(Response => {
        let Categories : CategoryModel[] = [] ;
        Response.data.paginate.categories.forEach(Value =>
          Categories.push(this.Category_Construct(Value))) ;
        this.ResetData(RequestPass) ;
        return {
          ProcessResult : Process_State.Succeed ,
          Categories : Categories ,
          PageInfo : {
            Page : Response.data.paginate.current_page ,
            TotalPage : Response.data.paginate.total_pages
          }
        } ;
      }) ,
      catchError( ()=>{
        throw {
          ProcessResult : Process_State.UnKnown ,
        }
      }));
  }

  public ResetData(Data ?: {
    ID : number | null ,
    Name : string ,
    Page : number ,
    Sort : string ,
    Ordering : string ,
    Show : number
  }) {
    if(Data) {
      this.Parent_ID = Data.ID ;
      this.SearchName = Data.Name ;
      this.Page = Data.Page ;
      this.SortBy = Data.Sort ;
      this.Ordering = Data.Ordering ;
      this.ShowPage = Data.Show ;
    }
    else {
      this.Parent_ID = null ;
      this.SearchName = '' ;
      this.Page = 1 ;
      this.SortBy = 'Name' ;
      this.Ordering = 'Descending' ;
      this.ShowPage = 10 ;
    }
  }

  private Category_Construct(CategoryBackEnd : CategoryResponse) {
    let Children = (CategoryBackEnd.children == 0) ? undefined : CategoryBackEnd.children ;
    return new CategoryModel(CategoryBackEnd.id , CategoryBackEnd.id_parent , CategoryBackEnd.name ,
      CategoryBackEnd.description , CategoryBackEnd.path_photo , CategoryBackEnd.articles , Children ) ;
  }

  private SortedValue(Option : string) {
    switch(Option) {
      case 'Name' :
        return 'name' ;
      case 'Date' :
        return 'id' ;
      case 'Child' :
        return 'children' ;
    }
    return null ;
  }

  private OrderingValue(Option : string) {
    return Option == 'Descending';
  }
}
